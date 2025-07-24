import React from 'react';
import { Check, AlertCircle, Calendar } from 'lucide-react';
import { ScheduledTask } from '../types';

interface TaskCardProps {
  task: ScheduledTask;
  onToggle: (taskId: string) => void;
  onReschedule?: (taskId: string, newDate: string) => void;
  showReschedule?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle, onReschedule, showReschedule = false }) => {
  const handleReschedule = () => {
    if (!onReschedule) return;
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    onReschedule(task.id, tomorrowStr);
  };

  return (
    <div
      className={`p-4 rounded-lg border-l-4 transition-all duration-200 hover:shadow-md ${
        task.done
          ? 'bg-green-50 border-green-400 opacity-75'
          : 'bg-white border-gray-200 hover:border-gray-300'
      }`}
      style={{ borderLeftColor: task.done ? '#4ade80' : task.color }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="px-2 py-1 text-xs font-medium rounded-full text-white"
              style={{ backgroundColor: task.color }}
            >
              {task.subject}
            </span>
            {task.hard && (
              <AlertCircle className="w-4 h-4 text-orange-500" title="難易度高" />
            )}
          </div>
          <h3
            className={`font-medium ${
              task.done ? 'line-through text-gray-500' : 'text-gray-900'
            }`}
          >
            {task.name}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {task.type === 'daily' ? '毎日課題' : '分割課題'}
          </p>
        </div>
        <div className="ml-4 flex gap-2">
          {showReschedule && !task.done && onReschedule && (
            <button
              onClick={handleReschedule}
              className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
              title="明日に移動"
            >
              <Calendar className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => onToggle(task.id)}
            className={`p-2 rounded-full transition-colors ${
              task.done
                ? 'bg-green-100 text-green-600 hover:bg-green-200'
                : 'bg-gray-100 text-gray-400 hover:bg-green-100 hover:text-green-600'
            }`}
          >
            <Check className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};