/**
 * File Upload Component
 * Reusable component for uploading images (avatars, logos, etc.)
 */

import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, Check, AlertCircle, Image as ImageIcon } from 'lucide-react';

export interface FileUploadProps {
  /** Current image URL (if any) */
  currentImageUrl?: string;
  /** Callback when file is selected and ready to upload */
  onFileSelected?: (file: File) => void;
  /** Callback for upload action */
  onUpload?: (file: File) => Promise<{ success: boolean; url?: string; error?: string }>;
  /** Callback when image is removed */
  onRemove?: () => void;
  /** Maximum file size in bytes */
  maxSize?: number;
  /** Allowed file types */
  acceptedTypes?: string[];
  /** Shape of the upload area */
  shape?: 'square' | 'circle' | 'rectangle';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Label text */
  label?: string;
  /** Helper text */
  helperText?: string;
  /** Disabled state */
  disabled?: boolean;
}

export function FileUpload({
  currentImageUrl,
  onFileSelected,
  onUpload,
  onRemove,
  maxSize = 5 * 1024 * 1024, // 5MB default
  acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  shape = 'square',
  size = 'md',
  label,
  helperText,
  disabled = false,
}: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync preview with currentImageUrl prop changes
  useEffect(() => {
    console.log('🖼️ FileUpload: currentImageUrl changed to:', currentImageUrl, 'preview is:', preview);
    if (currentImageUrl !== preview) {
      console.log('🔄 FileUpload: Updating preview to:', currentImageUrl);
      setPreview(currentImageUrl || null);
    }
  }, [currentImageUrl]);

  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-32 h-32',
    lg: 'w-48 h-48',
  };

  const shapeClasses = {
    square: 'rounded-lg',
    circle: 'rounded-full',
    rectangle: 'rounded-lg',
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setSuccess(false);

    // Validate file size
    if (file.size > maxSize) {
      setError(`File size must be less than ${formatBytes(maxSize)}`);
      return;
    }

    // Validate file type
    if (!acceptedTypes.includes(file.type)) {
      setError(`File type not supported. Allowed: ${acceptedTypes.map(t => t.split('/')[1]).join(', ')}`);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setSelectedFile(file);
    onFileSelected?.(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !onUpload) return;

    setUploading(true);
    setError(null);

    try {
      const result = await onUpload(selectedFile);

      if (result.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        if (result.url) {
          setPreview(result.url);
        }
      } else {
        setError(result.error || 'Upload failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      setSelectedFile(null);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setSelectedFile(null);
    setError(null);
    setSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onRemove?.();
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-3">
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-adaptive-primary">
          {label}
        </label>
      )}

      {/* Upload Area */}
      <div className="flex items-start gap-4">
        {/* Image Preview/Upload Box */}
        <div
          className={`${sizeClasses[size]} ${shapeClasses[shape]} border-2 border-dashed border-gray-300 dark:border-gray-700 relative overflow-hidden bg-gray-50 dark:bg-gray-900 flex items-center justify-center`}
        >
          {preview ? (
            <>
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              {/* Remove Button */}
              <button
                onClick={handleRemove}
                disabled={disabled || uploading}
                className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors disabled:opacity-50"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              className="w-full h-full flex flex-col items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors disabled:opacity-50"
            >
              <ImageIcon className="w-8 h-8 mb-2" />
              <span className="text-xs font-medium">Click to upload</span>
            </button>
          )}

          {/* Uploading Overlay */}
          {uploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                <p className="text-xs font-medium">Uploading...</p>
              </div>
            </div>
          )}

          {/* Success Overlay */}
          {success && (
            <div className="absolute inset-0 bg-green-500/90 flex items-center justify-center">
              <Check className="w-12 h-12 text-white" />
            </div>
          )}
        </div>

        {/* Info and Actions */}
        <div className="flex-1 space-y-2">
          {/* Helper Text */}
          {helperText && (
            <p className="text-xs text-adaptive-muted">
              {helperText}
            </p>
          )}

          {/* File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedTypes.join(',')}
            onChange={handleFileSelect}
            disabled={disabled}
            className="hidden"
          />

          {/* Upload Button */}
          {selectedFile && onUpload && !uploading && (
            <button
              onClick={handleUpload}
              disabled={disabled || uploading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </button>
          )}

          {/* Select File Button */}
          {!selectedFile && preview && (
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 text-sm font-medium rounded-md text-adaptive-primary bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <Upload className="w-4 h-4 mr-2" />
              Change
            </button>
          )}

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <Check className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-green-600 dark:text-green-400">Upload successful!</p>
            </div>
          )}

          {/* File Info */}
          {selectedFile && (
            <div className="text-xs text-adaptive-muted">
              <p><strong>File:</strong> {selectedFile.name}</p>
              <p><strong>Size:</strong> {formatBytes(selectedFile.size)}</p>
              <p><strong>Type:</strong> {selectedFile.type}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
