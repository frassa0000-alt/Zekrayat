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

// Validate connection to Firestore on boot as requested by skill
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

// Sign in with Google
export async function signInWithGoogle(): Promise<FirebaseUser | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    if (user) {
      // Ensure user doc exists in /users/{userId}
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef).catch((e) => {
        handleFirestoreError(e, OperationType.GET, `users/${user.uid}`);
      });
      if (!userSnap || !userSnap.exists()) {
        const userData: Record<string, any> = {
          uid: user.uid,
          email: user.email || '',
          createdAt: new Date().toISOString(),
        };
        if (user.displayName) userData.displayName = user.displayName;
        if (user.photoURL) userData.photoURL = user.photoURL;
        await setDoc(userRef, userData).catch((e) => {
          handleFirestoreError(e, OperationType.CREATE, `users/${user.uid}`);
        });
      }
    }
    return user;
  } catch (err: any) {
    console.error('Google Sign In Error:', err);
    throw err;
  }
}

// Sign out
export async function logoutUser(): Promise<void> {
  await fbSignOut(auth);
}

// Save chat memory to user's subcollection
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
  // First ensure user doc exists in /users/{userId}
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef).catch((e) => {
    handleFirestoreError(e, OperationType.GET, `users/${userId}`);
  });
  if (!userSnap || !userSnap.exists()) {
    const curUser = auth.currentUser;
    const userData: Record<string, any> = {
      uid: userId,
      email: curUser?.email || '',
      createdAt: new Date().toISOString(),
    };
    if (curUser?.displayName) userData.displayName = curUser.displayName;
    if (curUser?.photoURL) userData.photoURL = curUser.photoURL;
    await setDoc(userRef, userData).catch((e) => {
      handleFirestoreError(e, OperationType.CREATE, `users/${userId}`);
    });
  }

  const now = new Date().toISOString();
  // Firestore document limit is ~1MB; truncate rawContent to 750,000 chars if exceeded
  const safeContent = chatData.rawContent.length > 750000 
    ? chatData.rawContent.slice(0, 750000) 
    : chatData.rawContent;

  const chatPath = `users/${userId}/savedChats/${chatData.id}`;
  const docRef = doc(db, 'users', userId, 'savedChats', chatData.id);

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

  try {
    await setDoc(docRef, payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, chatPath);
  }
}

// Delete chat memory
export async function deleteUserChat(userId: string, chatId: string): Promise<void> {
  const chatPath = `users/${userId}/savedChats/${chatId}`;
  try {
    await deleteDoc(doc(db, 'users', userId, 'savedChats', chatId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, chatPath);
  }
}

// Subscribe to user's saved chats
export function subscribeToUserChats(
  userId: string,
  onUpdate: (chats: SavedChatRecord[]) => void,
  onError?: (error: Error) => void
): () => void {
  const collectionPath = `users/${userId}/savedChats`;
  const chatsCol = collection(db, 'users', userId, 'savedChats');

  return onSnapshot(
    chatsCol,
    (snapshot) => {
      const records: SavedChatRecord[] = [];
      snapshot.forEach((doc) => {
        records.push(doc.data() as SavedChatRecord);
      });
      // Sort newest first
      records.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onUpdate(records);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, collectionPath);
      } catch (err) {
        if (onError && err instanceof Error) {
          onError(err);
        }
      }
    }
  );
}

export { onAuthStateChanged };
export type { FirebaseUser };
