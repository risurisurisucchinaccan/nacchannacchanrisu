import React from 'react';
import { ProgressData } from '../types';
import { SUBJECT_COLORS } from '../constants';

interface ProgressChartProps {
  progress: ProgressData;
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ progress }) => {
  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = `${(progress.percentage / 100) * circumference} ${circumference}`;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold text-gray-900 mb-6">進捗状況</h2>
      
      <div className="flex items-center justify-center mb-6">
        <div className="relative">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="45"
              stroke="#e5e7eb"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="64"
              cy="64"
              r="45"
              stroke="#4ade80"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={strokeDasharray}
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <span className="text-2xl font-bold text-gray-900">{progress.percentage}%</span>
              <p className="text-sm text-gray-600">完了</p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mb-6">
        <p className="text-sm text-gray-600">
          {progress.completedTasks} / {progress.totalTasks} タスク完了
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="font-medium text-gray-900">教科別進捗</h3>
        {Object.entries(progress.subjectProgress).map(([subject, data]) => {
          if (data.total === 0) return null;
          const percentage = Math.round((data.completed / data.total) * 100);
          return (
            <div key={subject} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: SUBJECT_COLORS[subject] }}
                  />
                  {subject}
                </span>
                <span>{percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: SUBJECT_COLORS[subject]
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};