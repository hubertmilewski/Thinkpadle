import { useState, useRef, MouseEvent, TouchEvent } from "react";
import { siteContent } from "@/data/content";
import { Spinner } from "@/components/ui/Spinner";

interface ThinkPadImageProps {
  src: string;
  alt: string;
  onImageLoad?: () => void;
  onImageError?: () => void;
}

export function ThinkPadImage({ src, alt, onImageLoad, onImageError }: ThinkPadImageProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [dynamicRatio, setDynamicRatio] = useState<string>("16/9");
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);



  const handleZoom = (clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const { left, top, width, height } =
      containerRef.current.getBoundingClientRect();

    const x = Math.max(0, Math.min(100, ((clientX - left) / width) * 100));
    const y = Math.max(0, Math.min(100, ((clientY - top) / height) * 100));

    setPosition({ x, y });
  };

  const handleMouseMove = (e: MouseEvent) => handleZoom(e.clientX, e.clientY);
  const handleTouchMove = (e: TouchEvent) =>
    handleZoom(e.touches[0].clientX, e.touches[0].clientY);

  return (
    <div className="flex flex-col items-center w-full px-4 sm:px-0">
      <p className="text-gray-500 text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] font-medium mb-3 sm:mb-4 text-center">
        {siteContent.header.subtitle}
      </p>

      <div
        ref={containerRef}
        className="w-full mx-auto relative bg-[#111] overflow-hidden border border-gray-800 cursor-zoom-in shadow-lg transition-all duration-300"
        style={{ aspectRatio: dynamicRatio }}
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={(e) => {
          setIsZoomed(true);
          handleZoom(e.touches[0].clientX, e.touches[0].clientY);
        }}
        onTouchEnd={() => setIsZoomed(false)}
        onTouchMove={handleTouchMove}
      >
        <div
          className="absolute inset-0 transition-transform duration-200 ease-out"
          style={{
            transform: isZoomed ? "scale(2.2)" : "scale(1)",
            transformOrigin: `${position.x}% ${position.y}%`,
          }}
        >
          <img
            src={src || "/placeholder.png"}
            alt={alt}
            className={`absolute inset-0 w-full h-full object-contain select-none pointer-events-none transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={(event) => {
              const { naturalWidth, naturalHeight } = event.currentTarget;
              if (naturalWidth && naturalHeight) {
                setDynamicRatio(`${naturalWidth}/${naturalHeight}`);
              }
              setIsLoaded(true);
              if (onImageLoad) onImageLoad();
            }}
            onError={() => {
              if (onImageError) onImageError();
            }}
          />
        </div>

        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <Spinner size={32} />
          </div>
        )}

        <div className="absolute inset-0 bg-tp-bg/10 pointer-events-none mix-blend-multiply" />
      </div>
    </div>
  );
}