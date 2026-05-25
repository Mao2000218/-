import { useMemo } from 'react';
import type { CheckIn } from '../types';
import { achievementDefs, getMuscleCounts } from '../data/achievements';

export function useAchievements(
  totalDays: number,
  consecutiveDays: number,
  checkins: CheckIn[]
) {
  const unlocked = useMemo(() => {
    const muscleCount = getMuscleCounts(checkins);
    return achievementDefs.filter((a) =>
      a.condition({ totalDays, consecutiveDays, checkins, muscleCount })
    );
  }, [totalDays, consecutiveDays, checkins]);

  const locked = achievementDefs.filter((a) => !unlocked.includes(a));

  return { unlocked, locked, all: achievementDefs };
}
