import { NavLink } from 'react-router-dom';
import Icon from './Icon';

const tabs = [
  { path: '/dashboard', label: '首页', icon: 'home' as const },
  { path: '/checkin', label: '打卡', icon: 'calendar' as const },
  { path: '/guidance', label: '指导', icon: 'book' as const },
  { path: '/profile', label: '我的', icon: 'person' as const },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-4 left-4 right-4 z-50 safe-area-bottom">
      <div className="max-w-lg mx-auto bg-[#1a1a1a]/90 backdrop-blur-xl border border-[#2a2a2a]/80 rounded-2xl shadow-lg shadow-black/40">
        <div className="flex justify-around py-1.5 px-1">
          {tabs.map((tab) => (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={({ isActive }) =>
                `relative flex flex-col items-center justify-center px-3 py-2 rounded-xl text-sm transition-all duration-300 ease-out min-w-[64px] ${
                  isActive
                    ? 'text-brand-500'
                    : 'text-gray-600 hover:text-gray-400'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute inset-1 bg-brand-500/10 border border-brand-500/20 rounded-xl transition-all duration-300" />
                  )}
                  <span className={`relative transition-all duration-300 ${isActive ? 'scale-110 -translate-y-0.5' : ''}`}>
                    <Icon name={tab.icon} size={22} />
                  </span>
                  <span
                    className={`relative text-[10px] mt-0.5 transition-all duration-300 font-medium ${
                      isActive ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'
                    }`}
                  >
                    {tab.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
