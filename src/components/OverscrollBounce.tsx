import { useEffect, useRef, useCallback } from 'react';

export default function OverscrollBounce({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const currentPull = useRef(0);
  const pulling = useRef(false);

  const resetWithSpring = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    el.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    el.style.transform = 'translateY(0)';
    currentPull.current = 0;
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onTouchStart = (e: TouchEvent) => {
      // Only activate at the top of the page (scrollTop === 0)
      if (window.scrollY > 2) return;
      startY.current = e.touches[0].clientY;
      pulling.current = true;
      el.style.transition = 'none';
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!pulling.current) return;
      const deltaY = e.touches[0].clientY - startY.current;

      // Only handle pull-down (deltaY > 0)
      if (deltaY <= 0) {
        if (deltaY < -5) pulling.current = false;
        el.style.transform = 'translateY(0)';
        return;
      }

      // Rubber-band resistance: sqrt reduces pull distance progressively
      const pull = Math.min(deltaY, 180);
      const resistance = Math.sqrt(pull) * 8;
      currentPull.current = resistance;
      el.style.transform = `translateY(${resistance}px)`;
    };

    const onTouchEnd = () => {
      if (!pulling.current) return;
      pulling.current = false;
      resetWithSpring();
    };

    const onTouchCancel = () => {
      if (!pulling.current) return;
      pulling.current = false;
      resetWithSpring();
    };

    // Attach to document for reliable capture
    document.addEventListener('touchstart', onTouchStart, { passive: false });
    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', onTouchEnd);
    document.addEventListener('touchcancel', onTouchCancel);

    return () => {
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
      document.removeEventListener('touchcancel', onTouchCancel);
    };
  }, [resetWithSpring]);

  return (
    <div ref={containerRef} style={{ willChange: 'transform' }}>
      {children}
    </div>
  );
}
