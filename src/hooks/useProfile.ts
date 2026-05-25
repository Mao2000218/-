import { useState, useEffect } from 'react';
import type { Profile } from '../types';

const STORAGE_KEY = 'fitness_profile';

const defaultProfile: Profile = {
  nickname: '健身达人',
  avatar: 'circle',
  weeklyGoal: 4,
  bodyData: [],
};

function loadProfile(): Profile {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? { ...defaultProfile, ...JSON.parse(data) } : defaultProfile;
  } catch {
    return defaultProfile;
  }
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile>(loadProfile);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  const updateProfile = (updates: Partial<Profile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const addBodyData = (weight: number, bodyFat: number) => {
    const date = new Date().toISOString().split('T')[0];
    setProfile((prev) => ({
      ...prev,
      bodyData: [...prev.bodyData, { date, weight, bodyFat }],
    }));
  };

  return { profile, updateProfile, addBodyData };
}
