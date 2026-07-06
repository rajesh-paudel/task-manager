import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { ref, push, onValue, update, remove } from 'firebase/database';
import { Task, UserProfile } from '../types/user';
import { Plus, Trash2, CheckCircle, Circle, AlertCircle } from 'lucide-react';

interface TaskManagerProps {
  userProfile: UserProfile;
}

export default function TaskManager({ userProfile }: TaskManagerProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  // Listen to tasks node live in Firebase
  useEffect(() => {
    const tasksRef = ref(db, 'tasks');
    
    const unsubscribe = onValue(tasksRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formattedTasks: Task[] = Object.entries(data).map(([id, value]: [string, any]) => ({
          id,
          ...value,
        }));
        
        // Filter tasks so users only see their own items (Data isolation)
        const userSpecificTasks = formattedTasks.filter(task => task.createdBy === userProfile.uid);
        // Sort newest first
        setTasks(userSpecificTasks.sort((a, b) => b.createdAt - a.createdAt));
      } else {
        setTasks([]);
      }
    });

    return () => unsubscribe();
  }, [userProfile.uid]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const tasksRef = ref(db, 'tasks');
    push(tasksRef, {
      text: input.trim(),
      completed: false,
      priority,
      createdAt: Date.now(),
      createdBy: userProfile.uid
    });

    setInput('');
    setPriority('medium');
  };

  const toggleTask = (id: string, currentStatus: boolean) => {
    update(ref(db, `tasks/${id}`), { completed: !currentStatus });
  };

  const deleteTask = (id: string) => {
    remove(ref(db, `tasks/${id}`));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Input panel Form */}
      <div className="lg:col-span-1 bg-white p-5 border border-slate-200 rounded-xl shadow-sm h-fit">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Create Assignment</h3>
        <form onSubmit={handleAddTask} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Task Title</label>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Priority Layer</label>
            <div className="grid grid-cols-3 gap-2">
              {(['low', 'medium', 'high'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`py-1.5 text-xs font-medium capitalize rounded-md border transition-all ${
                    priority === p
                      ? p === 'high' ? 'bg-rose-50 border-rose-500 text-rose-700 font-bold' :
                        p === 'medium' ? 'bg-amber-50 border-amber-500 text-amber-700 font-bold' :
                        'bg-emerald-50 border-emerald-500 text-emerald-700 font-bold'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-4 w-4" /> Add Task
          </button>
        </form>
      </div>

      {/* Task Queue View List */}
      <div className="lg:col-span-2 bg-white p-5 border border-slate-200 rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Active Workspace Queue</h3>
          <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-0.5 font-semibold rounded-full">
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
          </span>
        </div>

        <ul className="space-y-2.5">
          {tasks.map((task) => (
            <li
              key={task.id}
              className={`flex items-center justify-between p-3.5 border rounded-xl transition-all ${
                task.completed ? 'bg-slate-50/70 border-slate-100' : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3.5 flex-1 min-w-0">
                <button
                  onClick={() => toggleTask(task.id, task.completed)}
                  className={`text-slate-400 hover:text-indigo-600 transition-colors flex-shrink-0`}
                >
                  {task.completed ? (
                    <CheckCircle className="h-5 w-5 text-indigo-600 fill-indigo-50" />
                  ) : (
                    <Circle className="h-5 w-5" />
                  )}
                </button>
                <span className={`text-sm font-medium truncate ${task.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                  {task.text}
                </span>
              </div>

              <div className="flex items-center gap-3 ml-4">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                  task.priority === 'high' ? 'bg-rose-50 border-rose-200 text-rose-600' :
                  task.priority === 'medium' ? 'bg-amber-50 border-amber-200 text-amber-600' :
                  'bg-emerald-50 border-emerald-200 text-emerald-600'
                }`}>
                  {task.priority}
                </span>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
          {tasks.length === 0 && (
            <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl">
              <AlertCircle className="h-8 w-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-400">Your custom task stack is empty.</p>
            </div>
          )}
        </ul>
      </div>
    </div>
  );
}