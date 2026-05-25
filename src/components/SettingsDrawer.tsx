import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from './Icon';

export default function SettingsDrawer() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [code, setCode] = useState('');
  const [shake, setShake] = useState(false);

  const handleSubmit = () => {
    if (code === '52778') {
      setOpen(false);
      setShowInput(false);
      setCode('');
      navigate('/secret');
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setShowInput(false);
    setCode('');
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 text-gray-500 hover:text-gray-300 transition-colors"
      >
        <Icon name="menu" size={20} />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 transition-opacity duration-300"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' }}
          onClick={handleClose}
        >
          {/* Sidebar — slides from right */}
          <div
            className="absolute top-0 right-0 h-full bg-[#1a1a1a] border-l border-white/[0.06] shadow-2xl overflow-y-auto animate-slide-in-right"
            style={{ width: 'min(320px, 75vw)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-5 border-b border-white/[0.05]">
              <h3 className="text-white font-semibold text-base">设置</h3>
              <button
                onClick={handleClose}
                className="p-1 text-gray-500 hover:text-gray-300 transition-colors"
              >
                <Icon name="cross" size={18} />
              </button>
            </div>

            {/* Menu items */}
            <div className="px-3 py-2">
              <button
                onClick={() => setShowInput(true)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-left"
              >
                <span className="text-sm text-gray-300">点</span>
                <Icon name="chevron-right" size={14} className="text-gray-500" />
              </button>
            </div>

            {/* Version info */}
            <div className="absolute bottom-8 left-0 right-0 text-center">
              <p className="text-xs text-gray-700">乐乐 v26.5.4</p>
            </div>
          </div>

          {/* Password Modal */}
          {showInput && (
            <div
              className="fixed inset-0 z-[60] flex items-center justify-center"
              style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
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
      )}
    </>
  );
}
