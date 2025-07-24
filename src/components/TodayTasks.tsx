import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { ScheduledTask } from '../types';
import { TaskCard } from './TaskCard';
import { formatDate, isToday } from '../utils/dateUtils';

interface TodayTasksProps {
  todayTasks: ScheduledTask[];
  onToggleTask: (taskId: string) => void;
  onRescheduleTask: (taskId: string, newDate: string) => void;
}

export const TodayTasks: React.FC<TodayTasksProps> = ({ todayTasks, onToggleTask, onRescheduleTask }) => {
  const incompleteTasks = todayTasks.filter(task => !task.done);
  const completedTasks = todayTasks.filter(task => task.done);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-900">
          今日の課題 ({formatDate(new Date().toISOString().split('T')[0])})
        </h2>
      </div>

      {todayTasks.length === 0 ? (
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">今日の課題はありません</p>
        </div>
      ) : (
        <>
          {incompleteTasks.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                未完了 ({incompleteTasks.length}件)
              </h3>
              <div className="space-y-3">
                {incompleteTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggle={onToggleTask}
                    onReschedule={onRescheduleTask}
                    showReschedule={true}
                  />
                ))}
              </div>
            </div>
          )}

          {completedTasks.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                完了 ({completedTasks.length}件)
              </h3>
              <div className="space-y-3">
                {completedTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggle={onToggleTask}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};