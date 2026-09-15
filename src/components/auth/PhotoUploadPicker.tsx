import React, { useState, useRef } from 'react';
import { Camera, X, UploadCloud, RefreshCw, User } from 'lucide-react';
import { AuthUiStrings } from '../../utils/authLocalization';

interface PhotoUploadPickerProps {
  photoUrl?: string;
  onPhotoChange: (url: string | undefined, file?: File) => void;
  ui: AuthUiStrings;
  label?: string;
  helperText?: string;
  size?: 'md' | 'lg';
  idPrefix?: string;
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const PhotoUploadPicker: React.FC<PhotoUploadPickerProps> = ({
  photoUrl,
  onPhotoChange,
  ui,
  label,
  helperText,
  size = 'md',
  idPrefix = 'photo',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndProcessFile = (file: File) => {
    setErrorMessage(null);

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      setErrorMessage(ui.common.invalidFileType);
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage(ui.common.fileTooLarge);
      return;
    }

    try {
      const previewUrl = URL.createObjectURL(file);
      onPhotoChange(previewUrl, file);
    } catch {
      // Fallback
      const reader = new FileReader();
      reader.onloadend = () => {
        onPhotoChange(reader.result as string, file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPhotoChange(undefined, undefined);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const avatarDimensions = size === 'lg' ? 'w-24 h-24' : 'w-20 h-20';

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-xs font-bold text-[#173C36] tracking-wide flex items-center justify-between">
          <span>{label}</span>
          <span className="text-[11px] font-normal text-[#173C36]/60">
            {ui.common.maxFileSize}
          </span>
        </label>
      )}

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex items-center gap-4 p-3.5 rounded-2xl border-2 transition-all cursor-pointer select-none ${
          isDragging
            ? 'border-[#2F9E76] bg-[#E1F5EE]/60 scale-[1.01]'
            : photoUrl
            ? 'border-[#173C36]/20 bg-[#FFFDF6] hover:border-[#173C36]/40'
            : 'border-dashed border-[#173C36]/25 bg-[#FFFDF6]/80 hover:bg-[#FFFDF6] hover:border-[#173C36]/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          id={`${idPrefix}-file-input`}
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileSelect}
          className="hidden"
          aria-label={label || ui.common.uploadPhoto}
        />

        {/* Circular / Rounded Avatar Preview Container */}
        <div className="relative shrink-0">
          <div
            className={`${avatarDimensions} rounded-full overflow-hidden bg-[#FFF3D2] border-2 border-white shadow-md flex items-center justify-center transition-transform group-hover:scale-105`}
          >
            {photoUrl ? (
              <img
                src={photoUrl}
                alt="Avatar preview"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-[#173C36]/40">
                <User className="w-8 h-8 stroke-[1.5]" />
              </div>
            )}
          </div>

          {/* Camera Icon Badge */}
          <div
            className={`absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#173C36] text-[#F5C244] flex items-center justify-center shadow-md border-2 border-[#FFFDF6] transition-transform ${
              photoUrl ? 'hover:scale-110' : ''
            }`}
          >
            {photoUrl ? (
              <RefreshCw className="w-3.5 h-3.5" />
            ) : (
              <Camera className="w-3.5 h-3.5" />
            )}
          </div>
        </div>

        {/* Instructions & Actions */}
        <div className="flex-1 min-w-0">
          {photoUrl ? (
            <div className="flex flex-col gap-1.5">
              <p className="text-xs font-semibold text-[#173C36]">
                {ui.common.changePhoto}
              </p>
              <p className="text-[11px] text-[#173C36]/60 truncate">
                {ui.common.dragDropText}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <button
                  type="button"
                  onClick={handleRemove}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
                >
                  <X className="w-3 h-3" />
                  <span>{ui.common.removePhoto}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#173C36]">
                <UploadCloud className="w-4 h-4 text-[#2F9E76]" />
                <span>{ui.common.uploadPhoto}</span>
              </div>
              <p className="text-[11px] text-[#173C36]/70 leading-relaxed">
                {ui.common.dragDropText}
              </p>
              <p className="text-[10px] text-[#173C36]/50 mt-0.5">
                {ui.common.maxFileSize}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <p className="text-xs text-rose-600 font-medium px-1 flex items-center gap-1 animate-in fade-in">
          <span>⚠️</span> {errorMessage}
        </p>
      )}

      {/* Helper text */}
      {helperText && !errorMessage && (
        <p className="text-[11px] text-[#173C36]/60 leading-normal px-1">
          {helperText}
        </p>
      )}
    </div>
  );
};
