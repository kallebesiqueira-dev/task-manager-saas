"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import {
  CheckCircle2,
  Circle,
  Clock,
  Folders,
  LayoutGrid,
  LogOut,
  Plus,
} from "lucide-react";
import AuthGuard from "@/components/auth/AuthGuard";
import Modal from "@/components/ui/Modal";
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
  const [renameModal, setRenameModal] = useState<{ id: string; name: string } | null>(null);
  const [renameName, setRenameName] = useState("");

  const handleCreateProject = async (event: FormEvent) => {
    event.preventDefault();
    if (!projectName.trim()) return;
    await createMutation.mutateAsync(projectName.trim());
    setProjectName("");
  };

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  const handleRenameOpen = (id: string, currentName: string) => {
    setRenameModal({ id, name: currentName });
    setRenameName(currentName);
  };

  const handleRenameSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!renameModal || !renameName.trim()) return;
    if (renameName.trim() !== renameModal.name) {
      await updateMutation.mutateAsync({ id: renameModal.id, name: renameName.trim() });
    }
    setRenameModal(null);
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const stats = [
    {
      label: "Projects",
      value: dashboardQuery.data?.projectCount ?? 0,
      Icon: Folders,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
    },
    {
      label: "To Do",
      value: dashboardQuery.data?.taskCounters.todo ?? 0,
      Icon: Circle,
      iconColor: "text-slate-500",
      iconBg: "bg-slate-100",
    },
    {
      label: "In Progress",
      value: dashboardQuery.data?.taskCounters.inProgress ?? 0,
      Icon: Clock,
      iconColor: "text-amber-600",
      iconBg: "bg-amber-50",
    },
    {
      label: "Done",
      value: dashboardQuery.data?.taskCounters.done ?? 0,
      Icon: CheckCircle2,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50",
    },
  ];

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-50">
        {/* Navbar */}
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                <LayoutGrid size={16} />
              </div>
              <span className="font-bold text-slate-900">TaskFlow</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                  {user?.name?.[0]?.toUpperCase() ?? "?"}
                </div>
                <span className="hidden text-sm font-medium text-slate-700 sm:block">
                  {user?.name}
                </span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <LogOut size={14} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-6 py-8">
          {/* Page heading */}
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
              Workspace
            </p>
            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Hello, {user?.name?.split(" ")[0]} 👋
            </h1>
            <p className="mt-1 text-slate-500">
              Here&apos;s an overview of your projects and tasks.
            </p>
          </div>

          {/* Stats */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map(({ label, value, Icon, iconColor, iconBg }) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div>
                  <p className="text-sm text-slate-500">{label}</p>
                  <p className="mt-1 text-3xl font-bold text-slate-900">{value}</p>
                </div>
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconBg} ${iconColor}`}
                >
                  <Icon size={22} />
                </div>
              </div>
            ))}
          </div>

          {/* Content grid */}
          <div className="grid items-start gap-6 lg:grid-cols-[1fr_300px]">
            {/* Projects section */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Projects</h2>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                  {projectsQuery.data?.length ?? 0}
                </span>
              </div>

              <form onSubmit={handleCreateProject} className="mb-5 flex gap-3">
                <input
                  className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  placeholder="New project name…"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="flex shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98] disabled:opacity-60"
                >
                  <Plus size={16} />
                  <span className="hidden sm:inline">New Project</span>
                  <span className="sm:hidden">Add</span>
                </button>
              </form>

              {projectsQuery.isLoading ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-36 animate-pulse rounded-2xl bg-slate-200" />
                  ))}
                </div>
              ) : projectsQuery.data?.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white py-16 text-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                    <Folders size={24} className="text-slate-400" />
                  </div>
                  <p className="font-medium text-slate-700">No projects yet</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Create your first project to get started
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {projectsQuery.data?.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onDelete={handleDelete}
                      onRename={handleRenameOpen}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 font-semibold text-slate-900">Recent Activity</h2>
              <div className="max-h-96 space-y-2 overflow-y-auto">
                {dashboardQuery.data?.recentActivity?.length ? (
                  dashboardQuery.data.recentActivity.map((task) => (
                    <div
                      key={task.id}
                      className="rounded-xl border border-slate-100 bg-slate-50 p-3 transition hover:border-slate-200"
                    >
                      <p className="text-sm font-medium leading-snug text-slate-800">
                        {task.title}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">{task.project.name}</p>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-sm text-slate-400">No activity yet.</p>
                    <p className="mt-1 text-xs text-slate-400">
                      Tasks will appear here as you work.
                    </p>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </main>

        {/* Rename Modal */}
        <Modal
          isOpen={renameModal !== null}
          onClose={() => setRenameModal(null)}
          title="Rename Project"
        >
          <form onSubmit={handleRenameSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700" htmlFor="rename-input">
                Project name
              </label>
              <input
                id="rename-input"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                value={renameName}
                onChange={(e) => setRenameName(e.target.value)}
                autoFocus
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRenameModal(null)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
              >
                {updateMutation.isPending ? "Saving…" : "Save"}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </AuthGuard>
  );
}
