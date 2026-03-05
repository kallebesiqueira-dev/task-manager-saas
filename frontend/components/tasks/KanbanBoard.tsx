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
import clsx from "clsx";
import { Task, TaskStatus } from "@/types";

interface KanbanBoardProps {
  tasks: Task[];
  onMoveTask: (taskId: string, status: TaskStatus) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
}

const COLUMNS: Array<{ title: string; status: TaskStatus }> = [
  { title: "To Do", status: "TODO" },
  { title: "In Progress", status: "IN_PROGRESS" },
  { title: "Done", status: "DONE" },
];

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
        "min-h-[180px] space-y-3 rounded-xl transition",
        isOver && "bg-blue-50/70"
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={clsx(
        "rounded-xl border border-slate-200 bg-white p-3 shadow-sm",
        isDragging && "opacity-70"
      )}
    >
      <button
        type="button"
        className="w-full cursor-grab text-left active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <p className="font-medium text-slate-900">{task.title}</p>
        <p className="mt-1 text-sm text-slate-500">{task.description || "No description"}</p>
      </button>
      <div className="mt-3 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => onEdit(task)}
          className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(task.id)}
          className="rounded-md border border-rose-300 px-2 py-1 text-xs text-rose-600"
        >
          Delete
        </button>
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
    TODO: tasks.filter((task) => task.status === "TODO"),
    IN_PROGRESS: tasks.filter((task) => task.status === "IN_PROGRESS"),
    DONE: tasks.filter((task) => task.status === "DONE"),
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) {
      return;
    }

    const taskId = String(active.id);
    const overId = String(over.id);

    const destination = COLUMNS.find((column) => column.status === overId)?.status;
    if (destination) {
      onMoveTask(taskId, destination);
      return;
    }

    const targetTask = tasks.find((task) => task.id === overId);
    if (targetTask) {
      onMoveTask(taskId, targetTask.status);
    }
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="grid gap-4 md:grid-cols-3">
        {COLUMNS.map((column) => (
          <section
            key={column.status}
            id={column.status}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
          >
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              {column.title}
            </h3>
            <SortableContext
              items={groupedTasks[column.status].map((task) => task.id)}
              strategy={verticalListSortingStrategy}
            >
              <DroppableColumn status={column.status}>
                {groupedTasks[column.status].map((task) => (
                  <SortableTaskCard
                    key={task.id}
                    task={task}
                    onDelete={onDeleteTask}
                    onEdit={onEditTask}
                  />
                ))}
                {groupedTasks[column.status].length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-400">
                    No tasks here yet
                  </div>
                ) : null}
              </DroppableColumn>
            </SortableContext>
          </section>
        ))}
      </div>
    </DndContext>
  );
}
