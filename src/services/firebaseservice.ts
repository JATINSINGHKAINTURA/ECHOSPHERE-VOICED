import {
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  addDoc,
} from 'firebase/firestore';
import { db } from '../lib/firebase.js';
import type { User } from 'firebase/auth';
import type { Conversation, Message } from '../types/chat.js';

export interface SavedTranscription {
  id: string;
  userId: string;
  text: string;
  timestamp: string;
}

export async function syncUserProfile(user: User): Promise<void> {
  try {
    const userRef = doc(db, 'users', user.uid);
    await setDoc(
      userRef,
      {
        uid: user.uid,
        displayName: user.displayName || 'Anonymous User',
        email: user.email || '',
        photoURL: user.photoURL || '',
        lastLoginAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (err) {
    console.warn('Firestore syncUserProfile warning:', err);
  }
}

export async function saveUserConversation(userId: string, conv: Conversation): Promise<void> {
  try {
    const convRef = doc(db, 'users', userId, 'conversations', conv.id);
    await setDoc(
      convRef,
      {
        id: conv.id,
        userId,
        title: conv.title,
        language: conv.language || 'en-US',
        createdAt: conv.createdAt,
        updatedAt: conv.updatedAt,
      },
      { merge: true }
    );
  } catch (err) {
    console.warn('Firestore saveUserConversation error:', err);
  }
}

export async function saveUserMessage(
  userId: string,
  conversationId: string,
  message: Message & { searchSources?: Array<{ title: string; url: string }> }
): Promise<void> {
  try {
    const msgRef = doc(db, 'users', userId, 'conversations', conversationId, 'messages', message.id);
    await setDoc(msgRef, {
      id: message.id,
      conversationId,
      userId,
      role: message.role,
      content: message.content,
      timestamp: message.timestamp,
      actionRequired: message.actionRequired || null,
      searchSources: message.searchSources || null,
    });
  } catch (err) {
    console.warn('Firestore saveUserMessage error:', err);
  }
}

export async function fetchUserConversations(userId: string): Promise<Conversation[]> {
  try {
    const convCol = collection(db, 'users', userId, 'conversations');
    const q = query(convCol, orderBy('updatedAt', 'desc'));
    const snapshot = await getDocs(q);

    const conversations: Conversation[] = [];
    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      // Fetch messages
      const msgsCol = collection(db, 'users', userId, 'conversations', docSnap.id, 'messages');
      const msgsQ = query(msgsCol, orderBy('timestamp', 'asc'));
      const msgsSnap = await getDocs(msgsQ);
      const messages: Message[] = msgsSnap.docs.map((m) => m.data() as Message);

      conversations.push({
        id: docSnap.id,
        title: data.title || 'Untitled Session',
        language: data.language || 'en-US',
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString(),
        messages,
      });
    }
    return conversations;
  } catch (err) {
    console.warn('Firestore fetchUserConversations error:', err);
    return [];
  }
}

export async function deleteUserConversation(userId: string, conversationId: string): Promise<void> {
  try {
    const convRef = doc(db, 'users', userId, 'conversations', conversationId);
    await deleteDoc(convRef);
  } catch (err) {
    console.warn('Firestore deleteUserConversation error:', err);
  }
}

export async function saveTranscription(userId: string, text: string): Promise<SavedTranscription> {
  try {
    const colRef = collection(db, 'users', userId, 'transcriptions');
    const docRef = await addDoc(colRef, {
      userId,
      text,
      timestamp: new Date().toISOString(),
    });
    return {
      id: docRef.id,
      userId,
      text,
      timestamp: new Date().toISOString(),
    };
  } catch (err) {
    console.warn('Firestore saveTranscription error:', err);
    return {
      id: 'local-' + Date.now(),
      userId,
      text,
      timestamp: new Date().toISOString(),
    };
  }
}

export async function fetchUserTranscriptions(userId: string): Promise<SavedTranscription[]> {
  try {
    const colRef = collection(db, 'users', userId, 'transcriptions');
    const q = query(colRef, orderBy('timestamp', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<SavedTranscription, 'id'>),
    }));
  } catch (err) {
    console.warn('Firestore fetchUserTranscriptions error:', err);
    return [];
  }
}

export async function saveUserPreferences(
  userId: string,
  preferences: Record<string, any>
): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, { preferences }, { merge: true });
  } catch (err) {
    console.warn('Firestore saveUserPreferences warning:', err);
  }
}

export async function fetchUserPreferences(
  userId: string
): Promise<Record<string, any> | null> {
  try {
    const userRef = doc(db, 'users', userId);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data()?.preferences || null;
    }
    return null;
  } catch (err) {
    console.warn('Firestore fetchUserPreferences warning:', err);
    return null;
  }
}

