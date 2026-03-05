"use client";

import Link from "next/link";
import { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
  onDelete: (id: string) => void;
  onRename: (id: string, currentName: string) => void;
}

export default function ProjectCard({ project, onDelete, onRename }: ProjectCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Project</p>
      <h3 className="mt-2 text-lg font-semibold text-slate-900">{project.name}</h3>
      <p className="mt-1 text-sm text-slate-500">{project._count?.tasks ?? 0} tasks</p>
      <div className="mt-5 flex items-center justify-between gap-3">
        <Link
          href={`/projects/${project.id}`}
          className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Open Board
        </Link>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onRename(project.id, project.name)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            Rename
          </button>
          <button
            type="button"
            onClick={() => onDelete(project.id)}
            className="rounded-lg border border-rose-300 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
