"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import AuthGuard from "@/components/auth/AuthGuard";
import ProjectCard from "@/components/dashboard/ProjectCard";
import { useAuth } from "@/context/AuthContext";
import { useDashboard } from "@/hooks/useDashboard";
import { useProjects } from "@/hooks/useProjects";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { projectsQuery, createMutation, updateMutation, deleteMutation } = useProjects();
  const dashboardQuery = useDashboard();
  const [projectName, setProjectName] = useState("");

  const handleCreateProject = async (event: FormEvent) => {
    event.preventDefault();
    if (!projectName.trim()) {
      return;
    }

    await createMutation.mutateAsync(projectName.trim());
    setProjectName("");
  };

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  const handleRename = async (id: string, currentName: string) => {
    const nextName = window.prompt("Project name", currentName);
    if (!nextName || nextName === currentName) {
      return;
    }

    await updateMutation.mutateAsync({ id, name: nextName });
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <AuthGuard>
      <main className="mx-auto min-h-screen max-w-6xl px-6 py-10">
        <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-blue-700">Workspace</p>
            <h1 className="text-4xl font-black text-slate-900">Hello, {user?.name}</h1>
            <p className="mt-2 text-slate-600">Track projects, priorities, and progress from one place.</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
          >
            Logout
          </button>
        </header>

        <section className="mt-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Projects</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {dashboardQuery.data?.projectCount ?? 0}
            </p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">To Do</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {dashboardQuery.data?.taskCounters.todo ?? 0}
            </p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">In Progress</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {dashboardQuery.data?.taskCounters.inProgress ?? 0}
            </p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Done</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {dashboardQuery.data?.taskCounters.done ?? 0}
            </p>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div>
            <form
              onSubmit={handleCreateProject}
              className="mb-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:flex-row"
            >
              <input
                className="w-full rounded-xl border border-slate-300 px-4 py-2"
                placeholder="New project name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
              <button
                type="submit"
                className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
              >
                Add Project
              </button>
            </form>

            <div className="grid gap-4 md:grid-cols-2">
              {projectsQuery.data?.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onDelete={handleDelete}
                  onRename={handleRename}
                />
              ))}
            </div>
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
            <div className="mt-4 space-y-3">
              {dashboardQuery.data?.recentActivity?.map((task) => (
                <div key={task.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <p className="text-sm font-medium text-slate-800">{task.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{task.project.name}</p>
                </div>
              ))}
              {!dashboardQuery.data?.recentActivity?.length ? (
                <p className="text-sm text-slate-500">No activity yet.</p>
              ) : null}
            </div>
          </aside>
        </section>
      </main>
    </AuthGuard>
  );
}
