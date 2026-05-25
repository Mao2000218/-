import { useState, useCallback } from 'react';
import type { WorkoutTemplate, Exercise } from '../types';
import { presetTemplates } from '../data/templates';

const STORAGE_KEY = 'custom_templates';

function loadCustomTemplates(): WorkoutTemplate[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function useTemplates() {
  const [customTemplates, setCustomTemplates] = useState<WorkoutTemplate[]>(loadCustomTemplates);

  const allTemplates = [...presetTemplates, ...customTemplates];

  const saveCustom = (templates: WorkoutTemplate[]) => {
    setCustomTemplates(templates);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
  };

  const addTemplate = useCallback((name: string, exercises: Exercise[]) => {
    const newTemplate: WorkoutTemplate = {
      id: `custom-${Date.now()}`,
      name,
      exercises,
    };
    saveCustom([...customTemplates, newTemplate]);
  }, [customTemplates]);

  const deleteTemplate = useCallback((id: string) => {
    saveCustom(customTemplates.filter((t) => t.id !== id));
  }, [customTemplates]);

  return { templates: allTemplates, addTemplate, deleteTemplate, hasCustom: customTemplates.length > 0 };
}
