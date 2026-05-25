import type { WorkoutTemplate } from '../types';

export const presetTemplates: WorkoutTemplate[] = [
  {
    id: 'preset-push',
    name: '推胸日',
    exercises: [
      { name: '杠铃卧推', sets: 4, reps: 8, weight: '' },
      { name: '哑铃飞鸟', sets: 3, reps: 12, weight: '' },
      { name: '俯卧撑', sets: 3, reps: 15, weight: '自重' },
      { name: '哑铃推举', sets: 4, reps: 10, weight: '' },
    ],
  },
  {
    id: 'preset-pull',
    name: '拉背日',
    exercises: [
      { name: '引体向上', sets: 4, reps: 8, weight: '自重' },
      { name: '杠铃划船', sets: 4, reps: 10, weight: '' },
      { name: '高位下拉', sets: 3, reps: 12, weight: '' },
      { name: '杠铃弯举', sets: 3, reps: 12, weight: '' },
    ],
  },
  {
    id: 'preset-legs',
    name: '腿日',
    exercises: [
      { name: '深蹲', sets: 4, reps: 8, weight: '' },
      { name: '硬拉', sets: 3, reps: 8, weight: '' },
      { name: '哑铃箭步蹲', sets: 3, reps: 10, weight: '' },
      { name: '罗马尼亚硬拉', sets: 3, reps: 10, weight: '' },
    ],
  },
  {
    id: 'preset-full',
    name: '全身训练',
    exercises: [
      { name: '深蹲', sets: 3, reps: 10, weight: '' },
      { name: '杠铃卧推', sets: 3, reps: 10, weight: '' },
      { name: '杠铃划船', sets: 3, reps: 10, weight: '' },
      { name: '哑铃推举', sets: 3, reps: 10, weight: '' },
      { name: '平板支撑', sets: 3, reps: 1, weight: '自重' },
    ],
  },
  {
    id: 'preset-core',
    name: '核心训练',
    exercises: [
      { name: '平板支撑', sets: 3, reps: 1, weight: '自重' },
      { name: '卷腹', sets: 3, reps: 20, weight: '自重' },
    ],
  },
  {
    id: 'preset-cardio',
    name: '减脂日',
    exercises: [
      { name: '跑步', sets: 1, reps: 1, weight: '30分钟' },
      { name: '跳绳', sets: 3, reps: 1, weight: '5分钟' },
    ],
  },
];
