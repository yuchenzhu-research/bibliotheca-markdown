/**
 * Entry Service Factory
 * Creates and exports a singleton repository instance based on the environment
 */

import { isTauri } from '@/utils/env';
import { WebStorageAdapter } from './web-storage';
import { NativeStorageAdapter } from './native-storage';
import type { StorageRepository, AdapterMetadata } from './storage-repository';

// ============================================================================
// Singleton Instance
// ============================================================================

let repositoryInstance: StorageRepository | null = null;
let currentEnvironment: 'tauri' | 'web' | null = null;

/**
 * Get the singleton repository instance
 * Creates it if it doesn't exist
 */
export const getRepository = (): StorageRepository => {
  // Recreate if environment changed
  const environment = isTauri() ? 'tauri' : 'web';

  if (repositoryInstance && currentEnvironment === environment) {
    return repositoryInstance;
  }

  if (environment === 'tauri') {
    repositoryInstance = new NativeStorageAdapter();
  } else {
    repositoryInstance = new WebStorageAdapter();
  }

  currentEnvironment = environment;
  return repositoryInstance;
};

/**
 * Get the current adapter's metadata
 */
export const getAdapterInfo = (): AdapterMetadata => {
  const repository = getRepository();
  if ('getMetadata' in repository) {
    return (repository as { getMetadata(): AdapterMetadata }).getMetadata();
  }
  return {
    name: isTauri() ? 'NativeStorageAdapter' : 'WebStorageAdapter',
    version: '1.0.0',
    environment: isTauri() ? 'tauri' : 'web',
    capabilities: [],
  };
};

/**
 * Check if running in Tauri environment
 */
export const isRunningInTauri = (): boolean => {
  return isTauri();
};

/**
 * Check if running in Web environment
 */
export const isRunningInWeb = (): boolean => {
  return !isTauri();
};

// ============================================================================
// Convenience Methods (Delegates to Repository)
// ============================================================================

/**
 * Save an entry
 */
export const saveEntry = async (entry: Parameters<StorageRepository['saveEntry']>[0]) => {
  const repo = getRepository();
  return repo.saveEntry(entry);
};

/**
 * Get all entries
 */
export const getEntries = async (): Promise<ReturnType<StorageRepository['getEntries']>> => {
  const repo = getRepository();
  return repo.getEntries();
};

/**
 * Get a single entry by ID
 */
export const getEntry = async (id: string) => {
  const repo = getRepository();
  return repo.getEntry(id);
};

/**
 * Update an entry
 */
export const updateEntry = async (
  id: string,
  data: Parameters<StorageRepository['updateEntry']>[1]
) => {
  const repo = getRepository();
  return repo.updateEntry(id, data);
};

/**
 * Delete an entry
 */
export const deleteEntry = async (id: string) => {
  const repo = getRepository();
  return repo.deleteEntry(id);
};

/**
 * Upload an image
 */
export const uploadImage = async (
  file: Parameters<StorageRepository['uploadImage']>[0]
) => {
  const repo = getRepository();
  return repo.uploadImage(file);
};

/**
 * Export all data
 */
export const exportData = async (): Promise<string> => {
  const repo = getRepository();
  return repo.exportData();
};

/**
 * Import data
 */
export const importData = async (json: string) => {
  const repo = getRepository();
  return repo.importData(json);
};

/**
 * Get the storage location
 */
export const getStorageLocation = async (): Promise<string> => {
  const repo = getRepository();
  return repo.getStorageLocation();
};

// ============================================================================
// Default Export (Factory Instance)
// ============================================================================

/**
 * Default export - a ready-to-use singleton repository instance
 */
const entryService: StorageRepository = getRepository();

export default entryService;

// ============================================================================
// Named Exports for Tree Shaking
// ============================================================================

export { WebStorageAdapter } from './web-storage';
export { NativeStorageAdapter } from './native-storage';

// Re-export file-based functions for web
export { exportToFile, importFromFile, hasUserEntries, getUserEntryCount } from './web-storage';

export {
  type StorageRepository,
  type Entry,
  type SavedEntry,
  type EntrySummary,
  type SaveResult,
  type ImageUploadResult,
  type AdapterMetadata,
} from './storage-repository';