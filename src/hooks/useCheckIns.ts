import { useState, useEffect, useCallback } from 'react';
import type { CheckIn, Exercise } from '../types';

const STORAGE_KEY = 'checkins';

function loadCheckIns(): CheckIn[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveCheckIns(checkins: CheckIn[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(checkins));
}

export function useCheckIns() {
  const [checkins, setCheckins] = useState<CheckIn[]>(loadCheckIns);

  useEffect(() => {
    saveCheckIns(checkins);
  }, [checkins]);

  const getCheckInByDate = useCallback(
    (date: string) => checkins.find((c) => c.date === date),
    [checkins]
  );

  const addExercise = useCallback((date: string, exercise: Exercise) => {
    setCheckins((prev) => {
      const existing = prev.find((c) => c.date === date);
      if (existing) {
        return prev.map((c) =>
          c.date === date
            ? { ...c, exercises: [...c.exercises, exercise] }
            : c
        );
      }
      return [...prev, { date, exercises: [exercise] }];
    });
  }, []);

  const removeExercise = useCallback((date: string, index: number) => {
    setCheckins((prev) => {
      const existing = prev.find((c) => c.date === date);
      if (!existing) return prev;
      const updated = existing.exercises.filter((_, i) => i !== index);
      if (updated.length === 0) {
        return prev.filter((c) => c.date !== date);
      }
      return prev.map((c) =>
        c.date === date ? { ...c, exercises: updated } : c
      );
    });
  }, []);

  const checkedDates = checkins.map((c) => c.date);

  const totalDays = checkins.length;

  const getConsecutiveDays = useCallback(() => {
    const today = new Date();
    let consecutive = 0;
    for (let i = 0; ; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      if (checkedDates.includes(dateStr)) {
        consecutive++;
      } else if (i > 0) {
        break;
      } else {
        break;
      }
    }
    return consecutive;
  }, [checkedDates]);

  const getMonthDays = useCallback(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    return checkins.filter((c) => {
      const d = new Date(c.date);
      return d.getFullYear() === year && d.getMonth() === month;
    }).length;
  }, [checkins]);

  return {
    checkins,
    checkedDates,
    totalDays,
    getCheckInByDate,
    addExercise,
    removeExercise,
    getConsecutiveDays,
    getMonthDays,
  };
}
