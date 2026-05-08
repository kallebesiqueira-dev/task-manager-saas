"use client";

import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import clsx from "clsx";
import { Task, TaskStatus } from "@/types";

interface KanbanBoardProps {
  tasks: Task[];
  onMoveTask: (taskId: string, status: TaskStatus) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
}

const STATUSES: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"];

const COLUMN_CONFIG: Record<
  TaskStatus,
  {
    label: string;
    bg: string;
    border: string;
    headerColor: string;
    badgeClass: string;
    emptyText: string;
    cardBorder: string;
  }
> = {
  TODO: {
    label: "To Do",
    bg: "bg-slate-50",
    border: "border-slate-200",
    headerColor: "text-slate-600",
    badgeClass: "bg-slate-200 text-slate-600",
    emptyText: "No tasks yet",
    cardBorder: "border-l-slate-300",
  },
  IN_PROGRESS: {
    label: "In Progress",
    bg: "bg-amber-50/40",
    border: "border-amber-200",
    headerColor: "text-amber-700",
    badgeClass: "bg-amber-100 text-amber-700",
    emptyText: "Nothing in progress",
    cardBorder: "border-l-amber-400",
  },
  DONE: {
    label: "Done",
    bg: "bg-emerald-50/40",
    border: "border-emerald-200",
    headerColor: "text-emerald-700",
    badgeClass: "bg-emerald-100 text-emerald-700",
    emptyText: "No completed tasks",
    cardBorder: "border-l-emerald-400",
  },
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function DroppableColumn({
  status,
  children,
}: {
  status: TaskStatus;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className={clsx(
        "min-h-[180px] space-y-3 rounded-xl transition-colors",
        isOver && "bg-blue-50/60"
      )}
    >
      {children}
    </div>
  );
}

function SortableTaskCard({
  task,
  onDelete,
  onEdit,
}: {
  task: Task;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id, data: { status: task.status } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const cfg = COLUMN_CONFIG[task.status];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={clsx(
        "rounded-xl border border-slate-200 bg-white p-3 shadow-sm border-l-4 transition-shadow",
        cfg.cardBorder,
        isDragging ? "opacity-50 shadow-lg ring-2 ring-blue-300" : "hover:shadow-md"
      )}
    >
      <div className="flex items-start gap-2">
        <button
          type="button"
          className="mt-0.5 shrink-0 cursor-grab touch-none text-slate-300 transition hover:text-slate-500 active:cursor-grabbing"
          {...attributes}
          {...listeners}
          aria-label="Drag task"
        >
          <GripVertical size={15} />
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium leading-snug text-slate-900">{task.title}</p>
          {task.description ? (
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">
              {task.description}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-slate-400">{formatDate(task.createdAt)}</span>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
          >
            <Pencil size={11} />
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(task.id)}
            className="flex items-center gap-1 rounded-md border border-rose-200 px-2 py-1 text-xs text-rose-600 transition hover:bg-rose-50"
          >
            <Trash2 size={11} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function KanbanBoard({
  tasks,
  onMoveTask,
  onDeleteTask,
  onEditTask,
}: KanbanBoardProps) {
  const sensors = useSensors(useSensor(PointerSensor));

  const groupedTasks: Record<TaskStatus, Task[]> = {
    TODO: tasks.filter((t) => t.status === "TODO"),
    IN_PROGRESS: tasks.filter((t) => t.status === "IN_PROGRESS"),
    DONE: tasks.filter((t) => t.status === "DONE"),
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = String(active.id);
    const overId = String(over.id);

    const destStatus = STATUSES.find((s) => s === overId);
    if (destStatus) {
      onMoveTask(taskId, destStatus);
      return;
    }

    const targetTask = tasks.find((t) => t.id === overId);
    if (targetTask) {
      onMoveTask(taskId, targetTask.status);
    }
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="grid gap-5 md:grid-cols-3">
        {STATUSES.map((status) => {
          const cfg = COLUMN_CONFIG[status];
          const columnTasks = groupedTasks[status];

          return (
            <section
              key={status}
              className={clsx("rounded-2xl border p-4", cfg.bg, cfg.border)}
            >
              <div className="mb-4 flex items-center justify-between">
                <h3
                  className={clsx(
                    "text-xs font-semibold uppercase tracking-widest",
                    cfg.headerColor
                  )}
                >
                  {cfg.label}
                </h3>
                <span
                  className={clsx(
                    "rounded-full px-2 py-0.5 text-xs font-semibold",
                    cfg.badgeClass
                  )}
                >
                  {columnTasks.length}
                </span>
              </div>

              <SortableContext
                items={columnTasks.map((t) => t.id)}
                strategy={verticalListSortingStrategy}
              >
                <DroppableColumn status={status}>
                  {columnTasks.map((task) => (
                    <SortableTaskCard
                      key={task.id}
                      task={task}
                      onDelete={onDeleteTask}
                      onEdit={onEditTask}
                    />
                  ))}
                  {columnTasks.length === 0 ? (
                    <div className="flex items-center justify-center rounded-xl border border-dashed border-slate-300 py-8">
                      <p className="text-sm text-slate-400">{cfg.emptyText}</p>
                    </div>
                  ) : null}
                </DroppableColumn>
              </SortableContext>
            </section>
          );
        })}
      </div>
    </DndContext>
  );
}
