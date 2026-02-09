import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Artifact } from '../types';

interface AegisDB extends DBSchema {
  artifacts: {
    key: string;
    value: Artifact;
  };
}

const DB_NAME = 'aegis-secure-db';
const STORE_NAME = 'artifacts';

let dbPromise: Promise<IDBPDatabase<AegisDB>> | null = null;

const getDB = () => {
  if (!dbPromise) {
    dbPromise = openDB<AegisDB>(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
};

export const saveArtifact = async (artifact: Artifact): Promise<void> => {
  const db = await getDB();
  await db.put(STORE_NAME, artifact);
};

export const getAllArtifacts = async (): Promise<Artifact[]> => {
  const db = await getDB();
  return db.getAll(STORE_NAME);
};

export const deleteArtifact = async (id: string): Promise<void> => {
  const db = await getDB();
  await db.delete(STORE_NAME, id);
};

export const clearArtifacts = async (): Promise<void> => {
    const db = await getDB();
    await db.clear(STORE_NAME);
}