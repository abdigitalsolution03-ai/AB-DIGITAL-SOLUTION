import { useEffect, useRef } from "react";

function createParticle(x: number, y: number) {
  const particle = document.createElement("div");
  const angle = Math.random() * Math.PI * 2;
  const velocity = 40 + Math.random() * 80;
  const size = 3 + Math.random() * 4;

  particle.style.cssText = `
    position: fixed;
    left: ${x}px;
    top: ${y}px;
    width: ${size}px;
    height: ${size}px;
    border-radius: 50%;
    pointer-events: none;
    z-index: 99999;
    background: #FFD400;
    box-shadow: 0 0 6px rgba(255, 212, 0, 0.8);
  `;

  document.body.appendChild(particle);

  const start = performance.now();
  const dx = Math.cos(angle) * velocity;
  const dy = Math.sin(angle) * velocity;

  function animate(now: number) {
    const elapsed = now - start;
    const progress = elapsed / 400;
    if (progress >= 1) {
      particle.remove();
      return;
    }
    const decay = 1 - progress;
    particle.style.left = `${x + dx * progress}px`;
    particle.style.top = `${y + dy * progress}px`;
    particle.style.opacity = `${decay}`;
    particle.style.transform = `scale(${decay})`;
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}

function createRipple(x: number, y: number) {
  const ripple = document.createElement("div");
  ripple.style.cssText = `
    position: fixed;
    left: ${x - 20}px;
    top: ${y - 20}px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    pointer-events: none;
    z-index: 99999;
    border: 3px solid #FFD400;
    opacity: 1;
  `;

  document.body.appendChild(ripple);

  const start = performance.now();

  function animate(now: number) {
    const elapsed = now - start;
    const progress = elapsed / 500;
    if (progress >= 1) {
      ripple.remove();
      return;
    }
    const scale = 1 + progress * 3;
    const opacity = 1 - progress;
    ripple.style.transform = `scale(${scale})`;
    ripple.style.opacity = `${opacity}`;
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}

export default function PremiumCursor() {
  const styleInjected = useRef(false);

  useEffect(() => {
    if (styleInjected.current) return;
    styleInjected.current = true;

    const handleClick = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      createRipple(clientX, clientY);
      for (let i = 0; i < 8; i++) {
        createParticle(clientX, clientY);
      }
    };

    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return null;
}
