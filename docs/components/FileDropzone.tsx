import React, { useState, useCallback } from 'react';
import { ArchiveBoxIcon, XCircleIcon } from './icons';

interface FileDropzoneProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  disabled: boolean;
}

const FileDropzone: React.FC<FileDropzoneProps> = ({ onFileSelect, selectedFile, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation(); // Necessary to allow drop
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };
  
  const handleClearFile = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onFileSelect(null);
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    if(fileInput) fileInput.value = '';
  }

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  return (
    <div
      className={`relative w-full border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ${disabled ? 'bg-background/50 cursor-not-allowed' : 'bg-background hover:border-accent'} ${isDragging ? 'border-accent bg-accent/10' : 'border-surface-2'}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        type="file"
        id="file-input"
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled}
      />
      {!selectedFile ? (
        <label htmlFor="file-input" className={`cursor-pointer flex flex-col items-center ${disabled ? 'cursor-not-allowed' : ''}`}>
          <ArchiveBoxIcon className="w-12 h-12 mx-auto text-text-tertiary" />
          <p className="mt-2 text-text-primary">
            <span className="font-semibold text-accent">Click to upload</span> or drag and drop a file
          </p>
          <p className="text-xs text-text-tertiary mt-1">Any file type (max 10MB)</p>
        </label>
      ) : (
        <div className="flex flex-col items-center text-text-primary">
          <ArchiveBoxIcon className="w-12 h-12 mx-auto text-accent" />
          <p className="mt-2 font-semibold truncate max-w-full px-8">{selectedFile.name}</p>
          <p className="text-sm text-text-secondary">{formatBytes(selectedFile.size)}</p>
          {!disabled && (
             <button onClick={handleClearFile} className="absolute top-2 right-2 text-text-tertiary hover:text-danger p-1 rounded-full bg-surface-2/50 hover:bg-surface-2">
               <XCircleIcon className="w-5 h-5" />
             </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FileDropzone;
