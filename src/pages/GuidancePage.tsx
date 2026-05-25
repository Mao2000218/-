import { useState } from 'react';
import { createPortal } from 'react-dom';
import { exerciseGuides, categories } from '../data/exercises';
import type { ExerciseGuide } from '../types';

export default function GuidancePage() {
  const [activeCategory, setActiveCategory] = useState('全部');
  const [selectedExercise, setSelectedExercise] = useState<ExerciseGuide | null>(
    null
  );

  const filtered =
    activeCategory === '全部'
      ? exerciseGuides
      : exerciseGuides.filter((e) => e.category === activeCategory);

  return (
    <div className="pb-24 px-4 max-w-lg mx-auto">
      <h2 className="text-xl font-bold text-center py-4 text-white tracking-wide">
        健身指导
      </h2>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-all duration-200 ${
              activeCategory === cat
                ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25'
                : 'bg-[#1a1a1a] text-gray-400 border border-[#2a2a2a] hover:border-brand-500/50 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Exercise Cards */}
      <div className="space-y-3">
        {filtered.map((ex, idx) => (
          <div
            key={ex.id}
            onClick={() => setSelectedExercise(ex)}
            className="glass-card rounded-2xl p-4 cursor-pointer transition-all duration-300 active:scale-[0.98]"
            style={{ animationDelay: `${idx * 40}ms` }}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white">{ex.name}</h3>
              <span className="text-xs bg-brand-500/15 text-brand-400 px-2.5 py-0.5 rounded-full">
                {ex.category}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1.5 line-clamp-2">
              {ex.description}
            </p>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-gray-600 text-center py-12">暂无该分类的动作</p>
      )}

      {/* Detail Modal via Portal */}
      {selectedExercise &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center animate-modal-overlay"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
            onClick={() => setSelectedExercise(null)}
          >
            <div
              className="bg-[#1c1c1c]/95 backdrop-blur-xl border border-white/[0.06] rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md max-h-[80vh] overflow-y-auto p-6 animate-modal shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drag handle */}
              <div className="flex justify-center mb-3 sm:hidden">
                <div className="w-10 h-1 rounded-full bg-[#444]" />
              </div>

              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">
                  {selectedExercise.name}
                </h3>
                <span className="text-xs bg-brand-500/15 text-brand-400 px-2.5 py-1 rounded-full">
                  {selectedExercise.category}
                </span>
              </div>

              <p className="text-gray-400 text-sm mb-5 leading-relaxed">
                {selectedExercise.description}
              </p>

              <h4 className="font-semibold text-sm mb-2 text-white">动作步骤</h4>
              <ol className="list-decimal list-inside space-y-1.5 text-sm text-gray-300 mb-5">
                {selectedExercise.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>

              <h4 className="font-semibold text-sm mb-2 text-white">注意事项</h4>
              <ul className="list-disc list-inside space-y-1.5 text-sm text-brand-400">
                {selectedExercise.tips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>

              <button
                onClick={() => setSelectedExercise(null)}
                className="w-full mt-6 bg-[#111] text-gray-300 border border-[#333] rounded-xl py-2.5 font-medium hover:bg-[#222] transition-colors"
              >
                关闭
              </button>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
