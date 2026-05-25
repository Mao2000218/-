import { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import OverscrollBounce from './components/OverscrollBounce';
import Dashboard from './pages/Dashboard';
import CheckInPage from './pages/CheckInPage';
import GuidancePage from './pages/GuidancePage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import SecretPage from './pages/SecretPage';
import { restoreAllData } from './services/dataBackup';

function AnimatedRoutes() {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState('animate-page-enter');

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setTransitionStage('');
      const timeout = setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage('animate-page-enter');
      }, 60);
      return () => clearTimeout(timeout);
    }
  }, [location, displayLocation]);

  return (
    <div key={displayLocation.pathname} className={transitionStage}>
      <Routes location={displayLocation}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/checkin" element={<CheckInPage />} />
        <Route path="/guidance" element={<GuidancePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/secret" element={<SecretPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
}

export default function App() {
  useEffect(() => {
    restoreAllData();
  }, []);

  return (
    <HashRouter>
      <div
        className="min-h-screen bg-[#111] text-white selection:bg-brand-500/30"
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        <OverscrollBounce>
          <AnimatedRoutes />
        </OverscrollBounce>
        <BottomNav />
      </div>
    </HashRouter>
  );
}
