import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ResultDisplay } from './components/ResultDisplay';
import { replaceProductInImage } from './services/geminiService';
import { Header } from './components/Header';
import { ArrowRightIcon, SparklesIcon } from './components/Icons';

const App: React.FC = () => {
  const [posterImage, setPosterImage] = useState<string | null>(null);
  const [productImage, setProductImage] = useState<string | null>(null);
  const [productToReplace, setProductToReplace] = useState<string>('');
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!posterImage || !productImage || !productToReplace) {
      setError('لطفاً تمام فیلدها را پر کنید.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setEditedImage(null);

    try {
      const posterImageB64 = posterImage.split(',')[1];
      const productImageB64 = productImage.split(',')[1];
      
      const result = await replaceProductInImage(
        posterImageB64,
        posterImage.split(';')[0].split(':')[1],
        productImageB64,
        productImage.split(';')[0].split(':')[1],
        productToReplace
      );
      
      if (result) {
        setEditedImage(`data:image/png;base64,${result}`);
      } else {
        setError('هوش مصنوعی نتوانست تصویر را ویرایش کند. لطفاً با یک تصویر یا محصول دیگر امتحان کنید.');
      }
    } catch (err) {
      console.error(err);
      setError('خطایی در هنگام پردازش تصویر رخ داد. لطفاً جزئیات را در کنسول بررسی کنید.');
    } finally {
      setIsLoading(false);
    }
  }, [posterImage, productImage, productToReplace]);

  const isButtonDisabled = !posterImage || !productImage || !productToReplace || isLoading;

  return (
    <div className="min-h-screen bg-slate-900 text-gray-200 flex flex-col items-center p-4 sm:p-8">
      <div className="w-full max-w-7xl">
        <Header />
        
        <main className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls Section */}
          <div className="bg-slate-800/50 rounded-2xl p-6 shadow-2xl border border-slate-700 flex flex-col space-y-6">
            <h2 className="text-xl font-bold text-cyan-400">۱. فایل‌های خود را آپلود کنید</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ImageUploader 
                id="poster-upload" 
                label="پوستر اصلی"
                onImageUpload={setPosterImage} 
              />
              <ImageUploader 
                id="product-upload" 
                label="تصویر محصول شما"
                onImageUpload={setProductImage}
              />
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-cyan-400 mb-3">۲. محصول مورد نظر را مشخص کنید</h2>
              <label htmlFor="product-name" className="block text-sm font-medium text-gray-300 mb-2">
                نام محصولی که باید در پوستر جایگزین شود را وارد کنید:
              </label>
              <input
                id="product-name"
                type="text"
                value={productToReplace}
                onChange={(e) => setProductToReplace(e.target.value)}
                placeholder="مثال: بطری نوشابه"
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200"
              />
            </div>

            <div className="pt-4">
              <button
                onClick={handleGenerate}
                disabled={isButtonDisabled}
                className={`w-full flex items-center justify-center text-lg font-semibold px-6 py-4 rounded-lg transition-all duration-300 ease-in-out ${
                  isButtonDisabled 
                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                    : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg hover:shadow-cyan-500/50 transform hover:-translate-y-1'
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>در حال پردازش...</span>
                  </>
                ) : (
                  <>
                    <SparklesIcon className="w-6 h-6 mr-2" />
                    <span>جایگزینی محصول</span>
                    <ArrowRightIcon className="w-6 h-6 ml-2" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Result Section */}
          <div className="bg-slate-800/50 rounded-2xl p-6 shadow-2xl border border-slate-700">
            <ResultDisplay 
              originalImage={posterImage}
              editedImage={editedImage}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </main>

        <footer className="text-center py-6 mt-8 text-slate-500 text-sm">
          <p>ساخته شده توسط امیرحسین قمی</p>
        </footer>
      </div>
    </div>
  );
};

export default App;