import React, { useEffect, useRef } from 'react';

interface ParticleBackgroundProps {
  isDark: boolean;
  particleCount?: number;
  className?: string;
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({ 
  isDark, 
  particleCount = 50,
  className = "" 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
    life: number;
    maxLife: number;
  }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    const particles = particlesRef.current;
    for (let i = 0; i < particleCount; i++) {
      particles[i] = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.3 + 0.1,
        life: 0,
        maxLife: Math.random() * 300 + 200
      };
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        // Update particle position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life++;

        // Fade in/out effect
        const lifeFactor = Math.sin((particle.life / particle.maxLife) * Math.PI);
        const currentOpacity = particle.opacity * lifeFactor;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Reset particle when life ends
        if (particle.life >= particle.maxLife) {
          particle.x = Math.random() * canvas.width;
          particle.y = Math.random() * canvas.height;
          particle.life = 0;
          particle.maxLife = Math.random() * 300 + 200;
        }

        // Draw particle
        ctx.save();
        ctx.globalAlpha = currentOpacity;
        ctx.fillStyle = isDark 
          ? `rgba(139, 92, 246, ${currentOpacity})` 
          : `rgba(139, 92, 246, ${currentOpacity * 0.6})`;
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add subtle glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = isDark ? '#8B5CF6' : '#A855F7';
        ctx.fill();
        
        ctx.restore();

        // Connect nearby particles with lines
        particles.forEach((otherParticle, otherIndex) => {
          if (index !== otherIndex) {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
              const lineOpacity = (1 - distance / 100) * 0.1 * lifeFactor;
              ctx.save();
              ctx.globalAlpha = lineOpacity;
              ctx.strokeStyle = isDark 
                ? `rgba(139, 92, 246, ${lineOpacity})` 
                : `rgba(139, 92, 246, ${lineOpacity * 0.5})`;
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.stroke();
              ctx.restore();
            }
          }
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isDark, particleCount]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{ opacity: isDark ? 0.6 : 0.4 }}
    />
  );
};

export default ParticleBackground; 