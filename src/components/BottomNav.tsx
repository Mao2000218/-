import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useEffect, useState, useRef, useCallback } from 'react';
import Icon from './Icon';

const tabs = [
  { path: '/dashboard', icon: 'home' as const },
  { path: '/checkin', icon: 'calendar' as const },
  { path: '/guidance', icon: 'book' as const },
  { path: '/profile', icon: 'person' as const },
];

const DRAG_THRESHOLD = 30;
const TAP_THRESHOLD = 8;

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const navRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const [isTransitioning, setIsTransitioning] = useState(false);

  const [dragOffset, setDragOffset] = useState(0);
  const [isPressed, setIsPressed] = useState(false);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const hasMoved = useRef(false);
  const springFrame = useRef(0);
  const totalDrag = useRef(0);

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
      const next = prev * 0.8;
      if (Math.abs(next) < 0.3) return 0;
      return next;
    });
    if (Math.abs(dragOffset) > 1) {
      springFrame.current = requestAnimationFrame(() => springBack());
    }
  }, [dragOffset]);

  useEffect(() => {
    return () => {
      if (springFrame.current) cancelAnimationFrame(springFrame.current);
    };
  }, []);

  const handleNavigate = useCallback((direction: number) => {
    const newIndex = Math.max(0, Math.min(tabs.length - 1, activeIndex - direction));
    if (newIndex !== activeIndex) {
      navigate(tabs[newIndex].path);
    }
  }, [activeIndex, navigate]);

  const handlePointerDown = (e: React.PointerEvent) => {
    // Don't initiate drag if tapping on a link
    if ((e.target as HTMLElement).closest('a')) return;
    isDragging.current = true;
    hasMoved.current = false;
    totalDrag.current = 0;
    dragStartX.current = e.clientX;
    setIsPressed(true);
    if (springFrame.current) cancelAnimationFrame(springFrame.current);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStartX.current;
    if (Math.abs(dx) < TAP_THRESHOLD && !hasMoved.current) return;
    if (!hasMoved.current) {
      hasMoved.current = true;
      navRef.current?.style.setProperty('pointer-events', 'none');
    }
    totalDrag.current = dx;
    const clamped = Math.max(-60, Math.min(60, dx));
    setDragOffset(clamped);
  };

  const handlePointerUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    setIsPressed(false);

    if (hasMoved.current) {
      // Check if drag exceeds threshold for navigation
      const dx = totalDrag.current;
      if (Math.abs(dx) >= DRAG_THRESHOLD) {
        handleNavigate(dx > 0 ? -1 : 1);
      }
      setTimeout(() => {
        navRef.current?.style.removeProperty('pointer-events');
      }, 120);
      springFrame.current = requestAnimationFrame(() => springBack());
    }
  };

  // Glass scale: 1 → 1.04 on press
  const glassScale = isPressed ? 1.04 : 1;

  const gx = dragOffset * 0.2;
  const gs = dragOffset * 0.012;
  const px = dragOffset * 0.45;

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
        {/* Frosted glass container */}
        <div
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
            transform: `translateX(${gx}px) skewX(${gs}deg) scale(${glassScale})`,
            transformOrigin: 'center center',
            transition: isDragging.current
              ? 'none'
              : 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        />

        {/* Active pill indicator */}
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

        {/* Tab icons */}
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
