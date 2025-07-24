import React, { useState, useEffect, useMemo } from 'react';
import { BookOpen, Target, Calendar, Plus } from 'lucide-react';
import { Task, ScheduledTask, DaySchedule } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { generateSchedule } from './utils/scheduleGenerator';
import { calculateProgress } from './utils/progressCalculator';
import { isToday } from './utils/dateUtils';
import { AddTaskForm } from './components/AddTaskForm';
import { TodayTasks } from './components/TodayTasks';
import { ProgressChart } from './components/ProgressChart';
import { ScheduleView } from './components/ScheduleView';

function App() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('summer-tasks', []);
  const [scheduledTasks, setScheduledTasks] = useLocalStorage<ScheduledTask[]>('scheduled-tasks', []);
  const [activeTab, setActiveTab] = useState<'today' | 'schedule' | 'progress' | 'tasks'>('today');

  // Generate schedule when tasks change
  useEffect(() => {
    if (tasks.length > 0) {
      const schedule = generateSchedule(tasks);
      const allScheduledTasks = schedule.flatMap(day => day.tasks);
      
      // Preserve completion status from existing scheduled tasks
      const updatedTasks = allScheduledTasks.map(newTask => {
        const existingTask = scheduledTasks.find(t => t.id === newTask.id);
        return existingTask ? { ...newTask, done: existingTask.done } : newTask;
      });
      
      setScheduledTasks(updatedTasks);
    }
  }, [tasks]);

  const schedule: DaySchedule[] = useMemo(() => {
    const scheduleMap = new Map<string, ScheduledTask[]>();
    
    scheduledTasks.forEach(task => {
      if (!scheduleMap.has(task.date)) {
        scheduleMap.set(task.date, []);
      }
      scheduleMap.get(task.date)!.push(task);
    });

    return Array.from(scheduleMap.entries()).map(([date, tasks]) => ({
      date,
      tasks: tasks.sort((a, b) => a.name.localeCompare(b.name))
    })).sort((a, b) => a.date.localeCompare(b.date));
  }, [scheduledTasks]);

  const todayTasks = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return scheduledTasks.filter(task => task.date === today);
  }, [scheduledTasks]);

  const progress = useMemo(() => {
    return calculateProgress(scheduledTasks);
  }, [scheduledTasks]);

  const addTask = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString()
    };
    setTasks([...tasks, newTask]);
  };

  const toggleTask = (taskId: string) => {
    setScheduledTasks(prev => 
      prev.map(task => 
        task.id === taskId 
          ? { ...task, done: !task.done }
          : task
      )
    );
  };

  const rescheduleTask = (taskId: string, newDate: string) => {
    setScheduledTasks(prev => 
      prev.map(task => 
        task.id === taskId 
          ? { ...task, date: newDate }
          : task
      )
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const tabs = [
    { id: 'today', label: '今日', icon: Calendar },
    { id: 'schedule', label: 'スケジュール', icon: BookOpen },
    { id: 'progress', label: '進捗', icon: Target },
    { id: 'tasks', label: '課題管理', icon: Plus },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-8 h-8 text-blue-600" />
              夏休み課題管理
            </h1>
            <div className="text-sm text-gray-600">
              2025年7月22日 - 8月31日
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'today' && (
          <TodayTasks
            todayTasks={todayTasks}
            onToggleTask={toggleTask}
            onRescheduleTask={rescheduleTask}
          />
        )}

        {activeTab === 'schedule' && (
          <ScheduleView
            schedule={schedule}
            onToggleTask={toggleTask}
          />
        )}

        {activeTab === 'progress' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ProgressChart progress={progress} />
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">統計情報</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                  <span className="font-medium">総課題数</span>
                  <span className="text-2xl font-bold text-blue-600">{tasks.length}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                  <span className="font-medium">完了率</span>
                  <span className="text-2xl font-bold text-green-600">{progress.percentage}%</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg">
                  <span className="font-medium">今日のタスク</span>
                  <span className="text-2xl font-bold text-orange-600">{todayTasks.length}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <AddTaskForm onAddTask={addTask} />
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">課題一覧</h2>
              {tasks.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">課題が登録されていません</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tasks.map(task => (
                    <div
                      key={task.id}
                      className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{task.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {task.subject} • {task.isDaily ? '毎日課題' : `${task.count}ページ`}
                          </p>
                          {task.isHard && (
                            <span className="inline-block mt-2 px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
                              高難易度
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="ml-2 text-red-600 hover:text-red-800 text-sm"
                        >
                          削除
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;