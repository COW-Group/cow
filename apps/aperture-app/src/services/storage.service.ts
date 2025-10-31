/**
 * Storage Service
 * Handles file uploads to Supabase Storage
 */

import { supabase } from '@cow/supabase-client';

export interface UploadResult {
  url: string;
  path: string;
  error?: string;
}

export interface UploadOptions {
  maxSizeBytes?: number;
  allowedTypes?: string[];
  onProgress?: (progress: number) => void;
}

class StorageService {
  private readonly DEFAULT_MAX_SIZE = 5 * 1024 * 1024; // 5MB
  private readonly AVATAR_MAX_SIZE = 2 * 1024 * 1024; // 2MB
  private readonly ALLOWED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/svg+xml',
  ];

  /**
   * Upload user avatar
   */
  async uploadAvatar(
    userId: string,
    file: File,
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    const maxSize = options.maxSizeBytes || this.AVATAR_MAX_SIZE;
    const allowedTypes = options.allowedTypes || [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
    ];

    // Validate file
    const validation = this.validateFile(file, maxSize, allowedTypes);
    if (!validation.valid) {
      return {
        url: '',
        path: '',
        error: validation.error,
      };
    }

    // Generate file path
    const fileExt = file.name.split('.').pop();
    const fileName = `avatar.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    try {
      // Delete old avatar if exists
      await this.deleteFile('avatars', filePath);

      // Upload new avatar
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      return {
        url: urlData.publicUrl,
        path: filePath,
      };
    } catch (error) {
      console.error('Error uploading avatar:', error);
      return {
        url: '',
        path: '',
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  }

  /**
   * Upload organization logo
   */
  async uploadOrganizationLogo(
    organizationId: string,
    file: File,
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    const maxSize = options.maxSizeBytes || this.DEFAULT_MAX_SIZE;
    const allowedTypes = options.allowedTypes || this.ALLOWED_IMAGE_TYPES;

    // Validate file
    const validation = this.validateFile(file, maxSize, allowedTypes);
    if (!validation.valid) {
      return {
        url: '',
        path: '',
        error: validation.error,
      };
    }

    // Generate file path
    const fileExt = file.name.split('.').pop();
    const fileName = `logo.${fileExt}`;
    const filePath = `${organizationId}/${fileName}`;

    try {
      // Delete old logo if exists
      await this.deleteFile('organization-logos', filePath);

      // Upload new logo
      const { data, error } = await supabase.storage
        .from('organization-logos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('organization-logos')
        .getPublicUrl(filePath);

      return {
        url: urlData.publicUrl,
        path: filePath,
      };
    } catch (error) {
      console.error('Error uploading organization logo:', error);
      return {
        url: '',
        path: '',
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  }

  /**
   * Delete file from storage
   */
  async deleteFile(bucket: string, filePath: string): Promise<boolean> {
    try {
      const { error } = await supabase.storage.from(bucket).remove([filePath]);

      if (error) {
        console.warn('Error deleting file (may not exist):', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteFile:', error);
      return false;
    }
  }

  /**
   * Delete user avatar
   */
  async deleteAvatar(userId: string): Promise<boolean> {
    // Try deleting common file extensions
    const extensions = ['jpg', 'jpeg', 'png', 'webp'];
    let deleted = false;

    for (const ext of extensions) {
      const filePath = `${userId}/avatar.${ext}`;
      const result = await this.deleteFile('avatars', filePath);
      if (result) deleted = true;
    }

    return deleted;
  }

  /**
   * Delete organization logo
   */
  async deleteOrganizationLogo(organizationId: string): Promise<boolean> {
    // Try deleting common file extensions
    const extensions = ['jpg', 'jpeg', 'png', 'svg', 'webp'];
    let deleted = false;

    for (const ext of extensions) {
      const filePath = `${organizationId}/logo.${ext}`;
      const result = await this.deleteFile('organization-logos', filePath);
      if (result) deleted = true;
    }

    return deleted;
  }

  /**
   * Get avatar URL
   */
  getAvatarUrl(userId: string, fileName: string = 'avatar.jpg'): string {
    const filePath = `${userId}/${fileName}`;
    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    return data.publicUrl;
  }

  /**
   * Get organization logo URL
   */
  getOrganizationLogoUrl(
    organizationId: string,
    fileName: string = 'logo.png'
  ): string {
    const filePath = `${organizationId}/${fileName}`;
    const { data } = supabase.storage
      .from('organization-logos')
      .getPublicUrl(filePath);
    return data.publicUrl;
  }

  /**
   * Validate file before upload
   */
  private validateFile(
    file: File,
    maxSize: number,
    allowedTypes: string[]
  ): { valid: boolean; error?: string } {
    // Check file size
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size must be less than ${this.formatBytes(maxSize)}`,
      };
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`,
      };
    }

    return { valid: true };
  }

  /**
   * Format bytes to human-readable string
   */
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * Check if file exists
   */
  async fileExists(bucket: string, filePath: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.storage.from(bucket).list(filePath);
      return !error && data && data.length > 0;
    } catch {
      return false;
    }
  }

  /**
   * Get file info
   */
  async getFileInfo(bucket: string, filePath: string) {
    try {
      const { data, error } = await supabase.storage.from(bucket).list(filePath);
      if (error || !data || data.length === 0) return null;
      return data[0];
    } catch {
      return null;
    }
  }

  /**
   * Get signed URL for private files (if needed)
   */
  async getSignedUrl(
    bucket: string,
    filePath: string,
    expiresIn: number = 3600
  ): Promise<string | null> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(filePath, expiresIn);

      if (error) throw error;
      return data.signedUrl;
    } catch (error) {
      console.error('Error getting signed URL:', error);
      return null;
    }
  }
}

export const storageService = new StorageService();
