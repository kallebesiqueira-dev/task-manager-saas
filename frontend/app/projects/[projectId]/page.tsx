"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { FormEvent, useState } from "react";
import AuthGuard from "@/components/auth/AuthGuard";
import KanbanBoard from "@/components/tasks/KanbanBoard";
import { useTasks } from "@/hooks/useTasks";
import { Task } from "@/types";

export default function ProjectBoardPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;
  const { tasksQuery, createMutation, updateMutation, updateStatusMutation, deleteMutation } =
    useTasks(projectId);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleCreateTask = async (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim()) {
      return;
    }

    await createMutation.mutateAsync({
      title: title.trim(),
      description: description.trim() || undefined,
    });

    setTitle("");
    setDescription("");
  };

  const handleEditTask = async (task: Task) => {
    const nextTitle = window.prompt("Task title", task.title);
    if (!nextTitle) {
      return;
    }

    const nextDescription = window.prompt("Task description", task.description ?? "") ?? "";
    await updateMutation.mutateAsync({
      id: task.id,
      payload: { title: nextTitle, description: nextDescription },
    });
  };

  return (
    <AuthGuard>
      <main className="mx-auto min-h-screen max-w-7xl px-6 py-10">
        <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Link href="/dashboard" className="text-sm text-blue-700 hover:underline">
              Back to Dashboard
            </Link>
            <h1 className="mt-2 text-3xl font-black text-slate-900">Project Board</h1>
          </div>
        </header>

        <form
          className="mb-6 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-[1fr_2fr_auto]"
          onSubmit={handleCreateTask}
        >
          <input
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-xl border border-slate-300 px-3 py-2"
          />
          <input
            placeholder="Task description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="rounded-xl border border-slate-300 px-3 py-2"
          />
          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
          >
            Add Task
          </button>
        </form>

        <KanbanBoard
          tasks={tasksQuery.data ?? []}
          onDeleteTask={(taskId) => deleteMutation.mutate(taskId)}
          onEditTask={handleEditTask}
          onMoveTask={(taskId, status) => updateStatusMutation.mutate({ id: taskId, status })}
        />
      </main>
    </AuthGuard>
  );
}
