export interface Task {
  id: string;
  name: string;
  subject: string;
  count: number;
  isDaily: boolean;
  isHard: boolean;
}

export interface ScheduledTask {
  id: string;
  name: string;
  subject: string;
  done: boolean;
  type: 'daily' | 'split';
  hard: boolean;
  color: string;
  date: string;
  originalTaskId: string;
}

export interface DaySchedule {
  date: string;
  tasks: ScheduledTask[];
}

export interface ProgressData {
  totalTasks: number;
  completedTasks: number;
  percentage: number;
  subjectProgress: Record<string, { total: number; completed: number }>;
}