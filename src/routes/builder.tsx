import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { ArrowLeft, ArrowRight, BarChart3, Download, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ResumePreview, TEMPLATES } from "@/components/resume/ResumePreview";
import {
  AchievementsStep,
  CertificationsStep,
  EducationStep,
  ExperienceStep,
  PersonalStep,
  ProjectsStep,
  SkillsStep,
  aiError,
} from "@/components/resume/BuilderSteps";
import { completion, emptyResume, type Resume, type TemplateId } from "@/lib/resume-types";
import { loadResumes, useResumes } from "@/lib/resume-storage";
import { scoreResume } from "@/lib/ai.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/builder")({
  validateSearch: z.object({ id: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "AI Resume Builder — ResumeCraft AI" },
      { name: "description", content: "Fill a guided multi-step form, generate AI summaries and bullet points, and watch your resume update live in five templates." },
      { property: "og:title", content: "AI Resume Builder — ResumeCraft AI" },
      { property: "og:description", content: "Guided multi-step resume builder with live preview and AI assistance." },
    ],
  }),
  component: BuilderPage,
});

const STEPS = [
  { key: "personal", label: "Personal", Comp: PersonalStep },
  { key: "education", label: "Education", Comp: EducationStep },
  { key: "skills", label: "Skills", Comp: SkillsStep },
  { key: "projects", label: "Projects", Comp: ProjectsStep },
  { key: "experience", label: "Experience", Comp: ExperienceStep },
  { key: "certifications", label: "Certifications", Comp: CertificationsStep },
  { key: "achievements", label: "Achievements", Comp: AchievementsStep },
] as const;

type Score = { score: number; strengths: string[]; improvements: string[] };

function resumeToText(r: Resume) {
  return [
    `${r.personal.fullName} — ${r.personal.title}`,
    `${r.personal.email} ${r.personal.phone} ${r.personal.location}`,
    `SUMMARY: ${r.personal.summary}`,
    `SKILLS: ${r.skills.join(", ")}`,
    `EDUCATION: ${r.education.map((e) => `${e.degree} ${e.field}, ${e.school} (${e.start}-${e.end}) ${e.grade}`).join(" | ")}`,
    `EXPERIENCE: ${r.experience.map((e) => `${e.role} at ${e.company} (${e.start}-${e.end}): ${e.bullets.join("; ")}`).join(" | ")}`,
    `PROJECTS: ${r.projects.map((p) => `${p.name} [${p.tech}]: ${p.bullets.join("; ")}`).join(" | ")}`,
    `CERTIFICATIONS: ${r.certifications.map((c) => `${c.name} ${c.issuer} ${c.year}`).join(" | ")}`,
    `ACHIEVEMENTS: ${r.achievements.map((a) => `${a.title}: ${a.detail}`).join(" | ")}`,
  ].join("\n");
}

function BuilderPage() {
  const { id } = Route.useSearch();
  const navigate = useNavigate();
  const { upsert } = useResumes();
  const [resume, setResume] = useState<Resume>(() => emptyResume("My resume"));
  const [step, setStep] = useState(0);
  const [score, setScore] = useState<Score | null>(null);
  const [scoring, setScoring] = useState(false);

  useEffect(() => {
    const existing = id ? loadResumes().find((r) => r.id === id) : undefined;
    if (existing) setResume(existing);
  }, [id]);

  const update = (patch: Partial<Resume>) => setResume((r) => ({ ...r, ...patch }));
  const percent = useMemo(() => completion(resume), [resume]);
  const Current = STEPS[step]!.Comp;

  const save = () => {
    if (!resume.personal.fullName.trim() || !resume.personal.email.trim()) {
      toast.error("Add at least your name and email before saving.");
      return;
    }
    upsert(resume);
    navigate({ to: "/builder", search: { id: resume.id } });
    toast.success("Resume saved to this browser");
  };

  const runScore = async () => {
    setScoring(true);
    try {
      setScore(await scoreResume({ data: { resume: resumeToText(resume).slice(0, 12000) } }));
    } catch (e) {
      toast.error(aiError(e));
    } finally {
      setScoring(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="no-print flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Resume builder</h1>
          <p className="mt-1 text-sm text-muted-foreground">Everything saves to your browser — no account needed.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={runScore} disabled={scoring}>
            {scoring ? <Loader2 className="size-4 animate-spin" /> : <BarChart3 className="size-4" />} Score resume
          </Button>
          <Button variant="outline" onClick={() => window.print()}>
            <Download className="size-4" /> Download PDF
          </Button>
          <Button onClick={save}>
            <Save className="size-4" /> Save
          </Button>
        </div>
      </div>

      <div className="no-print mt-6 rounded-xl border border-border bg-card p-4 shadow-soft">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Completion</span>
          <span className="text-muted-foreground">{percent}%</span>
        </div>
        <Progress value={percent} className="mt-2" />
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_minmax(0,44%)]">
        <div className="no-print">
          <div className="flex flex-wrap gap-2">
            {STEPS.map((s, i) => (
              <button
                key={s.key}
                onClick={() => setStep(i)}
                className={cn(
                  "rounded-full border border-border px-3.5 py-1.5 text-xs font-medium transition-smooth hover:shadow-soft",
                  i === step ? "border-primary bg-primary text-primary-foreground" : "bg-card text-muted-foreground",
                )}
              >
                {i + 1}. {s.label}
              </button>
            ))}
          </div>

          <Card className="mt-4">
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold">{STEPS[step]!.label}</h2>
              <div className="mt-5">
                <Current resume={resume} update={update} />
              </div>
              <div className="mt-8 flex justify-between">
                <Button variant="outline" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
                  <ArrowLeft className="size-4" /> Back
                </Button>
                <Button disabled={step === STEPS.length - 1} onClick={() => setStep((s) => s + 1)}>
                  Next <ArrowRight className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {score && (
            <Card className="mt-5">
              <CardContent className="pt-6">
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-4xl font-bold text-primary">{score.score}</span>
                  <span className="text-sm text-muted-foreground">/ 100 resume score</span>
                </div>
                {score.strengths.length > 0 && (
                  <>
                    <h3 className="mt-5 text-sm font-semibold">Strengths</h3>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                      {score.strengths.map((s) => <li key={s}>{s}</li>)}
                    </ul>
                  </>
                )}
                {score.improvements.length > 0 && (
                  <>
                    <h3 className="mt-5 text-sm font-semibold">Improve next</h3>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                      {score.improvements.map((s) => <li key={s}>{s}</li>)}
                    </ul>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="no-print mb-4 space-y-3 rounded-xl border border-border bg-card p-4 shadow-soft">
            <div>
              <Label className="text-xs">Resume name</Label>
              <Input className="mt-1.5" value={resume.name} maxLength={80} onChange={(e) => update({ name: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs">Template</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => update({ template: t.id as TemplateId })}
                    className={cn(
                      "rounded-full border border-border px-3 py-1.5 text-xs transition-smooth",
                      resume.template === t.id ? "border-primary bg-brand-soft text-primary" : "bg-card text-muted-foreground",
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <Button asChild variant="ghost" size="sm" className="w-full">
              <Link to="/dashboard">Go to dashboard</Link>
            </Button>
          </div>
          <ResumePreview resume={resume} />
        </div>
      </div>
    </div>
  );
}