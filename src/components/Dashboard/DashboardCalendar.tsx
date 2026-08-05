import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2, Plus } from "lucide-react";

import type { NewTask, Task, TaskPriority } from "../../types/task";
import { selectAllTasks } from "../../store/tasksSelectors";
import TaskModal from "./TaskModal";
import TaskDetailsModal from "./TaskDetailModal";
import { createTask, updateTask, deleteTask } from "../../api/tasks";
import { startOfDay, isOverdue } from "../../utils/dateHelpers";
import { useAppSelector } from "../../store/store";
import Sidebar from "./DashboardSidebar";
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MAX_CHIPS = 3;

const priorityDot: Record<TaskPriority, string> = {
  low: "bg-slate-400",
  medium: "bg-blue-500",
  high: "bg-violet-500",
  urgent: "bg-red-500",
};

export default function DashboardCalendar() {
  const userProfile = useAppSelector((state) => state.auth.userProfile);
  const tasksStatus = useAppSelector((state) => state.tasks.status);
  const tasks = useAppSelector(selectAllTasks);

  const [viewMonth, setViewMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultDueDate, setDefaultDueDate] = useState<number | null>(null);
  const [detailsTask, setDetailsTask] = useState<Task | null>(null);

  const goToPrevMonth = () =>
    setViewMonth(
      new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1),
    );

  const goToNextMonth = () =>
    setViewMonth(
      new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1),
    );

  const goToToday = () => {
    const now = new Date();
    setViewMonth(new Date(now.getFullYear(), now.getMonth(), 1));
  };

  const cells = useMemo(() => {
    const year = viewMonth.getFullYear();
    const month = viewMonth.getMonth();
    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevDaysInMonth = new Date(year, month, 0).getDate();

    const result: { date: Date; inMonth: boolean }[] = [];
    const totalCells = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;
    for (let i = 0; i < totalCells; i++) {
      const dayNumber = i - firstWeekday + 1;
      if (dayNumber < 1) {
        result.push({
          date: new Date(year, month - 1, prevDaysInMonth + dayNumber),
          inMonth: false,
        });
      } else if (dayNumber > daysInMonth) {
        result.push({
          date: new Date(year, month + 1, dayNumber - daysInMonth),
          inMonth: false,
        });
      } else {
        result.push({ date: new Date(year, month, dayNumber), inMonth: true });
      }
    }
    return result;
  }, [viewMonth]);

  const tasksByDay = useMemo(() => {
    const map = new Map<number, Task[]>();
    for (const task of tasks) {
      if (task.dueDate == null) continue;
      const key = startOfDay(new Date(task.dueDate)).getTime();
      const list = map.get(key);
      if (list) list.push(task);
      else map.set(key, [task]);
    }
    return map;
  }, [tasks]);

  const todayKey = startOfDay(new Date()).getTime();

  const openCreateModal = (date?: Date) => {
    setEditingTask(null);
    setDefaultDueDate(date ? startOfDay(date).getTime() : null);
    setModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleSaveTask = async (data: NewTask) => {
    if (!userProfile) return;
    if (editingTask) {
      await updateTask(userProfile.uid, editingTask, data);
    } else {
      await createTask(userProfile.uid, data);
    }
  };

  const handleEditFromDetails = () => {
    if (!detailsTask) return;
    const task = detailsTask;
    setDetailsTask(null);
    openEditModal(task);
  };

  const handleDeleteFromDetails = async () => {
    if (!detailsTask || !userProfile) return;
    await deleteTask(userProfile.uid, detailsTask.id);
  };

  const monthLabel = viewMonth.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  const loading = tasksStatus === "idle" || tasksStatus === "loading";

  return (
    <div className="max-w-6xl min-h-screen mx-auto px-6 sm:px-8 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Calendar
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Tasks organized by their due date — spot your deadlines at a glance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1">
            <button
              onClick={goToPrevMonth}
              className="h-8 w-8 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-600"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-medium text-slate-700 min-w-[120px] text-center">
              {monthLabel}
            </span>
            <button
              onClick={goToNextMonth}
              className="h-8 w-8 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-600"
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={goToToday}
            className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50"
          >
            Today
          </button>

          <button
            onClick={() => openCreateModal()}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-white bg-orange-600 hover:bg-orange-700"
          >
            <Plus className="h-4 w-4" />
            New task
          </button>
        </div>
      </div>

      {loading ? (
        <div className="mt-10 flex justify-center">
          <Loader2 className="h-5 w-5 text-orange-600 animate-spin" />
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto pb-2">
          <div className="min-w-[680px] grid grid-cols-7 gap-px bg-slate-200 rounded-xl overflow-hidden border border-slate-200">
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="bg-slate-50 py-2 text-center text-[11px] font-semibold text-slate-400 uppercase tracking-wide"
              >
                {day}
              </div>
            ))}

            {cells.map((cell) => {
              const cellKey = cell.date.getTime();
              const isToday = cellKey === todayKey;
              const dayTasks = tasksByDay.get(cellKey) ?? [];
              const visibleTasks = dayTasks.slice(0, MAX_CHIPS);

              return (
                <div
                  key={cellKey}
                  onClick={() => openCreateModal(cell.date)}
                  className={`min-h-[100px] p-1.5 cursor-pointer transition-colors ${
                    cell.inMonth
                      ? "bg-white hover:bg-slate-50"
                      : "bg-slate-50/70 hover:bg-slate-100/80"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-medium ${
                        isToday
                          ? "h-5 w-5 inline-flex items-center justify-center rounded-full bg-orange-600 text-white"
                          : cell.inMonth
                            ? "text-slate-700"
                            : "text-slate-300"
                      }`}
                    >
                      {cell.date.getDate()}
                    </span>
                  </div>

                  <div className="mt-1.5 space-y-1">
                    {visibleTasks.map((task) => {
                      const overdue = isOverdue(task);
                      const done = task.status === "done";
                      return (
                        <button
                          key={task.id}
                          title={task.title}
                          onClick={(e) => {
                            e.stopPropagation();
                            setDetailsTask(task);
                          }}
                          className={`w-full flex items-center gap-1.5 rounded px-1.5 py-1 text-left text-[11px] font-medium truncate ${
                            done
                              ? "text-slate-400 line-through hover:bg-slate-100"
                              : overdue
                                ? "bg-red-50 text-red-700 hover:bg-red-100"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full shrink-0 ${priorityDot[task.priority]}`}
                          />
                          <span className="truncate">{task.title}</span>
                        </button>
                      );
                    })}
                    {dayTasks.length > MAX_CHIPS && (
                      <p className="px-1 text-[11px] text-slate-400">
                        +{dayTasks.length - MAX_CHIPS} more
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <TaskModal
        open={modalOpen}
        onClose={closeModal}
        onSave={handleSaveTask}
        initialTask={editingTask}
        defaultDueDate={defaultDueDate}
      />
      <TaskDetailsModal
        open={detailsTask !== null}
        task={detailsTask}
        onClose={() => setDetailsTask(null)}
        onEdit={handleEditFromDetails}
        onDelete={handleDeleteFromDetails}
      />
    </div>
  );
}
