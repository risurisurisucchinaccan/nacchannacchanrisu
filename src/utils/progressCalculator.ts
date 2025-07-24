import { ScheduledTask, ProgressData } from '../types';
import { SUBJECTS } from '../constants';

export const calculateProgress = (allTasks: ScheduledTask[]): ProgressData => {
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter(task => task.done).length;
  const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const subjectProgress: Record<string, { total: number; completed: number }> = {};
  
  SUBJECTS.forEach(subject => {
    subjectProgress[subject] = { total: 0, completed: 0 };
  });

  allTasks.forEach(task => {
    if (subjectProgress[task.subject]) {
      subjectProgress[task.subject].total++;
      if (task.done) {
        subjectProgress[task.subject].completed++;
      }
    }
  });

  return {
    totalTasks,
    completedTasks,
    percentage,
    subjectProgress
  };
};