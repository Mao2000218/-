import type { Achievement } from '../types';

const MUSCLE_EXERCISE_MAP: Record<string, string[]> = {
  胸部: ['杠铃卧推', '哑铃飞鸟', '俯卧撑'],
  背部: ['引体向上', '杠铃划船', '高位下拉'],
  腿部: ['深蹲', '硬拉', '哑铃箭步蹲', '罗马尼亚硬拉'],
  肩部: ['哑铃推举', '侧平举'],
  手臂: ['杠铃弯举', '窄距卧推'],
  核心: ['平板支撑', '卷腹'],
  有氧: ['跑步', '跳绳'],
};

export const achievementDefs: Achievement[] = [
  {
    id: 'first-checkin',
    title: '开始健身',
    description: '完成第一次打卡',
    icon: 'target',
    condition: (s) => s.totalDays >= 1,
  },
  {
    id: 'streak-7',
    title: '一周坚持',
    description: '连续打卡 7 天',
    icon: 'fire',
    condition: (s) => s.consecutiveDays >= 7,
  },
  {
    id: 'streak-30',
    title: '月度全勤',
    description: '连续打卡 30 天',
    icon: 'diamond',
    condition: (s) => s.consecutiveDays >= 30,
  },
  {
    id: 'total-30',
    title: '三十天里程碑',
    description: '累计打卡 30 天',
    icon: 'star',
    condition: (s) => s.totalDays >= 30,
  },
  {
    id: 'total-100',
    title: '百炼成钢',
    description: '累计打卡 100 天',
    icon: 'trophy',
    condition: (s) => s.totalDays >= 100,
  },
  {
    id: 'total-365',
    title: '年度健身达人',
    description: '累计打卡 365 天',
    icon: 'crown',
    condition: (s) => s.totalDays >= 365,
  },
  {
    id: 'chest-master',
    title: '胸部大师',
    description: '累计 10 次胸部训练',
    icon: 'hexagon',
    condition: (s) => (s.muscleCount['胸部'] ?? 0) >= 10,
  },
  {
    id: 'back-master',
    title: '背部大师',
    description: '累计 10 次背部训练',
    icon: 'triangle',
    condition: (s) => (s.muscleCount['背部'] ?? 0) >= 10,
  },
  {
    id: 'leg-master',
    title: '腿部大师',
    description: '累计 10 次腿部训练',
    icon: 'circle',
    condition: (s) => (s.muscleCount['腿部'] ?? 0) >= 10,
  },
  {
    id: 'all-round',
    title: '全面发展',
    description: '所有肌群都训练过',
    icon: 'star',
    condition: (s) => {
      const groups = ['胸部', '背部', '腿部', '肩部', '手臂', '核心'];
      return groups.every((g) => (s.muscleCount[g] ?? 0) > 0);
    },
  },
];

export function getMuscleCounts(checkins: { exercises: { name: string }[] }[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const ci of checkins) {
    for (const ex of ci.exercises) {
      for (const [muscle, exerciseNames] of Object.entries(MUSCLE_EXERCISE_MAP)) {
        if (exerciseNames.includes(ex.name)) {
          counts[muscle] = (counts[muscle] ?? 0) + 1;
          break;
        }
      }
    }
  }
  return counts;
}
