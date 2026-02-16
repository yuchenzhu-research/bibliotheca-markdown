/**
 * Native Storage Adapter
 * Implements StorageRepository using Tauri APIs for native desktop app
 * Uses dynamic imports to avoid bundling issues in web builds
 */

import {
  Entry,
  SavedEntry,
  EntrySummary,
  SaveResult,
  ImageUploadResult,
  StorageRepository,
} from './storage-repository';
import { getAdapterMetadata } from './adapter-metadata';

// ============================================================================
// Tauri Types (duplicated from Rust for TypeScript)
// ============================================================================

interface RustEntryPayload {
  id?: string;
  title: string;
  figure: string;
  moment: string;
  narrative: string;
  keywords: string[];
  image_base64?: string;
  date_created: string;
  date_modified?: string;
}

interface RustSaveResult {
  success: boolean;
  entry_id?: string;
  file_path?: string;
  error?: string;
}

interface RustImageResult {
  success: boolean;
  url?: string;
  error?: string;
}

// ============================================================================
// Native Storage Adapter Class
// ============================================================================

/**
 * NativeStorageAdapter implements StorageRepository for Tauri environments
 * Uses Rust commands for file system operations
 */
export class NativeStorageAdapter implements StorageRepository {
  private metadata = getAdapterMetadata('tauri');
  private tauriCore: typeof import('@tauri-apps/api/core') | null = null;

  // ==========================================================================
  // Lazy Tauri Loading
  // ==========================================================================

  /**
   * Initialize Tauri core module (called lazily)
   */
  private async initCore(): Promise<typeof import('@tauri-apps/api/core')> {
    if (this.tauriCore) {
      return this.tauriCore;
    }

    try {
      this.tauriCore = await import('@tauri-apps/api/core');
      return this.tauriCore;
    } catch (error) {
      throw new Error(
        `Failed to initialize Tauri Core API: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  // ==========================================================================
  // Entry Operations
  // ==========================================================================

  async saveEntry(entry: Entry): Promise<SaveResult> {
    try {
      const { invoke } = await this.initCore();

      const payload: RustEntryPayload = {
        title: entry.title,
        figure: entry.figure,
        moment: entry.moment,
        narrative: entry.narrative,
        keywords: entry.keywords,
        image_base64: entry.imageBase64,
        date_created: entry.dateCreated,
        date_modified: new Date().toISOString(),
      };

      const result = await invoke<RustSaveResult>('save_entry', { payload });

      if (result.success && result.entry_id) {
        return {
          success: true,
          entryId: result.entry_id,
          savedPath: result.file_path,
        };
      }

      return {
        success: false,
        error: result.error || 'Unknown error',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getEntry(id: string): Promise<Entry | null> {
    try {
      const { invoke } = await this.initCore();

      const result = await invoke<RustEntryPayload | null>('get_entry', { id });

      if (!result) return null;

      return this.rustToEntry(result);
    } catch (error) {
      console.error('Failed to get entry:', error);
      return null;
    }
  }

  async getEntries(): Promise<Entry[]> {
    try {
      const { invoke } = await this.initCore();

      const result = await invoke<RustEntryPayload[]>('get_all_entries');

      return result.map((e) => this.rustToEntry(e));
    } catch (error) {
      console.error('Failed to get entries:', error);
      return [];
    }
  }

  async getEntrySummaries(): Promise<EntrySummary[]> {
    const entries = await this.getEntries();
    return entries.map((entry) => ({
      id: (entry as SavedEntry).id || '',
      title: entry.title,
      figure: entry.figure,
      imageUrl: entry.imageUrl,
      dateCreated: entry.dateCreated,
      keywords: entry.keywords,
    }));
  }

  async updateEntry(id: string, data: Partial<Entry>): Promise<SaveResult> {
    try {
      const { invoke } = await this.initCore();

      const result = await invoke<RustSaveResult>('update_entry', {
        id,
        payload: data,
      });

      return {
        success: result.success,
        entryId: result.entry_id,
        savedPath: result.file_path,
        error: result.error,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async deleteEntry(id: string): Promise<void> {
    try {
      const { invoke } = await this.initCore();
      await invoke('delete_entry', { id });
    } catch (error) {
      console.error('Failed to delete entry:', error);
      throw error;
    }
  }

  // ==========================================================================
  // Image Operations
  // ==========================================================================

  async uploadImage(file: File | Blob | string): Promise<ImageUploadResult> {
    try {
      const { invoke } = await this.initCore();

      if (typeof file === 'string') {
        // Already a URL/path
        return { success: true, url: file };
      }

      // Convert File/Blob to base64
      const base64 = await this.fileToBase64(file);

      const result = await invoke<RustImageResult>('save_image', {
        data: base64,
        filename: file instanceof File ? file.name : 'image.png',
      });

      if (result.success && result.url) {
        return { success: true, url: result.url };
      }

      return {
        success: false,
        error: result.error || 'Failed to save image',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Convert File/Blob to base64 string
   */
  private async fileToBase64(file: File | Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data URL prefix
        resolve(result.replace(/^data:image\/\w+;base64,/, ''));
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // ==========================================================================
  // Import/Export Operations
  // ==========================================================================

  async exportData(): Promise<string> {
    const entries = await this.getEntries();
    return JSON.stringify(entries, null, 2);
  }

  async importData(json: string): Promise<void> {
    try {
      const { invoke } = await this.initCore();
      await invoke('import_entries', { json });
    } catch (error) {
      throw new Error(
        `Failed to import data: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  async getStorageLocation(): Promise<string> {
    try {
      const { invoke } = await this.initCore();
      return await invoke<string>('get_storage_path');
    } catch {
      return '~/Documents/DigitalGarden/Archive';
    }
  }

  // ==========================================================================
  // Helper Methods
  // ==========================================================================

  /**
   * Convert Rust payload to Entry type
   */
  private rustToEntry(payload: RustEntryPayload): Entry {
    return {
      id: payload.id,
      title: payload.title,
      figure: payload.figure,
      moment: payload.moment,
      narrative: payload.narrative,
      keywords: payload.keywords,
      imageBase64: payload.image_base64,
      dateCreated: payload.date_created,
      dateModified: payload.date_modified,
    };
  }

  /**
   * Get adapter metadata
   */
  getMetadata() {
    return this.metadata;
  }
}

// ============================================================================
// Factory Function
// ============================================================================

/**
 * Create a NativeStorageAdapter instance
 */
export const createNativeStorage = (): NativeStorageAdapter => {
  return new NativeStorageAdapter();
};

// ============================================================================
// Default Export
// ============================================================================

export default NativeStorageAdapter;