import { useCallback, useEffect, useState } from "react";
import { emptyResume, sampleResume, type Resume } from "./resume-types";

const KEY = "resumecraft.resumes.v1";

export function loadResumes(): Resume[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) {
      const seeded = [sampleResume()];
      window.localStorage.setItem(KEY, JSON.stringify(seeded));
      return seeded;
    }
    const parsed = JSON.parse(raw) as Resume[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveResumes(list: Resume[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new Event("resumecraft:update"));
}

export function useResumes() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => setResumes(loadResumes());
    sync();
    setReady(true);
    window.addEventListener("resumecraft:update", sync);
    return () => window.removeEventListener("resumecraft:update", sync);
  }, []);

  const upsert = useCallback((resume: Resume) => {
    const list = loadResumes();
    const next = list.some((r) => r.id === resume.id)
      ? list.map((r) => (r.id === resume.id ? { ...resume, updatedAt: Date.now() } : r))
      : [{ ...resume, updatedAt: Date.now() }, ...list];
    saveResumes(next);
  }, []);

  const remove = useCallback((id: string) => {
    saveResumes(loadResumes().filter((r) => r.id !== id));
  }, []);

  const create = useCallback(() => {
    const resume = emptyResume(`Resume ${loadResumes().length + 1}`);
    saveResumes([resume, ...loadResumes()]);
    return resume;
  }, []);

  return { resumes, ready, upsert, remove, create };
}