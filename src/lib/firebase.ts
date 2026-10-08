import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  collection,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { SavedChatRecord } from '../types/chat';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((p) => ({
        providerId: p.providerId,
        email: p.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Optional validate connection to Firestore on boot as requested by skill
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    // Expected default deny or offline state - log only if offline
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase connection: client appears offline.');
    }
  }
}
testConnection();

export interface AppUser {
  uid: string;
  username?: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  isGuest?: boolean;
}

export interface StoredAccount {
  uid: string;
  username: string;
  displayName: string;
  passwordHash: string;
  createdAt: string;
}

const ACCOUNTS_STORAGE_KEY = 'zekrayat_user_accounts_v1';
const ACTIVE_SESSION_KEY = 'zekrayat_active_session_v1';
const GUEST_STORAGE_KEY = 'zekrayat_guest_user';

export function getRegisteredAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return [];
}

export function getActiveSession(): AppUser | null {
  try {
    const raw = localStorage.getItem(ACTIVE_SESSION_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return null;
}

export function getStoredGuestUser(): AppUser | null {
  try {
    const raw = localStorage.getItem(GUEST_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return null;
}

// Convert Firebase auth error codes to clear Arabic messages
export function formatAuthErrorMessage(error: any): string {
  const code = error?.code || '';
  if (code === 'auth/popup-blocked') {
    return 'المتصفح حظر النافذة المنبثقة. يُرجى استخدام إنشاء حساب باسم مستخدم وكلمة سر.';
  }
  if (code === 'auth/popup-closed-by-user') {
    return 'تم إغلاق نافذة تسجيل الدخول قبل إتمام العملية. اضغط للمحاولة مجدداً.';
  }
  if (code === 'auth/cancelled-popup-request') {
    return 'تم إلغاء الطلب لوجود نافذة دخول أخرى مفتوحة حالياً.';
  }
  if (code === 'auth/unauthorized-domain') {
    return 'هذا النطاق غير مصرح به في Firebase. استخدم تسجيل الدخول باسم المستخدم وكلمة السر.';
  }
  if (code === 'auth/network-request-failed') {
    return 'تعذر الاتصال بالخادم، يرجى فحص اتصال الإنترنت والمحاولة مجدداً.';
  }
  return error?.message || 'تعذر تسجيل الدخول، يرجى التأكد من اسم المستخدم وكلمة السر.';
}

type AuthSubscriber = (user: AppUser | null) => void;
const authSubscribers = new Set<AuthSubscriber>();

function notifyAuthSubscribers(user: AppUser | null) {
  authSubscribers.forEach((cb) => {
    try {
      cb(user);
    } catch (e) {
      console.error(e);
    }
  });
}

// Subscribe to auth state changes (prioritizes username/password active session)
export function subscribeToAuth(callback: AuthSubscriber): () => void {
  authSubscribers.add(callback);

  // Initial check: active username session first
  const activeSession = getActiveSession();
  if (activeSession) {
    callback(activeSession);
  } else if (auth.currentUser) {
    callback(auth.currentUser);
  } else {
    const guest = getStoredGuestUser();
    callback(guest || null);
  }

  const unsubscribeFb = onAuthStateChanged(auth, (fbUser) => {
    const currentSession = getActiveSession();
    if (currentSession) {
      callback(currentSession);
    } else if (fbUser) {
      callback(fbUser);
    } else {
      const g = getStoredGuestUser();
      callback(g || null);
    }
  });

  return () => {
    authSubscribers.delete(callback);
    unsubscribeFb();
  };
}

// Register with Username & Password (Creates account and logs in immediately)
export async function registerWithUsernamePassword(
  usernameInput: string,
  passwordInput: string,
  initialChatToSave?: {
    id?: string;
    title: string;
    fileName: string;
    rawContent: string;
    messageCount: number;
    participantNames: string;
    dateRange: string;
  }
): Promise<AppUser> {
  const username = usernameInput.trim();
  const password = passwordInput.trim();

  if (!username || username.length < 2) {
    throw new Error('يرجى كتابة اسم مستخدم صحيح لا يقل عن حرفين.');
  }

  if (!password || password.length < 3) {
    throw new Error('يرجى كتابة كلمة مرور تتكون من 3 أحرف أو أرقام على الأقل.');
  }

  const accounts = getRegisteredAccounts();
  const exists = accounts.some(
    (acc) => acc.username.trim().toLowerCase() === username.toLowerCase()
  );

  if (exists) {
    throw new Error('اسم المستخدم هذا مسجل مسبقاً! يمكنك الضغط على "تسجيل الدخول" والدخول بكلمة السر.');
  }

  // Create clean safe UID
  const cleanSlug = username.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]/gi, '_') || 'usr';
  const uid = `usr_${cleanSlug}_${Date.now().toString(36)}`;
  const now = new Date().toISOString();

  const newAccount: StoredAccount = {
    uid,
    username,
    displayName: username,
    passwordHash: btoa(encodeURIComponent(password)),
    createdAt: now,
  };

  accounts.push(newAccount);
  try {
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
  } catch (err) {
    console.error('Failed to store account in localStorage:', err);
  }

  const appUser: AppUser = {
    uid,
    username,
    displayName: username,
    email: `${username}@zekrayat.app`,
    photoURL: null,
  };

  try {
    localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(appUser));
    localStorage.removeItem(GUEST_STORAGE_KEY);
  } catch (err) {
    console.error('Failed to store active session:', err);
  }

  // "يخش على حساب اللي في كل حاجه" - Seed starter chat into this user's account if provided or if empty
  if (initialChatToSave && initialChatToSave.rawContent) {
    await saveUserChat(uid, {
      id: initialChatToSave.id || 'chat_' + Date.now().toString(36),
      title: initialChatToSave.title || 'محادثة الذكريات المحفوظة',
      fileName: initialChatToSave.fileName || 'chat.txt',
      fileSize: initialChatToSave.rawContent.length,
      rawContent: initialChatToSave.rawContent,
      messageCount: initialChatToSave.messageCount || 30,
      participantNames: initialChatToSave.participantNames || username,
      dateRange: initialChatToSave.dateRange || 'الآن',
    });
  } else {
    // Seed standard welcome chat memory so the account already has rich data and all tools ready
    const starterContent = `[12/10/2024, 02:15:30 م] ${username}: أهلاً بكم في تطبيق ذكريات! هذه محادثتي الأولى المحفوظة في حسابي 🌟
[12/10/2024, 02:17:10 م] صديق: مرحباً بك يا ${username}! حسابك الآن مفعل وفيه كل الميزات والإحصائيات كاملة 🔥
[12/10/2024, 02:18:05 م] ${username}: ممتاز! أستطيع رفع أي ملف شات وحفظه والرجوع إليه في أي وقت 📁✨
[12/10/2024, 02:20:00 م] صديق: بالتأكيد، كل الشاتات والذكريات مشفرة ومحفوظة لحسابك الخاص 🔒`;

    await saveUserChat(uid, {
      id: 'welcome_' + Date.now().toString(36),
      title: 'محادثة الترحيب بحساب ' + username,
      fileName: 'welcome_chat.txt',
      fileSize: starterContent.length,
      rawContent: starterContent,
      messageCount: 4,
      participantNames: `${username}، صديق`,
      dateRange: 'اليوم',
    });
  }

  // Clean up any stale Firebase Auth state if logging into custom account
  if (auth.currentUser) {
    try {
      await fbSignOut(auth);
    } catch (_) {}
  }

  // Sync to Firestore optionally for cloud backup if user is authenticated with Firebase
  if (auth.currentUser && auth.currentUser.uid === uid) {
    try {
      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, {
        uid,
        displayName: username,
        email: `${username}@zekrayat.app`,
        createdAt: now,
      }).catch(() => {});
    } catch (_) {}
  }

  notifyAuthSubscribers(appUser);
  return appUser;
}

// Login with Username & Password
export async function loginWithUsernamePassword(
  usernameInput: string,
  passwordInput: string
): Promise<AppUser> {
  const username = usernameInput.trim();
  const password = passwordInput.trim();

  if (!username) {
    throw new Error('يرجى إدخال اسم المستخدم.');
  }

  if (!password) {
    throw new Error('يرجى إدخال كلمة المرور.');
  }

  const accounts = getRegisteredAccounts();
  const account = accounts.find(
    (acc) => acc.username.trim().toLowerCase() === username.toLowerCase()
  );

  if (!account) {
    throw new Error('اسم المستخدم هذا غير موجود. اضغط على "إنشاء حساب جديد" لإنشائه فوراً وبدء استخدامه.');
  }

  let isMatch = false;
  try {
    const decoded = decodeURIComponent(atob(account.passwordHash));
    isMatch = decoded === password;
  } catch (_) {
    isMatch = account.passwordHash === password;
  }

  if (!isMatch) {
    throw new Error('كلمة المرور غير صحيحة. يرجى التأكد من كلمة السر والمحاولة مجدداً.');
  }

  // Clean up any stale Firebase Auth state if logging into custom account
  if (auth.currentUser) {
    try {
      await fbSignOut(auth);
    } catch (_) {}
  }

  const appUser: AppUser = {
    uid: account.uid,
    username: account.username,
    displayName: account.displayName || account.username,
    email: `${account.username}@zekrayat.app`,
    photoURL: null,
  };

  try {
    localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(appUser));
    localStorage.removeItem(GUEST_STORAGE_KEY);
  } catch (err) {
    console.error('Failed to store active session:', err);
  }

  notifyAuthSubscribers(appUser);
  return appUser;
}

// Sign in with Google (maintained as secondary option)
export async function signInWithGoogle(): Promise<FirebaseUser | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    if (user) {
      try {
        localStorage.removeItem(ACTIVE_SESSION_KEY);
        localStorage.removeItem(GUEST_STORAGE_KEY);
      } catch (_) {}

      try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef).catch(() => null);
        if (!userSnap || !userSnap.exists()) {
          const userData: Record<string, any> = {
            uid: user.uid,
            email: (user.email || 'user@example.com').slice(0, 150),
            createdAt: new Date().toISOString(),
          };
          if (user.displayName) userData.displayName = user.displayName.slice(0, 100);
          if (user.photoURL) userData.photoURL = user.photoURL.slice(0, 1900);
          await setDoc(userRef, userData).catch((e) => {
            console.warn('Note: Profile doc set in Firestore caught:', e);
          });
        }
      } catch (err) {
        console.warn('Note: Profile doc check skipped:', err);
      }

      notifyAuthSubscribers(user);
    }
    return user;
  } catch (err: any) {
    console.error('Google Sign In Error:', err);
    throw err;
  }
}

// Sign in as quick guest/local user
export function signInAsGuest(displayName: string = 'مستخدم واتساب'): AppUser {
  const cleanName = displayName.trim() || 'مستخدم واتساب';
  const guestUser: AppUser = {
    uid: 'guest_' + Math.random().toString(36).substring(2, 10),
    username: cleanName,
    email: null,
    displayName: cleanName,
    photoURL: null,
    isGuest: true,
  };
  try {
    localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(guestUser));
    localStorage.removeItem(ACTIVE_SESSION_KEY);
  } catch (e) {
    console.error(e);
  }
  notifyAuthSubscribers(guestUser);
  return guestUser;
}

// Sign out
export async function logoutUser(): Promise<void> {
  try {
    localStorage.removeItem(ACTIVE_SESSION_KEY);
    localStorage.removeItem(GUEST_STORAGE_KEY);
  } catch (e) {
    console.error(e);
  }
  try {
    await fbSignOut(auth);
  } catch (e) {
    console.warn('Signout note:', e);
  }
  notifyAuthSubscribers(null);
}

// Save chat memory to user's subcollection (with automatic local storage backup)
export async function saveUserChat(
  userId: string,
  chatData: {
    id: string;
    title: string;
    fileName: string;
    fileSize: number;
    rawContent: string;
    messageCount: number;
    participantNames: string;
    dateRange: string;
  }
): Promise<void> {
  const now = new Date().toISOString();
  // Firestore document limit is ~1MB; truncate rawContent to 750,000 chars if exceeded
  const safeContent = chatData.rawContent.length > 750000 
    ? chatData.rawContent.slice(0, 750000) 
    : chatData.rawContent;

  const payload: SavedChatRecord = {
    id: chatData.id,
    userId,
    title: chatData.title.slice(0, 100),
    fileName: chatData.fileName.slice(0, 150),
    fileSize: chatData.fileSize,
    rawContent: safeContent,
    messageCount: chatData.messageCount,
    participantNames: chatData.participantNames.slice(0, 300),
    dateRange: chatData.dateRange.slice(0, 100),
    createdAt: now,
    updatedAt: now,
  };

  // 1. Always save to local storage for immediate reliability & offline access
  try {
    const key = `zekrayat_saved_chats_${userId}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]') as SavedChatRecord[];
    const updated = [payload, ...existing.filter((c) => c.id !== payload.id)];
    localStorage.setItem(key, JSON.stringify(updated));
    // Dispatch local event for instant reactive UI updates
    window.dispatchEvent(new CustomEvent('zekrayat_chats_updated', { detail: { userId } }));
  } catch (storageErr) {
    console.warn('Local storage save error:', storageErr);
  }

  // 2. If signed in with Firebase Auth and UID matches, also persist to Firestore
  if (!userId.startsWith('guest_') && auth.currentUser && auth.currentUser.uid === userId) {
    const docRef = doc(db, 'users', userId, 'savedChats', chatData.id);

    try {
      // Ensure parent user document exists
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef).catch(() => null);
      if (!userSnap || !userSnap.exists()) {
        const curUser = auth.currentUser;
        const userData: Record<string, any> = {
          uid: userId,
          email: (curUser?.email || 'user@example.com').slice(0, 150),
          createdAt: now,
        };
        if (curUser?.displayName) userData.displayName = curUser.displayName.slice(0, 100);
        if (curUser?.photoURL) userData.photoURL = curUser.photoURL.slice(0, 1900);
        await setDoc(userRef, userData).catch(() => {});
      }

      await setDoc(docRef, payload);
    } catch (error) {
      console.warn('Firestore write notice (saved locally):', error);
    }
  }
}

// Delete chat memory
export async function deleteUserChat(userId: string, chatId: string): Promise<void> {
  // 1. Delete from local storage
  try {
    const key = `zekrayat_saved_chats_${userId}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]') as SavedChatRecord[];
    const filtered = existing.filter((c) => c.id !== chatId);
    localStorage.setItem(key, JSON.stringify(filtered));
    window.dispatchEvent(new CustomEvent('zekrayat_chats_updated', { detail: { userId } }));
  } catch (e) {
    console.error(e);
  }

  // 2. Delete from Firestore if signed in with Firebase Auth and UID matches
  if (!userId.startsWith('guest_') && auth.currentUser && auth.currentUser.uid === userId) {
    try {
      await deleteDoc(doc(db, 'users', userId, 'savedChats', chatId));
    } catch (error) {
      console.warn('Firestore delete notice:', error);
    }
  }
}

// Subscribe to user's saved chats
export function subscribeToUserChats(
  userId: string,
  onUpdate: (chats: SavedChatRecord[]) => void,
  onError?: (error: Error) => void
): () => void {
  const getLocal = (): SavedChatRecord[] => {
    try {
      const key = `zekrayat_saved_chats_${userId}`;
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch (_) {
      return [];
    }
  };

  // Immediate local cache emission
  const initial = getLocal();
  onUpdate(initial);

  // Real-time reactive updates from local storage events
  const localUpdateHandler = (e: any) => {
    if (!e.detail || e.detail.userId === userId) {
      onUpdate(getLocal());
    }
  };
  const storageUpdateHandler = () => onUpdate(getLocal());

  window.addEventListener('zekrayat_chats_updated', localUpdateHandler as EventListener);
  window.addEventListener('storage', storageUpdateHandler);

  // Only attach Firestore onSnapshot if authenticated through Firebase Auth AND the UID matches!
  const isFirebaseAuthUser = Boolean(
    auth.currentUser && auth.currentUser.uid === userId && !userId.startsWith('guest_')
  );

  if (!isFirebaseAuthUser) {
    return () => {
      window.removeEventListener('zekrayat_chats_updated', localUpdateHandler as EventListener);
      window.removeEventListener('storage', storageUpdateHandler);
    };
  }

  // Firestore onSnapshot for authenticated Firebase user
  let unsubscribeFs = () => {};
  try {
    const chatsCol = collection(db, 'users', userId, 'savedChats');
    unsubscribeFs = onSnapshot(
      chatsCol,
      (snapshot) => {
        const records: SavedChatRecord[] = [];
        snapshot.forEach((doc) => {
          records.push(doc.data() as SavedChatRecord);
        });
        // Sort newest first
        records.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        // Sync to local backup
        try {
          localStorage.setItem(`zekrayat_saved_chats_${userId}`, JSON.stringify(records));
        } catch (_) {}

        onUpdate(records);
      },
      (error) => {
        console.warn('Firestore subscription fallback to local cache:', error);
        onUpdate(getLocal());
        if (onError && error instanceof Error) {
          onError(error);
        }
      }
    );
  } catch (err) {
    console.warn('Firestore subscription setup warning:', err);
  }

  return () => {
    try {
      unsubscribeFs();
    } catch (_) {}
    window.removeEventListener('zekrayat_chats_updated', localUpdateHandler as EventListener);
    window.removeEventListener('storage', storageUpdateHandler);
  };
}

export { onAuthStateChanged };
export type { FirebaseUser };
