import { Task, ScheduledTask, DaySchedule } from '../types';
import { SUMMER_START_DATE, SUMMER_END_DATE, SUBJECT_COLORS } from '../constants';
import { getDaysBetween } from './dateUtils';

export const generateSchedule = (tasks: Task[]): DaySchedule[] => {
  const totalDays = getDaysBetween(SUMMER_START_DATE, SUMMER_END_DATE);
  const schedule: DaySchedule[] = [];

  // Initialize schedule
  for (let i = 0; i < totalDays; i++) {
    const date = new Date(SUMMER_START_DATE);
    date.setDate(SUMMER_START_DATE.getDate() + i);
    schedule.push({
      date: date.toISOString().split('T')[0],
      tasks: []
    });
  }

  // Distribute tasks
  tasks.forEach(task => {
    if (task.isDaily) {
      // Daily tasks: add to every day
      schedule.forEach((day, index) => {
        const scheduledTask: ScheduledTask = {
          id: `${task.id}-${index}`,
          name: task.name,
          subject: task.subject,
          done: false,
          type: 'daily',
          hard: task.isHard,
          color: SUBJECT_COLORS[task.subject] || SUBJECT_COLORS['その他'],
          date: day.date,
          originalTaskId: task.id
        };
        day.tasks.push(scheduledTask);
      });
    } else {
      // Split tasks: distribute evenly
      const perDay = Math.floor(task.count / totalDays);
      const remainder = task.count % totalDays;
      let assignedCount = 0;

      for (let i = 0; i < totalDays && assignedCount < task.count; i++) {
        const pagesToday = perDay + (i < remainder ? 1 : 0);
        if (pagesToday > 0) {
          const scheduledTask: ScheduledTask = {
            id: `${task.id}-${i}`,
            name: `${task.name} ${pagesToday}ページ`,
            subject: task.subject,
            done: false,
            type: 'split',
            hard: task.isHard,
            color: SUBJECT_COLORS[task.subject] || SUBJECT_COLORS['その他'],
            date: schedule[i].date,
            originalTaskId: task.id
          };
          schedule[i].tasks.push(scheduledTask);
          assignedCount += pagesToday;
        }
      }
    }
  });

  return schedule;
};