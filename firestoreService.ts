import {
  initializeFirebaseApp,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
} from './firebase';

export interface FirebaseSyncStatus {
  connected: boolean;
  lastSyncedAt: string | null;
  status: 'idle' | 'syncing' | 'synced' | 'offline' | 'error';
  errorMessage?: string;
  projectId?: string;
}

// Master Collections in Firestore
export const FIRESTORE_COLLECTIONS = {
  MASTER_STATE: 'prime_os_master_state',
  SESSIONS: 'intokine_sessions',
  CLIENTS: 'intokine_clients',
  FINANCES: 'intokine_finances',
  EXERCISES: 'intokine_exercises',
  NUTRITION_PLANS: 'intokine_nutrition_plans',
  SETTINGS: 'intokine_settings',
};

/**
 * Saves entire OS State bundle to Firestore document with fallback to server & local storage
 */
export async function syncStateToFirestore(stateBundle: Record<string, any>): Promise<boolean> {
  try {
    const { db } = initializeFirebaseApp();
    if (!db) {
      return false;
    }

    const stateDocRef = doc(db, FIRESTORE_COLLECTIONS.MASTER_STATE, 'active_workspace');
    await setDoc(stateDocRef, {
      ...stateBundle,
      updatedAt: new Date().toISOString(),
      appVersion: '2.4.0',
    }, { merge: true });

    return true;
  } catch (error: any) {
    console.warn('Firestore sync note:', error?.message || error);
    return false;
  }
}

/**
 * Retrieves master OS state from Firestore
 */
export async function loadStateFromFirestore(): Promise<Record<string, any> | null> {
  try {
    const { db } = initializeFirebaseApp();
    if (!db) return null;

    const stateDocRef = doc(db, FIRESTORE_COLLECTIONS.MASTER_STATE, 'active_workspace');
    const docSnap = await getDoc(stateDocRef);

    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.warn('Could not load remote state from Firestore (using local cache):', error);
    return null;
  }
}

/**
 * Real-time listener for Firestore changes across devices/coaches
 */
export function subscribeToFirestoreState(
  onUpdate: (data: Record<string, any>) => void,
  onError?: (err: any) => void
) {
  try {
    const { db } = initializeFirebaseApp();
    if (!db) return () => {};

    const stateDocRef = doc(db, FIRESTORE_COLLECTIONS.MASTER_STATE, 'active_workspace');
    const unsubscribe = onSnapshot(
      stateDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          onUpdate(docSnap.data());
        }
      },
      (err) => {
        if (onError) onError(err);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.warn('Real-time listener unavailable:', error);
    return () => {};
  }
}
