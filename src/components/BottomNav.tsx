import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useEffect, useState, useRef, useCallback } from 'react';
import Icon from './Icon';

const tabs = [
  { path: '/dashboard', icon: 'home' as const },
  { path: '/checkin', icon: 'calendar' as const },
  { path: '/guidance', icon: 'book' as const },
  { path: '/profile', icon: 'person' as const },
];

const DRAG_THRESHOLD = 5;

export default function BottomNav() {
  const location = useLocation();
  const navRef = useRef<HTMLDivElement>(null);
  const glassRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const [isTransitioning, setIsTransitioning] = useState(false);

  const [dragOffset, setDragOffset] = useState(0);
  const [dropletPhase, setDropletPhase] = useState<'idle' | 'expand' | 'contract'>('idle');
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const hasMoved = useRef(false);
  const springFrame = useRef(0);
  const dropletTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const activeIndex = tabs.findIndex((t) => t.path === location.pathname);

  useEffect(() => {
    if (!navRef.current) return;
    setIsTransitioning(true);
    const items = navRef.current.querySelectorAll('[data-tab-item]');
    if (items.length === 0) return;
    const activeEl = items[Math.max(0, activeIndex)] as HTMLElement;
    const navRect = navRef.current.getBoundingClientRect();
    const elRect = activeEl.getBoundingClientRect();
    setIndicatorStyle({
      left: elRect.left - navRect.left,
      width: elRect.width,
    });
    const timer = setTimeout(() => setIsTransitioning(false), 500);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const springBack = useCallback(() => {
    setDragOffset((prev) => {
      if (Math.abs(prev) < 0.2) return 0;
      return prev * 0.75;
    });
    if (Math.abs(dragOffset) > 0.2) {
      springFrame.current = requestAnimationFrame(() => springBack());
    }
  }, [dragOffset]);

  useEffect(() => {
    return () => {
      if (springFrame.current) cancelAnimationFrame(springFrame.current);
      if (dropletTimer.current) clearTimeout(dropletTimer.current);
    };
  }, []);

  const triggerDroplet = () => {
    setDropletPhase('expand');
    dropletTimer.current = setTimeout(() => {
      setDropletPhase('contract');
      dropletTimer.current = setTimeout(() => {
        setDropletPhase('idle');
      }, 400);
    }, 120);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('a')) return;
    isDragging.current = true;
    hasMoved.current = false;
    dragStartX.current = e.clientX;
    if (springFrame.current) cancelAnimationFrame(springFrame.current);
    triggerDroplet();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStartX.current;
    if (Math.abs(dx) < DRAG_THRESHOLD && !hasMoved.current) return;
    if (!hasMoved.current) {
      hasMoved.current = true;
      setDropletPhase('idle');
      navRef.current?.style.setProperty('pointer-events', 'none');
    }
    const clamped = Math.max(-40, Math.min(40, dx));
    setDragOffset(clamped);
  };

  const handlePointerUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (hasMoved.current) {
      setTimeout(() => {
        navRef.current?.style.removeProperty('pointer-events');
      }, 120);
      springFrame.current = requestAnimationFrame(() => springBack());
    }
  };

  const gx = dragOffset * 0.2;
  const gs = dragOffset * 0.012;
  const px = dragOffset * 0.45;

  // Droplet scale: 1 → 1.025 → 0.985 → 1
  const dropletScale =
    dropletPhase === 'expand' ? 1.028 :
    dropletPhase === 'contract' ? 0.985 :
    1;

  // Refraction intensifies during droplet expand
  const refractionOpacity = dropletPhase === 'expand' ? 0.6 : dropletPhase === 'contract' ? 0.25 : 0.3;

  return (
    <nav className="fixed bottom-4 left-4 right-4 z-50 flex justify-center">
      <div
        ref={navRef}
        className="relative w-full max-w-[370px] h-[56px] flex justify-around items-center px-1 select-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ touchAction: 'pan-x' }}
      >
        {/* === Frosted glass container — droplet scale === */}
        <div
          ref={glassRef}
          className="absolute inset-0 rounded-[28px]"
          style={{
            background: 'rgba(30, 30, 32, 0.5)',
            backdropFilter: 'blur(25px) saturate(180%)',
            WebkitBackdropFilter: 'blur(25px) saturate(180%)',
            boxShadow: `
              0 4px 24px rgba(0,0,0,0.5),
              0 0 0 0.5px rgba(255,255,255,0.07) inset,
              0 0 0 1px rgba(255,255,255,0.04)
            `,
            transform: `translateX(${gx}px) skewX(${gs}deg) scale(${dropletScale})`,
            transformOrigin: 'center center',
            transition:
              dropletPhase !== 'idle'
                ? 'transform 0.12s ease-out'
                : 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        />

        {/* === Chromatic refraction edge ring — subtle color fringe === */}
        <div
          className="absolute inset-[1px] rounded-[27px] pointer-events-none overflow-hidden"
          style={{
            opacity: refractionOpacity,
            transition: 'opacity 0.15s ease-out',
          }}
        >
          <div
            className="absolute inset-0 rounded-[27px]"
            style={{
              background: `
                conic-gradient(
                  from 0deg,
                  rgba(255,130,80,0.12) 0deg,
                  rgba(255,190,70,0.08) 30deg,
                  rgba(180,230,100,0.06) 60deg,
                  rgba(80,200,240,0.08) 90deg,
                  rgba(100,150,255,0.08) 120deg,
                  rgba(170,110,240,0.1) 150deg,
                  rgba(255,130,180,0.09) 180deg,
                  rgba(255,130,80,0.12) 210deg,
                  rgba(255,190,70,0.08) 240deg,
                  rgba(180,230,100,0.06) 270deg,
                  rgba(80,200,240,0.08) 300deg,
                  rgba(100,150,255,0.08) 330deg,
                  rgba(170,110,240,0.1) 360deg
                )
              `,
              WebkitMask: 'radial-gradient(ellipse 98% 92% at 50% 50%, transparent 0%, black 60%, transparent 95%)',
              mask: 'radial-gradient(ellipse 98% 92% at 50% 50%, transparent 0%, black 60%, transparent 95%)',
              transform: `translateX(${gx}px) skewX(${gs}deg) scale(${dropletScale})`,
              transformOrigin: 'center center',
              transition:
                dropletPhase !== 'idle'
                  ? 'transform 0.12s ease-out'
                  : 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          />
        </div>

        {/* === Active pill indicator === */}
        <div
          className="absolute top-[5px] bottom-[5px] rounded-[22px] pointer-events-none"
          style={{
            left: `${indicatorStyle.left + 3}px`,
            width: `${indicatorStyle.width - 6}px`,
            transform: `translateX(${px}px)`,
            transition: isDragging.current
              ? 'none'
              : isTransitioning
                ? 'left 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)'
                : 'none',
            background: 'rgba(120, 120, 128, 0.28)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          }}
        />

        {/* === Tab icons === */}
        {tabs.map((tab, i) => {
          const isActive = i === activeIndex;
          return (
            <Link
              key={tab.path}
              to={tab.path}
              data-tab-item
              className="relative flex items-center justify-center flex-1 h-full z-10"
            >
              <span
                className="block"
                style={{
                  transform: isActive ? 'scale(1.05)' : 'scale(1)',
                  transition: 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
              >
                <Icon
                  name={tab.icon}
                  size={24}
                  className={isActive ? 'text-white' : 'text-gray-500'}
                  filled={isActive}
                />
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
