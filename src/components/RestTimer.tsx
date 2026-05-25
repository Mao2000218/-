import { useState, useEffect, useRef, useCallback } from 'react';

const PRESETS = [30, 60, 90, 120];

interface RestTimerProps {
  onComplete?: () => void;
}

export default function RestTimer({ onComplete }: RestTimerProps) {
  const [totalSeconds, setTotalSeconds] = useState(60);
  const [remaining, setRemaining] = useState(0);
  const [running, setRunning] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const startedTotalRef = useRef<number>(0);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(
    (seconds: number) => {
      clearTimer();
      setRunning(true);
      setRemaining(seconds);
      setTotalSeconds(seconds);
      startedTotalRef.current = seconds;
      startTimeRef.current = Date.now();

      intervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        const left = startedTotalRef.current - elapsed;
        if (left <= 0) {
          clearTimer();
          setRemaining(0);
          setRunning(false);
          if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
          if (Notification.permission === 'granted') {
            new Notification('FitTrack 计时器', { body: '休息时间结束，继续训练！' });
          }
          onComplete?.();
        } else {
          setRemaining(left);
        }
      }, 200);
    },
    [clearTimer, onComplete]
  );

  const stop = useCallback(() => {
    clearTimer();
    setRunning(false);
    setRemaining(0);
  }, [clearTimer]);

  useEffect(() => {
    return clearTimer;
  }, [clearTimer]);

  useEffect(() => {
    if (running && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [running]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${String(sec).padStart(2, '0')}`;
  };

  const progress = running ? remaining / totalSeconds : 1;
  const r = 28;
  const circumference = 2 * Math.PI * r;

  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-sm text-white">组间休息</h4>
        {running && (
          <span className="text-brand-500 font-bold text-lg tabular-nums">
            {formatTime(remaining)}
          </span>
        )}
      </div>

      {running ? (
        <div className="flex items-center gap-4">
          <svg width="64" height="64" className="shrink-0 -rotate-90">
            <circle cx="32" cy="32" r={r} fill="none" stroke="#2a2a2a" strokeWidth="4" />
            <circle
              cx="32"
              cy="32"
              r={r}
              fill="none"
              stroke="#f97316"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${progress * circumference} ${circumference}`}
              className="transition-all duration-200"
            />
            <text x="32" y="32" fill="#fff" fontSize="14" fontWeight="bold" textAnchor="middle" dy="5" transform="rotate(90, 32, 32)">
              {formatTime(remaining)}
            </text>
          </svg>
          <button
            onClick={stop}
            className="bg-[#333] text-white rounded-xl px-5 py-2 text-sm font-medium hover:bg-[#444] transition-colors"
          >
            停止
          </button>
        </div>
      ) : (
        <>
          <div className="flex gap-2 mb-3">
            {PRESETS.map((s) => (
              <button
                key={s}
                onClick={() => start(s)}
                className="flex-1 bg-[#111] border border-[#333] text-gray-300 rounded-xl py-2 text-sm hover:border-brand-500 hover:text-brand-400 transition-all active:scale-[0.97]"
              >
                {s >= 60 ? `${s / 60}min` : `${s}s`}
              </button>
            ))}
          </div>
          {showCustom ? (
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="秒数"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                className="flex-1 bg-[#111] border border-[#333] rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const s = parseInt(customInput);
                    if (s > 0) { start(s); setShowCustom(false); setCustomInput(''); }
                  }
                }}
                autoFocus
              />
              <button
                onClick={() => {
                  const s = parseInt(customInput);
                  if (s > 0) { start(s); setShowCustom(false); setCustomInput(''); }
                }}
                className="bg-brand-500 text-white rounded-xl px-4 py-2 text-sm font-medium hover:bg-brand-600"
              >
                开始
              </button>
              <button onClick={() => setShowCustom(false)} className="text-gray-500 text-sm px-2">取消</button>
            </div>
          ) : (
            <button
              onClick={() => setShowCustom(true)}
              className="text-gray-500 text-xs hover:text-gray-400 transition-colors"
            >
              + 自定义时间
            </button>
          )}
        </>
      )}
    </div>
  );
}
