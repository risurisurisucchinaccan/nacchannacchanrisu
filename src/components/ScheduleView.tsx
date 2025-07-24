import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { DaySchedule } from '../types';
import { TaskCard } from './TaskCard';
import { formatDate, isToday } from '../utils/dateUtils';

interface ScheduleViewProps {
  schedule: DaySchedule[];
  onToggleTask: (taskId: string) => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({ schedule, onToggleTask }) => {
  const [currentWeek, setCurrentWeek] = useState(0);
  const weeksCount = Math.ceil(schedule.length / 7);

  const getCurrentWeekSchedule = () => {
    const start = currentWeek * 7;
    const end = start + 7;
    return schedule.slice(start, end);
  };

  const weekSchedule = getCurrentWeekSchedule();

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">週間スケジュール</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentWeek(Math.max(0, currentWeek - 1))}
            disabled={currentWeek === 0}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="px-4 py-1 bg-gray-100 rounded-md text-sm font-medium">
            {currentWeek + 1} / {weeksCount}
          </span>
          <button
            onClick={() => setCurrentWeek(Math.min(weeksCount - 1, currentWeek + 1))}
            disabled={currentWeek >= weeksCount - 1}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
        {weekSchedule.map((day) => {
          const todayHighlight = isToday(day.date);
          const completedTasks = day.tasks.filter(task => task.done).length;
          const totalTasks = day.tasks.length;
          
          return (
            <div
              key={day.date}
              className={`p-4 rounded-lg border ${
                todayHighlight
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="mb-3">
                <h3 className={`font-medium ${
                  todayHighlight ? 'text-blue-900' : 'text-gray-900'
                }`}>
                  {formatDate(day.date)}
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  {completedTasks}/{totalTasks} 完了
                </p>
                {totalTasks > 0 && (
                  <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                    <div
                      className={`h-1 rounded-full ${
                        todayHighlight ? 'bg-blue-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                {day.tasks.slice(0, 3).map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggle={onToggleTask}
                  />
                ))}
                {day.tasks.length > 3 && (
                  <p className="text-xs text-gray-500 text-center">
                    他 {day.tasks.length - 3} 件
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};