import React from 'react';
import { ImageIcon, DownloadIcon } from './Icons';

interface ResultDisplayProps {
  originalImage: string | null;
  editedImage: string | null;
  isLoading: boolean;
  error: string | null;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ originalImage, editedImage, isLoading, error }) => {

  const handleDownload = () => {
    if (!editedImage) return;
    const link = document.createElement('a');
    link.href = editedImage;
    link.download = 'brand-swap-result.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <svg className="animate-spin h-12 w-12 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-lg text-slate-300">هوش مصنوعی در حال کار است...</p>
          <p className="text-sm text-slate-400">این فرآیند ممکن است کمی طول بکشد</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <p className="text-lg text-red-400">خطا!</p>
          <p className="mt-2 text-slate-300">{error}</p>
        </div>
      );
    }

    if (editedImage) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full w-full">
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-2 text-slate-300">تصویر اصلی</h3>
            <img src={originalImage!} alt="Original" className="w-full h-auto object-contain rounded-lg max-h-[400px]" />
          </div>
          <div className="flex flex-col items-center">
            <div className="flex justify-between items-center w-full mb-2">
                <h3 className="text-lg font-semibold text-cyan-400">تصویر ویرایش شده</h3>
                <button
                    onClick={handleDownload}
                    className="flex items-center px-3 py-1.5 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 transition-colors duration-200 text-sm font-medium shadow-md hover:shadow-cyan-500/50 transform hover:-translate-y-0.5"
                    aria-label="Download edited image"
                >
                    <DownloadIcon className="w-5 h-5 mr-2" />
                    <span>دانلود</span>
                </button>
            </div>
            <img src={editedImage} alt="Edited" className="w-full h-auto object-contain rounded-lg max-h-[400px]" />
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500">
        <ImageIcon className="w-24 h-24" />
        <p className="mt-4 text-lg">نتیجه در اینجا نمایش داده خواهد شد</p>
      </div>
    );
  };
  
  return (
    <div className="w-full h-full min-h-[300px] flex items-center justify-center">
      {renderContent()}
    </div>
  );
};