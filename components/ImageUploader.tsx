
import React, { useState, useCallback, useRef } from 'react';
import { UploadIcon } from './Icons';

interface ImageUploaderProps {
  id: string;
  label: string;
  onImageUpload: (base64: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ id, label, onImageUpload }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((file: File | null) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        onImageUpload(base64String);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      <div 
        onClick={onButtonClick}
        onDrop={onDrop}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        className={`relative w-full h-48 sm:h-56 flex justify-center items-center border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200 ${
          isDragging ? 'border-cyan-400 bg-slate-700/50' : 'border-slate-600 hover:border-slate-500'
        }`}
      >
        <input 
          ref={fileInputRef}
          id={id} 
          type="file" 
          className="hidden" 
          accept="image/*"
          onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
        />
        {imagePreview ? (
          <img src={imagePreview} alt="Preview" className="h-full w-full object-contain rounded-lg p-2" />
        ) : (
          <div className="text-center text-slate-400">
            <UploadIcon className="mx-auto h-12 w-12"/>
            <p className="mt-2 text-sm">فایل را بکشید و رها کنید یا کلیک کنید</p>
          </div>
        )}
      </div>
    </div>
  );
};
