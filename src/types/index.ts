export interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight: string;
}

export interface CheckIn {
  date: string;
  exercises: Exercise[];
}

export interface BodyData {
  date: string;
  weight: number;
  bodyFat: number;
}

export interface Profile {
  nickname: string;
  avatar: string;
  weeklyGoal: number;
  bodyData: BodyData[];
}

export interface ExerciseGuide {
  id: string;
  name: string;
  category: string;
  description: string;
  steps: string[];
  tips: string[];
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  exercises: Exercise[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (stats: { totalDays: number; consecutiveDays: number; checkins: CheckIn[]; muscleCount: Record<string, number> }) => boolean;
}
