import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';

export default function SettingsPage() {
  const navigate = useNavigate();
  const [showInput, setShowInput] = useState(false);
  const [code, setCode] = useState('');
  const [shake, setShake] = useState(false);

  const handleSubmit = () => {
    if (code === '52778') {
      navigate('/secret');
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="pb-24 px-4 max-w-lg mx-auto">
      <h2 className="text-xl font-bold text-center py-4 text-white tracking-wide">
        设置
      </h2>

      <div className="glass-card rounded-2xl overflow-hidden">
        <button
          onClick={() => setShowInput(true)}
          className="w-full flex items-center justify-between px-4 py-4 hover:bg-white/5 transition-colors"
        >
          <span className="text-sm text-gray-300">点</span>
          <Icon name="chevron-right" size={16} className="text-gray-500" />
        </button>
      </div>

      {/* Input Modal */}
      {showInput && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
          onClick={() => { setShowInput(false); setCode(''); }}
        >
          <div
            className="bg-[#1c1c1c] border border-white/[0.06] rounded-3xl w-[300px] p-6 animate-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-white font-semibold text-center mb-4">输入密码</h3>
            <input
              type="password"
              inputMode="numeric"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              autoFocus
              className={`w-full bg-[#111] border rounded-xl px-4 py-3 text-white text-center text-lg tracking-widest focus:outline-none transition-colors ${shake ? 'border-red-500 animate-shake' : 'border-[#333] focus:border-brand-500'}`}
              placeholder="•••••"
            />
            <button
              onClick={handleSubmit}
              className="w-full mt-4 bg-brand-500 text-white rounded-xl py-2.5 font-medium hover:bg-brand-600 transition-colors active:scale-[0.98]"
            >
              确认
            </button>
            <button
              onClick={() => { setShowInput(false); setCode(''); }}
              className="w-full mt-2 bg-[#222] border border-[#333] text-gray-400 rounded-xl py-2.5 text-sm hover:bg-[#2a2a2a] transition-colors"
            >
              取消
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
