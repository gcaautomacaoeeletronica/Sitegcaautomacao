import React, { useState, useEffect } from 'react';
import { Play, Image as ImageIcon } from 'lucide-react';

const _FALLBACK_IMAGE = "https://images.unsplash.com/photo-1516216628859-9bccecab13ca?auto=format&fit=crop&q=80&w=800"; // Placeholder Industrial genérico

const SmartImage = ({ src, alt, className = "", isVideoMatch = false, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    // Reset states if src changes dynamically
    setImgSrc(src);
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  // Checar se é vídeo através da prop explícita ou extensões
  const isVideo = isVideoMatch || !!(imgSrc && (imgSrc.match(/\.(mp4|webm|mov|avi)$/i) || imgSrc.includes('video')));

  const handleError = () => {
    setHasError(true);
    setImgSrc(_FALLBACK_IMAGE);
  };

  if (!imgSrc) {
    return (
      <div className={`flex items-center justify-center bg-slate-100 border border-slate-200 text-slate-400 ${className} animate-pulse-subtle`}>
        <ImageIcon size={32} opacity={0.5} />
      </div>
    );
  }

  // Camada de Placeholder e Blur Up Loading
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width: '100%', height: '100%' }}>
      {/* Skeletons/Shimmer Background (fica em baixo e some aos poucos) */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 z-0 animate-shimmer" />
      )}
      
      {/* Fallback Error Overlay (Mascara Vermelha Branca de erro tratada) */}
      {hasError && (
        <div className="absolute top-4 left-4 z-20 bg-red-500 text-white text-[10px] font-black uppercase px-2 py-1 rounded shadow-md tracking-widest">
          Imagem Recuperada
        </div>
      )}

      {isVideo ? (
        <>
          <video
            src={imgSrc}
            autoPlay
            muted
            loop
            playsInline
            onLoadedData={() => setIsLoaded(true)}
            onError={handleError}
            className={`w-full h-full object-cover relative z-10 transition-all duration-700 ease-out ${!isLoaded ? 'opacity-0 scale-105' : 'opacity-100 scale-100'} ${className.includes('group-hover') ? className : ''}`}
            {...props}
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div className="w-16 h-16 rounded-full bg-white/95 flex items-center justify-center shadow-xl backdrop-blur-md group-hover:scale-110 transition-transform">
              <Play size={24} className="text-primary ml-1" />
            </div>
          </div>
        </>
      ) : (
        <img
          src={imgSrc}
          alt={alt || "Media Component"}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={handleError}
          className={`w-full h-full object-cover relative z-10 transition-all duration-700 ease-out ${!isLoaded ? 'opacity-0 blur-md scale-105' : 'opacity-100 blur-0 scale-100'} ${hasError ? 'grayscale contrast-125' : ''} ${className.includes('group-hover') ? className : ''}`}
          {...props}
        />
      )}
    </div>
  );
};

export default SmartImage;
