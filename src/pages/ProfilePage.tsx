import { useState, useRef, useMemo } from 'react';
import { useProfile } from '../hooks/useProfile';
import { useCheckIns } from '../hooks/useCheckIns';
import { useAchievements } from '../hooks/useAchievements';
import { LineChart, DonutChart } from '../components/StatChart';
import { getMuscleCounts } from '../data/achievements';
import Icon from '../components/Icon';
import type { IconName } from '../components/Icon';
import UpdateDialog from '../components/UpdateDialog';
import SettingsDrawer from '../components/SettingsDrawer';

const AVATAR_SHAPES = ['circle', 'triangle', 'square', 'diamond', 'hexagon', 'cross', 'star', 'moon'] as const;

const MUSCLE_COLORS: Record<string, string> = {
  胸部: '#f97316', 背部: '#fb923c', 腿部: '#fdba74', 肩部: '#ea580c', 手臂: '#c2410c', 核心: '#7c2d12', 有氧: '#9a3412',
};

const ACHIEVEMENT_ICONS: Record<string, string> = {
  'first-checkin': 'target',
  'streak-7': 'fire',
  'streak-30': 'diamond',
  'total-30': 'star',
  'total-100': 'trophy',
  'total-365': 'crown',
  'chest-master': 'hexagon',
  'back-master': 'triangle',
  'leg-master': 'circle',
  'all-round': 'star',
};

export default function ProfilePage() {
  const { profile, updateProfile, addBodyData } = useProfile();
  const { totalDays, checkins, getConsecutiveDays, getMonthDays } = useCheckIns();
  const { unlocked, locked } = useAchievements(totalDays, getConsecutiveDays(), checkins);

  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(profile.nickname);
  const [editingGoal, setEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState(profile.weeklyGoal);

  const [weightInput, setWeightInput] = useState('');
  const [bodyFatInput, setBodyFatInput] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const consecutiveDays = getConsecutiveDays();
  const monthDays = getMonthDays();

  const handleSaveName = () => {
    if (nameInput.trim()) {
      updateProfile({ nickname: nameInput.trim() });
    }
    setEditingName(false);
  };

  const handleSaveGoal = () => {
    updateProfile({ weeklyGoal: goalInput });
    setEditingGoal(false);
  };

  const handleAddBodyData = () => {
    const w = parseFloat(weightInput);
    const bf = parseFloat(bodyFatInput);
    if (w > 0) {
      addBodyData(w, bf || 0);
      setWeightInput('');
      setBodyFatInput('');
    }
  };

  const freqData = useMemo(() => {
    const days: number[] = [];
    const labels: string[] = [];
    const checkedSet = new Set(checkins.map((c) => c.date));
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().split('T')[0];
      days.push(checkedSet.has(ds) ? 1 : 0);
      if (i % 5 === 0 || i === 29) {
        labels.push(`${d.getMonth() + 1}/${d.getDate()}`);
      } else {
        labels.push('');
      }
    }
    return { data: days, labels };
  }, [checkins]);

  const muscleData = useMemo(() => {
    const counts = getMuscleCounts(checkins);
    return Object.entries(counts)
      .map(([label, value]) => ({ label, value, color: MUSCLE_COLORS[label] || '#555' }))
      .sort((a, b) => b.value - a.value);
  }, [checkins]);

  const bodyTrend = useMemo(() => {
    const data = [...profile.bodyData].sort((a, b) => a.date.localeCompare(b.date));
    const last14 = data.slice(-14);
    return {
      data: last14.map((d) => d.weight),
      labels: last14.map((d) => d.date.slice(5)),
    };
  }, [profile.bodyData]);

  const handleExport = () => {
    const data: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) data[key] = localStorage.getItem(key) ?? '';
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lele-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        for (const [key, value] of Object.entries(data)) {
          localStorage.setItem(key, String(value));
        }
        window.location.reload();
      } catch {
        alert('导入失败，请检查文件格式');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="pb-24 px-4 max-w-lg mx-auto">
      <div className="flex items-center justify-center relative py-4">
        <h2 className="text-xl font-bold text-white tracking-wide">
          个人主页
        </h2>
        <div className="absolute right-0">
          <SettingsDrawer />
        </div>
      </div>

      {/* Avatar & Nickname */}
      <div className="glass-card rounded-2xl p-6 mb-4 text-center">
        <div className="flex justify-center gap-3 mb-4 flex-wrap">
          {AVATAR_SHAPES.map((shape) => (
            <button
              key={shape}
              onClick={() => updateProfile({ avatar: shape })}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 ${
                profile.avatar === shape
                  ? 'bg-brand-500/15 ring-2 ring-brand-500 scale-110 text-brand-500'
                  : 'bg-[#222] text-gray-600 hover:bg-[#2a2a2a] hover:text-gray-400'
              }`}
            >
              <Icon name={shape} size={20} />
            </button>
          ))}
        </div>
        {editingName ? (
          <div className="flex gap-2 justify-center">
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="bg-[#111] border border-brand-500 rounded-xl px-4 py-1.5 text-sm text-center text-white w-40 focus:outline-none"
              onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
              autoFocus
            />
            <button
              onClick={handleSaveName}
              className="text-brand-500 text-sm font-medium hover:text-brand-400 transition-colors"
            >
              确定
            </button>
          </div>
        ) : (
          <div
            className="flex items-center justify-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => {
              setNameInput(profile.nickname);
              setEditingName(true);
            }}
          >
            <span className={profile.avatar ? 'text-brand-500' : ''}>
              <Icon name={(profile.avatar as typeof AVATAR_SHAPES[number]) || 'circle'} size={22} />
            </span>
            <h3 className="text-lg font-bold text-white hover:text-brand-400 transition-colors">
              {profile.nickname}
            </h3>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="glass-card rounded-2xl p-4 text-center hover:border-brand-500/30 transition-all duration-200">
          <div className="text-2xl font-bold text-brand-500">{totalDays}</div>
          <div className="text-xs text-gray-500 mt-1">累计打卡</div>
        </div>
        <div className="glass-card rounded-2xl p-4 text-center hover:border-brand-500/30 transition-all duration-200">
          <div className="text-2xl font-bold text-brand-400">{consecutiveDays}</div>
          <div className="text-xs text-gray-500 mt-1">连续打卡</div>
        </div>
        <div className="glass-card rounded-2xl p-4 text-center hover:border-brand-500/30 transition-all duration-200">
          <div className="text-2xl font-bold text-brand-300">{monthDays}</div>
          <div className="text-xs text-gray-500 mt-1">本月打卡</div>
        </div>
      </div>

      {/* Weekly Goal */}
      <div className="glass-card rounded-2xl p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-300">每周打卡目标</span>
          {editingGoal ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={goalInput}
                onChange={(e) => setGoalInput(Number(e.target.value))}
                min={1}
                max={7}
                className="w-16 bg-[#111] border border-brand-500 rounded-lg px-2 py-1 text-sm text-center text-white focus:outline-none"
                autoFocus
              />
              <button
                onClick={handleSaveGoal}
                className="text-brand-500 text-sm font-medium hover:text-brand-400 transition-colors"
              >
                确定
              </button>
            </div>
          ) : (
            <span
              className="text-brand-500 font-bold cursor-pointer hover:text-brand-400 transition-colors"
              onClick={() => {
                setGoalInput(profile.weeklyGoal);
                setEditingGoal(true);
              }}
            >
              {profile.weeklyGoal} 天/周
            </span>
          )}
        </div>
        <div className="bg-[#111] rounded-full h-2 overflow-hidden">
          <div
            className="h-2 rounded-full transition-all duration-700 ease-out animate-shimmer"
            style={{
              width: `${Math.min(100, ((consecutiveDays % 7) / profile.weeklyGoal) * 100)}%`,
            }}
          />
        </div>
      </div>

      {/* Training Frequency Chart */}
      <div className="glass-card rounded-2xl p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Icon name="chart" size={16} className="text-gray-400" />
          <h3 className="font-semibold text-sm text-white">近30天训练频率</h3>
        </div>
        {freqData.data.every((v) => v === 0) ? (
          <p className="text-gray-600 text-sm text-center py-8">暂无数据，开始打卡吧</p>
        ) : (
          <LineChart data={freqData.data} labels={freqData.labels} color="#f97316" height={120} />
        )}
      </div>

      {/* Muscle Distribution */}
      {muscleData.length > 0 && (
        <div className="glass-card rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="body" size={16} className="text-gray-400" />
            <h3 className="font-semibold text-sm text-white">肌群训练分布</h3>
          </div>
          <DonutChart segments={muscleData} size={140} />
        </div>
      )}

      {/* Body Data */}
      <div className="glass-card rounded-2xl p-4 mb-4">
        <h3 className="font-semibold mb-3 text-white">身体数据记录</h3>
        <div className="flex gap-2 mb-4">
          <input
            type="number"
            placeholder="体重(kg)"
            value={weightInput}
            onChange={(e) => setWeightInput(e.target.value)}
            className="flex-1 bg-[#111] border border-[#333] rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand-500 transition-colors"
            step="0.1"
          />
          <input
            type="number"
            placeholder="体脂率(%)"
            value={bodyFatInput}
            onChange={(e) => setBodyFatInput(e.target.value)}
            className="flex-1 bg-[#111] border border-[#333] rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand-500 transition-colors"
            step="0.1"
          />
          <button
            onClick={handleAddBodyData}
            className="bg-brand-500 text-white rounded-xl px-5 py-2 text-sm font-medium hover:bg-brand-600 transition-all duration-200 active:scale-[0.98]"
          >
            记录
          </button>
        </div>
        {profile.bodyData.length === 0 ? (
          <p className="text-gray-600 text-sm text-center py-4">暂无数据</p>
        ) : (
          <>
            <div className="space-y-1 max-h-44 overflow-y-auto mb-4">
              {[...profile.bodyData].reverse().map((d, i) => (
                <div
                  key={i}
                  className="flex justify-between text-sm py-2 px-2 border-b border-[#222] last:border-0"
                >
                  <span className="text-gray-500">{d.date}</span>
                  <span className="text-gray-300">
                    体重: {d.weight}kg
                    {d.bodyFat > 0 && (
                      <span className="ml-3 text-gray-500">体脂: {d.bodyFat}%</span>
                    )}
                  </span>
                </div>
              ))}
            </div>
            {bodyTrend.data.length >= 2 && (
              <div>
                <h4 className="text-xs text-gray-500 mb-2">体重趋势</h4>
                <LineChart data={bodyTrend.data} labels={bodyTrend.labels} color="#fb923c" height={100} />
              </div>
            )}
          </>
        )}
      </div>

      {/* Achievements */}
      <div className="glass-card rounded-2xl p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Icon name="star" size={16} className="text-gray-400" />
          <h3 className="font-semibold text-sm text-white">
            成就徽章
            <span className="text-gray-500 text-xs ml-2">
              {unlocked.length}/{unlocked.length + locked.length}
            </span>
          </h3>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {unlocked.map((a) => (
            <div
              key={a.id}
              className="bg-brand-500/10 border border-brand-500/20 rounded-xl p-3 text-center"
            >
              <div className="text-brand-500 mb-1 flex justify-center">
                <Icon name={(ACHIEVEMENT_ICONS[a.id] as IconName) || 'star'} size={22} />
              </div>
              <div className="text-xs text-brand-400 mt-1 font-medium">{a.title}</div>
            </div>
          ))}
          {locked.map((a) => (
            <div
              key={a.id}
              className="bg-[#111] border border-[#222] rounded-xl p-3 text-center opacity-40"
            >
              <div className="text-gray-700 mb-1 flex justify-center">
                <Icon name={(ACHIEVEMENT_ICONS[a.id] as import('../components/Icon').IconName) || 'circle'} size={22} />
              </div>
              <div className="text-xs text-gray-600 mt-1">??</div>
            </div>
          ))}
        </div>
      </div>

      {/* OTA Update */}
      <UpdateDialog />

      {/* Export / Import */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={handleExport}
          className="flex-1 surface-apple rounded-xl py-2.5 text-sm text-gray-400 hover:text-brand-400 transition-colors flex items-center justify-center gap-2"
        >
          <Icon name="export" size={16} />
          导出数据
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 surface-apple rounded-xl py-2.5 text-sm text-gray-400 hover:text-brand-400 transition-colors flex items-center justify-center gap-2"
        >
          <Icon name="import" size={16} />
          导入数据
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />
      </div>

      <p className="text-center text-xs text-gray-700 pb-4">
        乐乐 - 健身打卡 v26.5.5
      </p>
    </div>
  );
}
