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
      <div className="flex items-center justify-center relative py-4">
        <h2 className="text-xl font-bold text-white tracking-wide">
          你好，{profile.nickname}
        </h2>
        <button
          onClick={() => navigate('/settings')}
          className="absolute right-0 p-2 text-gray-500 hover:text-gray-300 transition-colors"
        >
          <Icon name="settings" size={20} />
        </button>
      </div>

      {/* Today Status — glass card */}
      <div className="glass-card rounded-2xl p-5 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${
                todayChecked
                  ? 'bg-brand-500/15 text-brand-500'
                  : 'bg-white/5 text-gray-500'
              }`}
            >
              <Icon name={todayChecked ? 'check' : 'moon'} size={20} />
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-0.5">今日状态</div>
              <div className={`text-lg font-bold ${todayChecked ? 'text-brand-500' : 'text-gray-400'}`}>
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
            className={`rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-300 active:scale-[0.96] ${
              todayChecked
                ? 'bg-white/5 text-gray-400 border border-white/10 hover:border-brand-500/30'
                : 'btn-apple'
            }`}
          >
            {todayChecked ? '查看' : '去打卡'}
          </button>
        </div>
      </div>

      {/* Stats Grid — glass cards */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { icon: 'calendar' as const, value: totalDays, label: '累计打卡', color: 'text-brand-500' },
          { icon: 'fire' as const, value: consecutiveDays, label: '连续打卡', color: 'text-brand-400' },
          { icon: 'goal' as const, value: monthDays, label: '本月打卡', color: 'text-brand-300' },
        ].map((stat) => (
          <div key={stat.label} className="glass-card rounded-2xl p-4 text-center">
            <div className={`${stat.color} mb-1.5 flex justify-center`}>
              <Icon name={stat.icon} size={18} />
            </div>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-[10px] text-gray-600 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Weekly Progress — glass card */}
      <div className="glass-card rounded-2xl p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-300">本周进度</span>
          <span className="text-xs text-brand-400 font-medium">
            {consecutiveDays % 7} / {weeklyGoal} 天
          </span>
        </div>
        <div className="bg-white/5 rounded-full h-2.5 overflow-hidden">
          <div
            className="h-2.5 rounded-full transition-all duration-700 ease-out animate-shimmer"
            style={{ width: `${weekProgress}%` }}
          />
        </div>
      </div>

      {/* Recent Records — glass card */}
      {recent.length > 0 && (
        <div className="glass-card rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="recent" size={16} className="text-gray-400" />
            <h3 className="font-semibold text-sm text-white">最近训练</h3>
          </div>
          <div className="space-y-1">
            {recent.map((r) => (
              <div key={r.date} className="flex items-center justify-between text-sm py-2 px-2 border-b border-white/5 last:border-0">
                <span className="text-gray-500 text-xs">{r.date}</span>
                <span className="text-gray-300 text-xs">{r.exercises.map((e) => e.name).join('、')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Today's Recommendation — glass card */}
      {lastMuscle && recommendedExercises.length > 0 && (
        <div className="glass-card rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <Icon name="recommend" size={16} className="text-brand-400" />
            <h3 className="font-semibold text-sm text-white">今日推荐</h3>
          </div>
          <p className="text-xs text-gray-500 mb-3 ml-6">
            上次练了<strong className="text-brand-400">{lastMuscle}</strong>，今天试试这些：
          </p>
          <div className="space-y-2">
            {recommendedExercises.slice(0, 5).map((ex) => (
              <div
                key={ex.id}
                onClick={() => navigate('/guidance')}
                className="surface-apple rounded-xl px-4 py-2.5 flex items-center justify-between cursor-pointer"
              >
                <span className="text-sm text-white">{ex.name}</span>
                <span className="text-[10px] text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-full">
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
            className="btn-apple text-base px-8 py-3"
          >
            开始第一次打卡
          </button>
        </div>
      )}
    </div>
  );
}
