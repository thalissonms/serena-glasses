"use client"
import { useState, useEffect } from 'react';
import Image from "next/image"

interface SerenaCollageBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

interface ClippingData {
  top: number;
  left: number;
  width: number;
  height: number;
  rotation: number;
  lines: number;
  lineWidths: number[];
}

interface PhotoData {
  top: number;
  left: number;
  rotation: number;
}

interface TornPaperData {
  top: number;
  left: number;
  width: number;
  height: number;
  rotation: number;
  clipPath: string;
}

interface TextData {
  fontSize: number;
}

export function SerenaCollageBackground({ children, className = "" }: SerenaCollageBackgroundProps) {
  const [collageImages, setCollageImages] = useState<string[]>([]);
  const [isClientReady, setIsClientReady] = useState(false);
  const [clippingData, setClippingData] = useState<ClippingData[]>([]);
  const [largeClippingData, setLargeClippingData] = useState<ClippingData[]>([]);
  const [photoData, setPhotoData] = useState<PhotoData[]>([]);
  const [tornPaperData, setTornPaperData] = useState<TornPaperData[]>([]);
  const [stickerData, setStickerData] = useState<PhotoData[]>([]);
  const [textData, setTextData] = useState<TextData[]>([]);

  useEffect(() => {
    // Simulate newspaper clippings and photos for collage background
    const mockImages = [
      "https://images.unsplash.com/photo-1586202146107-4c14321edb2a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb3VuZCUyMHN1bmdsYXNzZXMlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NTkxOTIzNTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1656360089594-d6523d472d1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMHN1bmdsYXNzZXMlMjBmYXNoaW9ufGVufDF8fHx8MTc1OTE5MjM0OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1755869973597-b6154bb885e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwZXlld2VhciUyMHJldHJvfGVufDF8fHx8MTc1OTE5MjM1MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    ];
    setCollageImages(mockImages);

    // Generate all random data only on client side to avoid hydration mismatch
    const generateClippingData = (): ClippingData[] => {
      return [...Array(20)].map(() => {
        const lineCount = 3 + Math.floor(Math.random() * 3);
        return {
          top: Math.random() * 100,
          left: Math.random() * 100,
          width: 60 + Math.random() * 80,
          height: 40 + Math.random() * 60,
          rotation: Math.random() * 360 - 180,
          lines: lineCount,
          lineWidths: [...Array(lineCount)].map(() => 50 + Math.random() * 40)
        };
      });
    };

    const generateLargeClippingData = (): ClippingData[] => {
      return [...Array(8)].map(() => ({
        top: Math.random() * 80,
        left: Math.random() * 80,
        width: 100 + Math.random() * 80,
        height: 80 + Math.random() * 60,
        rotation: Math.random() * 60 - 30,
        lines: 4,
        lineWidths: [...Array(4)].map(() => 60 + Math.random() * 30)
      }));
    };

    const generatePhotoData = (): PhotoData[] => {
      return mockImages.map(() => ({
        top: 15 + Math.random() * 70,
        left: 10 + Math.random() * 80,
        rotation: Math.random() * 40 - 20
      }));
    };

    const generateTornPaperData = (): TornPaperData[] => {
      return [...Array(6)].map(() => ({
        top: Math.random() * 100,
        left: Math.random() * 100,
        width: 20 + Math.random() * 40,
        height: 3 + Math.random() * 5,
        rotation: Math.random() * 360,
        clipPath: `polygon(0% 0%, ${80 + Math.random() * 20}% 0%, 100% 100%, ${10 + Math.random() * 20}% 100%)`
      }));
    };

    const generateStickerData = (): PhotoData[] => {
      return [...Array(4)].map(() => ({
        top: 20 + Math.random() * 60,
        left: 20 + Math.random() * 60,
        rotation: Math.random() * 60 - 30
      }));
    };

    const generateTextData = (): TextData[] => {
      return [...Array(6)].map(() => ({
        fontSize: 8 + Math.random() * 6
      }));
    };

    setClippingData(generateClippingData());
    setLargeClippingData(generateLargeClippingData());
    setPhotoData(generatePhotoData());
    setTornPaperData(generateTornPaperData());
    setStickerData(generateStickerData());
    setTextData(generateTextData());
    setIsClientReady(true);
  }, []);

  // Return simple version for SSR, detailed version for client
  if (!isClientReady) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        {/* Simple background for SSR */}
        <div className="absolute inset-0 opacity-15">
          <div 
            className="absolute inset-0"
            style={{
              background: `
                repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 2px,
                  rgba(0,0,0,0.03) 2px,
                  rgba(0,0,0,0.03) 4px
                ),
                repeating-linear-gradient(
                  -45deg,
                  transparent,
                  transparent 3px,
                  rgba(0,0,0,0.02) 3px,
                  rgba(0,0,0,0.02) 6px
                )
              `
            }}
          />
        </div>
        <div className="relative z-20">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Newspaper clippings background pattern */}
      <div className="absolute inset-0 opacity-15">
        {/* Base newspaper texture */}
        <div 
          className="absolute inset-0"
          style={{
            background: `
              repeating-linear-gradient(
                45deg,
                transparent,
                transparent 2px,
                rgba(0,0,0,0.03) 2px,
                rgba(0,0,0,0.03) 4px
              ),
              repeating-linear-gradient(
                -45deg,
                transparent,
                transparent 3px,
                rgba(0,0,0,0.02) 3px,
                rgba(0,0,0,0.02) 6px
              )
            `
          }}
        />

        {/* Scattered newspaper clippings */}
        {clippingData.map((clipping, i) => (
          <div
            key={`clipping-${i}`}
            className="absolute bg-gray-100 border border-gray-300 shadow-sm"
            style={{
              top: `${clipping.top}%`,
              left: `${clipping.left}%`,
              width: `${clipping.width}px`,
              height: `${clipping.height}px`,
              transform: `rotate(${clipping.rotation}deg)`,
              zIndex: 1
            }}
          >
            {/* Fake newspaper text lines */}
            <div className="p-1 space-y-1">
              {clipping.lineWidths.map((width, lineIndex) => (
                <div
                  key={lineIndex}
                  className="bg-black"
                  style={{
                    height: '1px',
                    width: `${width}%`,
                    opacity: 0.3
                  }}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Larger newspaper clippings with text */}
        {largeClippingData.map((clipping, i) => (
          <div
            key={`large-clipping-${i}`}
            className="absolute bg-white border border-gray-400 shadow-md p-2"
            style={{
              top: `${clipping.top}%`,
              left: `${clipping.left}%`,
              width: `${clipping.width}px`,
              height: `${clipping.height}px`,
              transform: `rotate(${clipping.rotation}deg)`,
              zIndex: 2
            }}
          >
            {/* Mock newspaper headlines */}
            <div className="space-y-1">
              <div className="bg-black h-2 w-full opacity-40" />
              <div className="bg-black h-1 w-3/4 opacity-25" />
              <div className="bg-black h-1 w-1/2 opacity-25" />
              <div className="space-y-0.5 mt-2">
                {clipping.lineWidths.map((width, lineIndex) => (
                  <div
                    key={lineIndex}
                    className="bg-black opacity-15"
                    style={{
                      height: '0.5px',
                      width: `${width}%`
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Collaged photos with tape effects */}
      <div className="absolute inset-0 pointer-events-none">
        {collageImages.map((image, index) => {
          const photo = photoData[index];
          if (!photo) return null;
          
          return (
            <div
              key={`photo-${index}`}
              className="absolute group"
              style={{
                top: `${photo.top}%`,
                left: `${photo.left}%`,
                transform: `rotate(${photo.rotation}deg)`,
                zIndex: 10 + index
              }}
            >
              {/* Tape strips */}
              <div 
                className="absolute -top-2 -left-1 w-12 h-4 bg-gray-200 opacity-70 border border-gray-300 shadow-sm"
                style={{ transform: 'rotate(-15deg)' }}
              />
              <div 
                className="absolute -bottom-2 -right-1 w-10 h-4 bg-gray-200 opacity-70 border border-gray-300 shadow-sm"
                style={{ transform: 'rotate(25deg)' }}
              />

              {/* Photo */}
              <div className="relative w-24 h-24 bg-white border-2 border-white shadow-lg">
                <Image
                  src={image}
                  alt={`Collage item ${index + 1}`}
                  className="w-full h-full object-cover"
                  fill
                />
                {/* Photo shadow */}
                <div className="absolute inset-0 shadow-xl" />
              </div>

              {/* Additional tape corner */}
              <div 
                className="absolute top-1 right-1 w-6 h-6 bg-gray-200 opacity-60 border border-gray-300"
                style={{ transform: 'rotate(45deg)' }}
              />
            </div>
          );
        })}
      </div>

      {/* Scattered text elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Y2K style text snippets */}
        {[
          { text: "FASHION", pos: { top: "20%", left: "5%" }, rotation: "-12deg" },
          { text: "STYLE", pos: { top: "60%", left: "85%" }, rotation: "18deg" },
          { text: "TREND", pos: { top: "80%", left: "15%" }, rotation: "-8deg" },
          { text: "2000s", pos: { top: "15%", right: "10%" }, rotation: "25deg" },
          { text: "RETRO", pos: { top: "40%", left: "2%" }, rotation: "-25deg" },
          { text: "GLAM", pos: { top: "75%", right: "5%" }, rotation: "15deg" }
        ].map((item, index) => {
          const textInfo = textData[index];
          if (!textInfo) return null;
          
          return (
            <div
              key={`text-${index}`}
              className="absolute text-black opacity-20 font-black uppercase tracking-wider"
              style={{
                ...item.pos,
                transform: `rotate(${item.rotation})`,
                fontSize: `${textInfo.fontSize}px`,
                zIndex: 5
              }}
            >
              {item.text}
            </div>
          );
        })}
      </div>

      {/* Decorative torn paper edges */}
      <div className="absolute inset-0 pointer-events-none">
        {tornPaperData.map((paper, i) => (
          <div
            key={`torn-${i}`}
            className="absolute bg-white opacity-40"
            style={{
              top: `${paper.top}%`,
              left: `${paper.left}%`,
              width: `${paper.width}px`,
              height: `${paper.height}px`,
              transform: `rotate(${paper.rotation}deg)`,
              clipPath: paper.clipPath,
              zIndex: 3
            }}
          />
        ))}
      </div>

      {/* Sticker effects */}
      <div className="absolute inset-0 pointer-events-none">
        {stickerData.map((sticker, i) => (
          <div
            key={`sticker-${i}`}
            className="absolute"
            style={{
              top: `${sticker.top}%`,
              left: `${sticker.left}%`,
              transform: `rotate(${sticker.rotation}deg)`,
              zIndex: 8
            }}
          >
            <div className="relative">
              <div className="w-8 h-8 bg-[#FF00B6] opacity-80 border-2 border-white shadow-md transform rotate-45" />
              <div className="absolute inset-0 w-8 h-8 bg-[#FEB6DE] opacity-60 border border-white transform -rotate-12" />
            </div>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-20">
        {children}
      </div>
    </div>
  );
}