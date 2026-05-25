import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import Icon from './Icon';

const tabs = [
  { path: '/dashboard', label: '首页', icon: 'home' as const },
  { path: '/checkin', label: '打卡', icon: 'calendar' as const },
  { path: '/guidance', label: '指导', icon: 'book' as const },
  { path: '/profile', label: '我的', icon: 'person' as const },
];

export default function BottomNav() {
  const location = useLocation();
  const navRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const [isTransitioning, setIsTransitioning] = useState(false);

  const activeIndex = tabs.findIndex((t) => t.path === location.pathname);

  useEffect(() => {
    if (!navRef.current) return;
    setIsTransitioning(true);

    const items = navRef.current.querySelectorAll('[data-tab-item]');
    if (items.length === 0) return;

    const activeEl = items[Math.max(0, activeIndex)] as HTMLElement;
    const navRect = navRef.current.getBoundingClientRect();
    const elRect = activeEl.getBoundingClientRect();

    const left = elRect.left - navRect.left;
    const width = elRect.width;

    setIndicatorStyle({ left, width });

    const timer = setTimeout(() => setIsTransitioning(false), 500);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <nav className="fixed bottom-4 left-4 right-4 z-50">
      <div className="max-w-lg mx-auto">
        {/* Liquid glass container */}
        <div
          className="relative rounded-2xl px-1 py-1.5 flex justify-around items-center"
          style={{
            background: 'rgba(28, 28, 28, 0.55)',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            boxShadow: `
              0 8px 32px rgba(0,0,0,0.5),
              0 1px 0 rgba(255,255,255,0.06) inset,
              0 -1px 0 rgba(255,255,255,0.03) inset
            `,
          }}
        >
          {/* Glass edge highlight ring */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              border: '1px solid transparent',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 40%, rgba(255,255,255,0.05) 60%, rgba(255,255,255,0.08) 100%) border-box',
              WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
            }}
          />

          {/* Morphing pill indicator */}
          <div
            className="absolute top-1.5 bottom-1.5 rounded-xl pointer-events-none"
            style={{
              left: `${indicatorStyle.left}px`,
              width: `${indicatorStyle.width}px`,
              transition: isTransitioning
                ? 'left 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)'
                : 'none',
              background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.25) 0%, rgba(249, 115, 22, 0.12) 100%)',
              boxShadow: `
                0 2px 8px rgba(249, 115, 22, 0.15),
                0 0 0 1px rgba(249, 115, 22, 0.2) inset,
                0 1px 0 rgba(255,255,255,0.05) inset
              `,
            }}
          >
            {/* Pill top highlight reflection */}
            <div
              className="absolute top-0 left-3 right-3 h-px rounded-full"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
              }}
            />
          </div>

          {/* Tab items */}
          {tabs.map((tab, i) => {
            const isActive = i === activeIndex;
            return (
              <Link
                key={tab.path}
                to={tab.path}
                data-tab-item
                className={`relative flex flex-col items-center justify-center px-3 py-2 rounded-xl text-sm transition-colors duration-300 min-w-[64px] z-10 ${
                  isActive
                    ? 'text-brand-400'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <span
                  className="transition-transform duration-300"
                  style={{
                    transform: isActive ? 'translateY(-1px) scale(1.05)' : 'translateY(0) scale(1)',
                  }}
                >
                  <Icon name={tab.icon} size={22} />
                </span>
                <span
                  className={`text-[10px] mt-0.5 font-medium transition-all duration-300 ${
                    isActive
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 -translate-y-1'
                  }`}
                >
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
