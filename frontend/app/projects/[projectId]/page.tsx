"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowLeft, LayoutGrid, Plus } from "lucide-react";
import AuthGuard from "@/components/auth/AuthGuard";
import Modal from "@/components/ui/Modal";
import KanbanBoard from "@/components/tasks/KanbanBoard";
import { useTasks } from "@/hooks/useTasks";
import { useProjects } from "@/hooks/useProjects";
import { Task } from "@/types";

export default function ProjectBoardPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;
  const { tasksQuery, createMutation, updateMutation, updateStatusMutation, deleteMutation } =
    useTasks(projectId);
  const { projectsQuery } = useProjects();
  const project = projectsQuery.data?.find((p) => p.id === projectId);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const handleCreateTask = async (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;
    await createMutation.mutateAsync({
      title: title.trim(),
      description: description.trim() || undefined,
    });
    setTitle("");
    setDescription("");
  };

  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditDescription(task.description ?? "");
  };

  const handleEditSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!editingTask || !editTitle.trim()) return;
    await updateMutation.mutateAsync({
      id: editingTask.id,
      payload: {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
      },
    });
    setEditingTask(null);
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl items-center gap-3 px-6 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                <LayoutGrid size={16} />
              </div>
              <span className="font-bold text-slate-900">TaskFlow</span>
            </div>
            <span className="text-slate-300">/</span>
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-slate-900"
            >
              <ArrowLeft size={14} />
              Dashboard
            </Link>
            {project && (
              <>
                <span className="text-slate-300">/</span>
                <span className="text-sm font-medium text-slate-900">{project.name}</span>
              </>
            )}
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-6 py-8">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
              Project Board
            </p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              {project?.name ?? "Loading…"}
            </h1>
          </div>

          {/* New task form */}
          <form
            className="mb-8 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-end"
            onSubmit={handleCreateTask}
          >
            <div className="flex-1 space-y-1.5">
              <label className="text-xs font-medium text-slate-600" htmlFor="task-title">
                Task title
              </label>
              <input
                id="task-title"
                placeholder="What needs to be done?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                required
              />
            </div>
            <div className="flex-[2] space-y-1.5">
              <label className="text-xs font-medium text-slate-600" htmlFor="task-desc">
                Description{" "}
                <span className="font-normal text-slate-400">(optional)</span>
              </label>
              <input
                id="task-desc"
                placeholder="Add more context…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="flex shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98] disabled:opacity-60"
            >
              <Plus size={16} />
              Add Task
            </button>
          </form>

          {tasksQuery.isLoading ? (
            <div className="grid gap-5 md:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-48 animate-pulse rounded-2xl bg-slate-200" />
              ))}
            </div>
          ) : (
            <KanbanBoard
              tasks={tasksQuery.data ?? []}
              onDeleteTask={(taskId) => deleteMutation.mutate(taskId)}
              onEditTask={handleOpenEdit}
              onMoveTask={(taskId, status) =>
                updateStatusMutation.mutate({ id: taskId, status })
              }
            />
          )}
        </main>

        {/* Edit Task Modal */}
        <Modal
          isOpen={editingTask !== null}
          onClose={() => setEditingTask(null)}
          title="Edit Task"
        >
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700" htmlFor="edit-title">
                Title
              </label>
              <input
                id="edit-title"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                autoFocus
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700" htmlFor="edit-description">
                Description{" "}
                <span className="font-normal text-slate-400">(optional)</span>
              </label>
              <textarea
                id="edit-description"
                className="w-full resize-none rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                rows={3}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Add a description…"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingTask(null)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
              >
                {updateMutation.isPending ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </AuthGuard>
  );
}
