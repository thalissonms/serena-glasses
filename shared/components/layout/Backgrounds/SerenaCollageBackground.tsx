import Image from "next/image"

interface SerenaCollageBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

function seededRandom(seed: number) {
  return function () {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}


const random = seededRandom(12345);

const mockImages = [
  "https://images.unsplash.com/photo-1586202146107-4c14321edb2a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb3VuZCUyMHN1bmdsYXNzZXMlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NTkxOTIzNTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1656360089594-d6523d472d1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMHN1bmdsYXNzZXMlMjBmYXNoaW9ufGVufDF8fHx8MTc1OTE5MjM0OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1755869973597-b6154bb885e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwZXlld2VhciUyMHJldHJvfGVufDF8fHx8MTc1OTE5MjM1MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
];

const CLIPPING_DATA = [...Array(20)].map(() => {
  const lineCount = 3 + Math.floor(random() * 3);
  return {
    top: random() * 100,
    left: random() * 100,
    width: 60 + random() * 80,
    height: 40 + random() * 60,
    rotation: random() * 360 - 180,
    lines: lineCount,
    lineWidths: [...Array(lineCount)].map(() => 50 + random() * 40)
  };
});

const LARGE_CLIPPING_DATA = [...Array(8)].map(() => ({
  top: random() * 80,
  left: random() * 80,
  width: 100 + random() * 80,
  height: 80 + random() * 60,
  rotation: random() * 60 - 30,
  lines: 4,
  lineWidths: [...Array(4)].map(() => 60 + random() * 30)
}));

const PHOTO_DATA = mockImages.map(() => ({
  top: 15 + random() * 70,
  left: 10 + random() * 80,
  rotation: random() * 40 - 20
}));

const TORN_PAPER_DATA = [...Array(6)].map(() => ({
  top: random() * 100,
  left: random() * 100,
  width: 20 + random() * 40,
  height: 3 + random() * 5,
  rotation: random() * 360,
  clipPath: `polygon(0% 0%, ${80 + random() * 20}% 0%, 100% 100%, ${10 + random() * 20}% 100%)`
}));

const STICKER_DATA = [...Array(4)].map(() => ({
  top: 20 + random() * 60,
  left: 20 + random() * 60,
  rotation: random() * 60 - 30
}));

const TEXT_DATA = [
  { text: "FASHION", pos: { top: "20%", left: "5%" }, rotation: "-12deg", fontSize: 8 + random() * 6 },
  { text: "STYLE", pos: { top: "60%", left: "85%" }, rotation: "18deg", fontSize: 8 + random() * 6 },
  { text: "TREND", pos: { top: "80%", left: "15%" }, rotation: "-8deg", fontSize: 8 + random() * 6 },
  { text: "2000s", pos: { top: "15%", right: "10%" }, rotation: "25deg", fontSize: 8 + random() * 6 },
  { text: "RETRO", pos: { top: "40%", left: "2%" }, rotation: "-25deg", fontSize: 8 + random() * 6 },
  { text: "GLAM", pos: { top: "75%", right: "5%" }, rotation: "15deg", fontSize: 8 + random() * 6 }
];

export function SerenaCollageBackground({ children, className = "" }: SerenaCollageBackgroundProps) {

  return (
    <div className={`relative overflow-hidden ${className} bg-linear-to-b from-brand-pink bg-[url('/backgrounds/bg-clipper-gradient.png')] dark:bg-[url('/backgrounds/bg-clipper-gradient-dark.png')] bg-no-repeat bg-cover bg-blend-multiply dark:bg-blend-screen bg-center to-white/90 dark:to-brand-pink-bg-dark/10`}>
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

        {CLIPPING_DATA.map((clipping, i) => (
          <div
            key={`clipping-${i}`}
            className="absolute border border-gray-300 bg-gray-100 shadow-sm"
            style={{
              top: `${clipping.top}%`,
              left: `${clipping.left}%`,
              width: `${clipping.width}px`,
              height: `${clipping.height}px`,
              transform: `rotate(${clipping.rotation}deg)`,
              zIndex: 1
            }}
          >
            <div className="space-y-1 p-1">
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

        {LARGE_CLIPPING_DATA.map((clipping, i) => (
          <div
            key={`large-clipping-${i}`}
            className="absolute border border-gray-400 bg-white p-2 shadow-md"
            style={{
              top: `${clipping.top}%`,
              left: `${clipping.left}%`,
              width: `${clipping.width}px`,
              height: `${clipping.height}px`,
              transform: `rotate(${clipping.rotation}deg)`,
              zIndex: 2
            }}
          >
            <div className="space-y-1">
              <div className="h-2 w-full bg-black opacity-40" />
              <div className="h-1 w-3/4 bg-black opacity-25" />
              <div className="h-1 w-1/2 bg-black opacity-25" />
              <div className="mt-2 space-y-0.5">
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

      <div className="pointer-events-none absolute inset-0">
        {mockImages.map((image, index) => {
          const photo = PHOTO_DATA[index];
          if (!photo) return null;

          return (
            <div
              key={`photo-${index}`}
              className="group absolute"
              style={{
                top: `${photo.top}%`,
                left: `${photo.left}%`,
                transform: `rotate(${photo.rotation}deg)`,
                zIndex: 10 + index,
                opacity: 0.2,
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
              }}
            >
              <div
                className="absolute -top-2 -left-1 h-4 w-12 border border-gray-300 bg-gray-200 opacity-70 shadow-sm"
                style={{ transform: 'rotate(-15deg)' }}
              />
              <div
                className="absolute -right-1 -bottom-2 h-4 w-10 border border-gray-300 bg-gray-200 opacity-70 shadow-sm"
                style={{ transform: 'rotate(25deg)' }}
              />

              <div className="relative h-24 w-24 border-2 border-white bg-white shadow-lg">
                <Image
                  src={image}
                  alt={`Collage item ${index + 1}`}
                  className="h-full w-full object-cover"
                  fill
                  sizes="96px"
                />
                <div className="absolute inset-0 shadow-xl" />
              </div>

              <div
                className="absolute top-1 right-1 h-6 w-6 border border-gray-300 bg-gray-200 opacity-60"
                style={{ transform: 'rotate(45deg)' }}
              />
            </div>
          );
        })}
      </div>

      <div className="pointer-events-none absolute inset-0">
        {TEXT_DATA.map((item, index) => (
          <div
            key={`text-${index}`}
            className="absolute font-black tracking-wider text-black uppercase opacity-20"
            style={{
              ...item.pos,
              transform: `rotate(${item.rotation})`,
              fontSize: `${item.fontSize}px`,
              zIndex: 5
            }}
          >
            {item.text}
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0">
        {TORN_PAPER_DATA.map((paper, i) => (
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

      <div className="pointer-events-none absolute inset-0">
        {STICKER_DATA.map((sticker, i) => (
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
              <div className="h-8 w-8 rotate-45 transform border-2 border-white opacity-80 shadow-md" />
              <div className="absolute inset-0 h-8 w-8  -rotate-12 transform border border-white opacity-60" />
            </div>
          </div>
        ))}
      </div>

      <div className="relative z-20">
        {children}
      </div>
    </div>
  );
}