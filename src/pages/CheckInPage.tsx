import { useState } from 'react';
import { useCheckIns } from '../hooks/useCheckIns';
import { useTemplates } from '../hooks/useTemplates';
import RestTimer from '../components/RestTimer';
import Icon from '../components/Icon';
import type { Exercise } from '../types';

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

export default function CheckInPage() {
  const { checkedDates, getCheckInByDate, addExercise, removeExercise } =
    useCheckIns();
  const { templates } = useTemplates();

  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState(
    now.toISOString().split('T')[0]
  );

  const [exerciseName, setExerciseName] = useState('');
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(12);
  const [weight, setWeight] = useState('');

  const [showTemplates, setShowTemplates] = useState(false);
  const [showTimer, setShowTimer] = useState(false);

  const todayStr = now.toISOString().split('T')[0];
  const selectedStr = selectedDate;
  const currentRecords = getCheckInByDate(selectedStr)?.exercises ?? [];

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewYear(viewYear - 1);
      setViewMonth(11);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewYear(viewYear + 1);
      setViewMonth(0);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleAdd = () => {
    if (!exerciseName.trim()) return;
    addExercise(selectedStr, {
      name: exerciseName.trim(),
      sets,
      reps,
      weight: weight.trim() || '自重',
    });
    setExerciseName('');
    setWeight('');
  };

  const applyTemplate = (templateId: string) => {
    const tpl = templates.find((t) => t.id === templateId);
    if (!tpl) return;
    for (const ex of tpl.exercises) {
      addExercise(selectedStr, { ...ex, weight: ex.weight || '自重' });
    }
    setShowTemplates(false);
  };

  const isToday = (dateStr: string) => dateStr === todayStr;

  return (
    <div className="pb-24 px-4 max-w-lg mx-auto">
      <h2 className="text-xl font-bold text-center py-4 text-white tracking-wide">
        健身打卡
      </h2>

      {/* Calendar */}
      <div className="bg-[#1a1a1a] rounded-2xl p-4 mb-4 border border-[#2a2a2a]">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevMonth}
            className="text-gray-400 hover:text-white px-3 py-1 text-lg transition-colors"
          >
            ‹
          </button>
          <span className="font-semibold text-base text-white">
            {viewYear}年{viewMonth + 1}月
          </span>
          <button
            onClick={nextMonth}
            className="text-gray-400 hover:text-white px-3 py-1 text-lg transition-colors"
          >
            ›
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
          {WEEKDAYS.map((d) => (
            <div key={d} className="text-gray-600 font-medium py-1">
              {d}
            </div>
          ))}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const checked = checkedDates.includes(dateStr);
            const isSelected = dateStr === selectedStr;

            return (
              <button
                key={day}
                onClick={() => setSelectedDate(dateStr)}
                className={`py-2.5 rounded-xl text-sm transition-all duration-200 ${
                  isSelected
                    ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25 scale-105'
                    : checked
                    ? 'bg-brand-500/15 text-brand-400'
                    : 'text-gray-400 hover:bg-[#2a2a2a] hover:text-white'
                }`}
              >
                <div>{day}</div>
                {checked && <div className="text-[10px] mt-0.5">✓</div>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Add Exercise Form */}
      <div className="bg-[#1a1a1a] rounded-2xl p-4 mb-4 border border-[#2a2a2a]">
        <h3 className="font-semibold mb-3 text-white">
          {isToday(selectedStr) ? '今日打卡' : `${selectedStr} 补打卡`}
        </h3>

        {/* Template Selector */}
        <div className="mb-3">
          {showTemplates ? (
            <div className="bg-[#111] border border-[#333] rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b border-[#2a2a2a]">
                <span className="text-sm text-gray-400">选择模板</span>
                <button
                  onClick={() => setShowTemplates(false)}
                  className="text-gray-500 text-sm hover:text-gray-400"
                >
                  取消
                </button>
              </div>
              <div className="max-h-48 overflow-y-auto">
                {templates.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => applyTemplate(tpl.id)}
                    className="w-full text-left px-4 py-2.5 hover:bg-[#1a1a1a] transition-colors border-b border-[#222] last:border-0"
                  >
                    <div className="text-sm text-white font-medium">{tpl.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {tpl.exercises.map((e) => e.name).join(' / ')}
                    </div>
                  </button>
                ))}
                {templates.length === 0 && (
                  <div className="text-center py-4 text-gray-600 text-sm">暂无可用模板</div>
                )}
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowTemplates(true)}
              className="w-full border border-dashed border-[#333] rounded-xl py-2 text-sm text-gray-500 hover:border-brand-500/50 hover:text-brand-400 transition-colors"
            >
              + 使用模板快速添加
            </button>
          )}
        </div>

        <div className="space-y-3">
          <input
            type="text"
            placeholder="运动项目名称"
            value={exerciseName}
            onChange={(e) => setExerciseName(e.target.value)}
            className="w-full bg-[#111] border border-[#333] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand-500 transition-colors"
          />
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">组数</label>
              <input
                type="number"
                value={sets}
                onChange={(e) => setSets(Number(e.target.value))}
                min={1}
                className="w-full bg-[#111] border border-[#333] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">次数</label>
              <input
                type="number"
                value={reps}
                onChange={(e) => setReps(Number(e.target.value))}
                min={1}
                className="w-full bg-[#111] border border-[#333] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">重量</label>
              <input
                type="text"
                placeholder="自重"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full bg-[#111] border border-[#333] rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>
          </div>
          <button
            onClick={handleAdd}
            className="w-full bg-brand-500 text-white rounded-xl py-2.5 font-medium hover:bg-brand-600 transition-all duration-200 active:scale-[0.98]"
          >
            添加记录
          </button>
        </div>
      </div>

      {/* Daily Records */}
      <div className="bg-[#1a1a1a] rounded-2xl p-4 border border-[#2a2a2a] mb-4">
        <h3 className="font-semibold mb-3 text-white">{selectedStr} 训练记录</h3>
        {currentRecords.length === 0 ? (
          <p className="text-gray-600 text-sm text-center py-6">暂无记录</p>
        ) : (
          <div className="space-y-2">
            {currentRecords.map((ex: Exercise, idx: number) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-[#111] rounded-xl px-4 py-3 border border-[#2a2a2a] animate-slide-in"
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                <div>
                  <span className="font-medium text-sm text-white">{ex.name}</span>
                  <span className="text-gray-500 text-xs ml-2">
                    {ex.sets}组 × {ex.reps}次 {ex.weight}
                  </span>
                </div>
                <button
                  onClick={() => removeExercise(selectedStr, idx)}
                  className="text-gray-600 hover:text-red-400 text-sm transition-colors"
                >
                  删除
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rest Timer */}
      <div className="mb-4">
        {showTimer ? (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">休息计时器</span>
              <button
                onClick={() => setShowTimer(false)}
                className="text-xs text-gray-500 hover:text-gray-400"
              >
                收起
              </button>
            </div>
            <RestTimer />
          </div>
        ) : (
          <button
            onClick={() => setShowTimer(true)}
            className="w-full border border-dashed border-[#333] rounded-xl py-2.5 text-sm text-gray-500 hover:border-brand-500/50 hover:text-brand-400 transition-colors"
          >
            <span className="flex items-center justify-center gap-2">
              <Icon name="clock" size={16} />
              组间休息计时器
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
