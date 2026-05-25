import { useNavigate } from 'react-router-dom';
import { useCheckIns } from '../hooks/useCheckIns';
import { useProfile } from '../hooks/useProfile';
import { exerciseGuides } from '../data/exercises';
import Icon from '../components/Icon';

const MUSCLE_RECOMMEND: Record<string, string[]> = {
  胸部: ['深蹲', '硬拉', '哑铃箭步蹲'],
  背部: ['杠铃卧推', '哑铃飞鸟', '俯卧撑'],
  腿部: ['引体向上', '杠铃划船', '高位下拉'],
  肩部: ['深蹲', '杠铃弯举', '窄距卧推'],
  手臂: ['杠铃卧推', '哑铃飞鸟', '深蹲'],
  核心: ['杠铃卧推', '深蹲', '硬拉'],
  有氧: ['深蹲', '杠铃卧推', '杠铃划船'],
};

const MUSCLE_MAP: Record<string, string> = {
  '杠铃卧推': '胸部', '哑铃飞鸟': '胸部', '俯卧撑': '胸部',
  '引体向上': '背部', '杠铃划船': '背部', '高位下拉': '背部',
  '深蹲': '腿部', '硬拉': '腿部', '哑铃箭步蹲': '腿部', '罗马尼亚硬拉': '腿部',
  '哑铃推举': '肩部', '侧平举': '肩部',
  '杠铃弯举': '手臂', '窄距卧推': '手臂',
  '平板支撑': '核心', '卷腹': '核心',
  '跑步': '有氧', '跳绳': '有氧',
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { checkins, checkedDates, totalDays, getConsecutiveDays, getMonthDays } = useCheckIns();
  const { profile } = useProfile();

  const todayStr = new Date().toISOString().split('T')[0];
  const todayChecked = checkedDates.includes(todayStr);
  const consecutiveDays = getConsecutiveDays();
  const monthDays = getMonthDays();
  const weeklyGoal = profile.weeklyGoal;

  const todayRecords = checkins.find((c) => c.date === todayStr)?.exercises ?? [];
  const weekProgress = Math.min(100, ((consecutiveDays % 7) / weeklyGoal) * 100);

  const recent = [...checkins]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  const lastChecked = checkins.find((c) => c.date < todayStr);
  let lastMuscle = '';
  if (lastChecked) {
    for (const ex of lastChecked.exercises) {
      lastMuscle = MUSCLE_MAP[ex.name] ?? '';
      if (lastMuscle) break;
    }
  }
  const recommendedNames = MUSCLE_RECOMMEND[lastMuscle] ?? ['深蹲', '杠铃卧推', '杠铃划船'];
  const recommendedExercises = exerciseGuides.filter((g) =>
    recommendedNames.includes(g.name)
  );

  return (
    <div className="pb-24 px-4 max-w-lg mx-auto">
      <h2 className="text-xl font-bold text-center py-4 text-white tracking-wide">
        你好，{profile.nickname}
      </h2>

      {/* Today Status */}
      <div className="bg-[#1a1a1a] rounded-2xl p-5 mb-4 border border-[#2a2a2a]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${todayChecked ? 'bg-brand-500/15 text-brand-500' : 'bg-[#222] text-gray-600'}`}>
              <Icon name={todayChecked ? 'check' : 'moon'} size={20} />
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-0.5">今日状态</div>
              <div className={`text-lg font-bold ${todayChecked ? 'text-brand-500' : 'text-gray-500'}`}>
                {todayChecked ? '已打卡' : '未打卡'}
              </div>
              {todayChecked && todayRecords.length > 0 && (
                <div className="text-xs text-gray-500 mt-0.5">
                  完成 {todayRecords.length} 项训练
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => navigate('/checkin')}
            className={`rounded-xl px-5 py-2.5 text-sm font-medium transition-all active:scale-[0.97] ${
              todayChecked
                ? 'bg-[#222] text-gray-400 border border-[#333] hover:border-brand-500/50'
                : 'bg-brand-500 text-white hover:bg-brand-600 shadow-lg shadow-brand-500/25'
            }`}
          >
            {todayChecked ? '查看' : '去打卡'}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] p-4 text-center">
          <div className="text-brand-500 mb-1.5 flex justify-center">
            <Icon name="calendar" size={18} />
          </div>
          <div className="text-2xl font-bold text-brand-500">{totalDays}</div>
          <div className="text-xs text-gray-500 mt-1">累计打卡</div>
        </div>
        <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] p-4 text-center">
          <div className="text-brand-400 mb-1.5 flex justify-center">
            <Icon name="fire" size={18} />
          </div>
          <div className="text-2xl font-bold text-brand-400">{consecutiveDays}</div>
          <div className="text-xs text-gray-500 mt-1">连续打卡</div>
        </div>
        <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] p-4 text-center">
          <div className="text-brand-300 mb-1.5 flex justify-center">
            <Icon name="goal" size={18} />
          </div>
          <div className="text-2xl font-bold text-brand-300">{monthDays}</div>
          <div className="text-xs text-gray-500 mt-1">本月打卡</div>
        </div>
      </div>

      {/* Weekly Progress */}
      <div className="bg-[#1a1a1a] rounded-2xl p-4 mb-4 border border-[#2a2a2a]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-300">本周进度</span>
          <span className="text-xs text-brand-400 font-medium">
            {consecutiveDays % 7} / {weeklyGoal} 天
          </span>
        </div>
        <div className="bg-[#111] rounded-full h-2.5 overflow-hidden">
          <div
            className="h-2.5 rounded-full transition-all duration-700 ease-out animate-shimmer"
            style={{ width: `${weekProgress}%` }}
          />
        </div>
      </div>

      {/* Recent Records */}
      {recent.length > 0 && (
        <div className="bg-[#1a1a1a] rounded-2xl p-4 mb-4 border border-[#2a2a2a]">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="recent" size={16} className="text-gray-400" />
            <h3 className="font-semibold text-sm text-white">最近训练</h3>
          </div>
          <div className="space-y-2">
            {recent.map((r) => (
              <div key={r.date} className="flex items-center justify-between text-sm py-2 px-2 border-b border-[#222] last:border-0">
                <span className="text-gray-400">{r.date}</span>
                <span className="text-gray-300">{r.exercises.map((e) => e.name).join('、')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Today's Recommendation */}
      {lastMuscle && recommendedExercises.length > 0 && (
        <div className="bg-[#1a1a1a] rounded-2xl p-4 mb-4 border border-[#2a2a2a]">
          <div className="flex items-center gap-2 mb-1">
            <Icon name="recommend" size={16} className="text-brand-400" />
            <h3 className="font-semibold text-sm text-white">今日推荐</h3>
          </div>
          <p className="text-xs text-gray-500 mb-3 ml-6">
            上次练了<strong className="text-brand-400">{lastMuscle}</strong>，今天试试这些动作：
          </p>
          <div className="space-y-2">
            {recommendedExercises.slice(0, 5).map((ex) => (
              <div
                key={ex.id}
                onClick={() => navigate('/guidance')}
                className="bg-[#111] border border-[#2a2a2a] rounded-xl px-4 py-2.5 flex items-center justify-between cursor-pointer hover:border-brand-500/30 transition-colors"
              >
                <span className="text-sm text-white">{ex.name}</span>
                <span className="text-xs text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-full">
                  {ex.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {recent.length === 0 && (
        <div className="text-center py-12">
          <div className="mb-4 flex justify-center">
            <Icon name="dumbbell" size={48} className="text-gray-700" />
          </div>
          <p className="text-gray-500 mb-4">准备好开始健身了吗？</p>
          <button
            onClick={() => navigate('/checkin')}
            className="bg-brand-500 text-white rounded-xl px-8 py-3 font-medium hover:bg-brand-600 transition-all active:scale-[0.97]"
          >
            开始第一次打卡
          </button>
        </div>
      )}
    </div>
  );
}
