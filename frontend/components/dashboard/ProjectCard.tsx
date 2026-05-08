"use client";

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
  onDelete: (id: string) => void;
  onRename: (id: string, currentName: string) => void;
}

const AVATAR_COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-violet-100 text-violet-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-cyan-100 text-cyan-700",
];

function getAvatarColor(name: string): string {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

export default function ProjectCard({ project, onDelete, onRename }: ProjectCardProps) {
  const taskCount = project._count?.tasks ?? 0;
  const createdAt = new Date(project.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${getAvatarColor(project.name)}`}
        >
          {project.name[0]?.toUpperCase() ?? "P"}
        </div>
        <div className="flex gap-1 opacity-0 transition group-hover:opacity-100">
          <button
            type="button"
            onClick={() => onRename(project.id, project.name)}
            title="Rename project"
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <Pencil size={14} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(project.id)}
            title="Delete project"
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <h3 className="mt-3 font-semibold leading-snug text-slate-900">{project.name}</h3>
      <div className="mt-1.5 flex items-center gap-2">
        <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
          {taskCount} {taskCount === 1 ? "task" : "tasks"}
        </span>
        <span className="text-xs text-slate-400">{createdAt}</span>
      </div>

      <div className="mt-auto pt-4">
        <Link
          href={`/projects/${project.id}`}
          className="flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 active:scale-[0.98]"
        >
          Open Board
        </Link>
      </div>
    </article>
  );
}
