import React from 'react';
import { SparklesIcon } from './Icons';

export const Header: React.FC = () => {
  return (
    <header className="text-center">
      <div className="inline-flex items-center justify-center bg-cyan-500/10 text-cyan-400 rounded-full p-3 mb-4">
        <SparklesIcon className="w-8 h-8"/>
      </div>
      <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300">
        Product Swap AI
      </h1>
      <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-400">
        محصول خود را به سادگی جایگزین محصولات دیگر در تصاویر کنید. پوستر اصلی و تصویر محصول خود را آپلود کرده و نام محصول مورد نظر برای جایگزینی را مشخص کنید تا هوش مصنوعی تصویر جدید را برای شما بسازد.
      </p>
    </header>
  );
};