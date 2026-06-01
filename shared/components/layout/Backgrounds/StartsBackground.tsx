"use client"
import { ReactNode, useEffect, useRef } from "react";

const STAR_SVG = "M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z";
const HEART_SVG = "M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z";

type Particle = { x: number; y: number; size: number; baseSize: number; opacity: number; speed: number; phase: number; };
type Sparkle = Particle & { type: "star" | "heart"; rotation: number; rotationSpeed: number; };

export default function StartsBackgroud({ children }: { children: ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const starPath = new Path2D(STAR_SVG);
    const heartPath = new Path2D(HEART_SVG);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    const particles: Particle[] = Array.from({ length: 40 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      baseSize: Math.random() * 2.5 + 0.5,
      size: 0,
      opacity: Math.random() * 0.5 + 0.1,
      speed: Math.random() * 0.02 + 0.01,
      phase: Math.random() * Math.PI * 2,
    }));

    const sparkles: Sparkle[] = Array.from({ length: 20 }).map((_, i) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      baseSize: Math.random() * 10 + 6,
      size: 0,
      opacity: Math.random() * 0.5 + 0.1,
      speed: Math.random() * 0.04 + 0.02,
      phase: Math.random() * Math.PI * 2,
      type: i % 2 === 0 ? "star" : "heart",
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
    }));

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const pinkColor = "255, 0, 182";

      particles.forEach((p) => {
        p.phase += p.speed;
        p.size = p.baseSize + Math.sin(p.phase) * (p.baseSize * 0.5);

        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.abs(p.size), 0, Math.PI * 2);

        ctx.shadowBlur = 6;
        ctx.shadowColor = `rgba(${pinkColor}, 0.5)`;
        ctx.fillStyle = `rgba(${pinkColor}, ${p.opacity})`;
        ctx.fill();
      });

      sparkles.forEach((s) => {
        s.phase += s.speed;
        s.rotation += s.rotationSpeed;

        const scale = 1 + Math.sin(s.phase) * 0.3;
        const currentOpacity = s.opacity + Math.sin(s.phase) * 0.2;

        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rotation);


        const scaleFactor = (s.baseSize / 24) * scale;
        ctx.translate(-12 * scaleFactor, -12 * scaleFactor);
        ctx.scale(scaleFactor, scaleFactor);

        ctx.shadowBlur = 8;
        ctx.shadowColor = "rgba(255,255,255,0.4)";
        ctx.fillStyle = `rgba(${pinkColor}, ${Math.max(0.1, currentOpacity)})`;
        ctx.fill(s.type === "star" ? starPath : heartPath);

        ctx.restore();
      });


      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

        <div
          className="absolute inset-0 opacity-[1] mix-blend-overlay"
          style={{
            backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')",
          }}
        />
      </div>
      {children}
    </>
  );
}
