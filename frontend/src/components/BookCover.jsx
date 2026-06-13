import React from 'react';

const BookCover = ({ titulo = 'Livro Sem Título', autor = 'Autor Desconhecido', size = 'md' }) => {
  // Hash the title to choose one of three theme colors deterministically
  const colors = [
    { name: 'Burgundy', bg: 'bg-[#4A1521]', border: 'border-[#C5A059]', text: 'text-[#EFE2C6]' }, // Vinho
    { name: 'Navy', bg: 'bg-[#0F233A]', border: 'border-[#C5A059]', text: 'text-[#EFE2C6]' },     // Azul-petróleo
    { name: 'Moss', bg: 'bg-[#152B1E]', border: 'border-[#C5A059]', text: 'text-[#EFE2C6]' }       // Verde-musgo
  ];
  
  const charSum = titulo.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const theme = colors[charSum % colors.length];

  const sizeClasses = {
    sm: {
      container: 'w-24 h-36 text-[10px] p-2',
      title: 'text-[11px] mt-4 font-bold leading-tight',
      author: 'text-[9px] mt-1',
      ornament: 'w-4 h-4 my-2',
      spine: 'w-2'
    },
    md: {
      container: 'w-40 h-60 text-xs p-4',
      title: 'text-sm mt-6 font-bold leading-snug',
      author: 'text-[11px] mt-2',
      ornament: 'w-8 h-8 my-4',
      spine: 'w-3'
    },
    lg: {
      container: 'w-56 h-80 text-sm p-6',
      title: 'text-lg mt-8 font-bold leading-snug',
      author: 'text-xs mt-3',
      ornament: 'w-12 h-12 my-6',
      spine: 'w-4'
    }
  }[size] || sizeClasses.md;

  return (
    <div className={`relative flex flex-col justify-between rounded-r shadow-book hover:shadow-book-lg transition-shadow duration-300 overflow-hidden select-none leather-texture ${theme.bg} ${theme.text} ${sizeClasses.container}`}>
      {/* 3D Spine effect */}
      <div className={`absolute top-0 left-0 h-full ${sizeClasses.spine} bg-black/30 border-r border-white/10 shadow-[inset_-2px_0_4px_rgba(0,0,0,0.4)]`} />
      
      {/* Decorative Gold Border */}
      <div className="absolute inset-2 border border-[#C5A059]/40 rounded-r-sm pointer-events-none" />
      <div className="absolute inset-[10px] border-2 border-double border-[#C5A059]/60 rounded-r-sm pointer-events-none" />
      
      {/* Content */}
      <div className="flex flex-col items-center justify-center h-full text-center px-2 z-10">
        {/* Title */}
        <h3 className={`font-serif tracking-wide ${sizeClasses.title} uppercase font-semibold max-h-[4.5em] overflow-hidden line-clamp-3 text-gold-light drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]`}>
          {titulo}
        </h3>
        
        {/* Decorative Gold Ornament */}
        <div className={`flex items-center justify-center ${sizeClasses.ornament} text-[#C5A059] opacity-80`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        
        {/* Author */}
        <p className={`font-serif italic opacity-90 truncate max-w-full ${sizeClasses.author} text-stone-300 drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]`}>
          {autor}
        </p>
      </div>

      {/* Pages edge effect on the right */}
      <div className="absolute right-0 top-0 h-full w-[1px] bg-white/20" />
    </div>
  );
};

export default BookCover;
