import { useState } from "react";
import { Loader2, Plus, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { generateBullets, generateSummary, suggestSkills } from "@/lib/ai.functions";
import { uid, type Resume } from "@/lib/resume-types";

export type StepProps = {
  resume: Resume;
  update: (patch: Partial<Resume>) => void;
};

export function aiError(e: unknown) {
  const msg = e instanceof Error ? e.message : "Something went wrong";
  if (msg.includes("429")) return "AI is busy right now — please retry in a moment.";
  if (msg.includes("402")) return "AI credits are exhausted. Add credits to continue.";
  return msg;
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  error,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string | undefined;
  error?: string | undefined;
  type?: string | undefined;
}) {
  const [touched, setTouched] = useState(false);
  return (
    <div>
      <Label className="text-xs">{label}</Label>
      <Input
        type={type}
        className="mt-1.5"
        value={value}
        placeholder={placeholder}
        maxLength={200}
        onBlur={() => setTouched(true)}
        onChange={(e) => onChange(e.target.value)}
      />
      {touched && error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function EntryCard({ title, onRemove, children }: { title: string; onRemove: () => void; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-soft">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold">{title}</p>
        <Button variant="ghost" size="icon" aria-label="Delete entry" onClick={onRemove}>
          <Trash2 className="size-4 text-destructive" />
        </Button>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function BulletEditor({
  bullets,
  onChange,
  kind,
  title,
  context,
}: {
  bullets: string[];
  onChange: (b: string[]) => void;
  kind: "project" | "experience";
  title: string;
  context: string;
}) {
  const [loading, setLoading] = useState(false);

  const ai = async () => {
    if (!title.trim()) {
      toast.error("Add a title first so the AI has context.");
      return;
    }
    setLoading(true);
    try {
      const res = await generateBullets({ data: { kind, title, context } });
      onChange([...bullets.filter(Boolean), ...res.bullets]);
      toast.success("Bullet points added");
    } catch (e) {
      toast.error(aiError(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <Label className="text-xs">Bullet points</Label>
        <Button size="sm" variant="outline" onClick={ai} disabled={loading}>
          {loading ? <Loader2 className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5" />} AI bullets
        </Button>
      </div>
      <div className="mt-2 space-y-2">
        {bullets.map((b, i) => (
          <div key={i} className="flex gap-2">
            <Textarea
              rows={2}
              value={b}
              maxLength={400}
              onChange={(e) => onChange(bullets.map((x, j) => (j === i ? e.target.value : x)))}
            />
            <Button variant="ghost" size="icon" aria-label="Remove bullet" onClick={() => onChange(bullets.filter((_, j) => j !== i))}>
              <Trash2 className="size-4 text-destructive" />
            </Button>
          </div>
        ))}
        <Button variant="ghost" size="sm" onClick={() => onChange([...bullets, ""])}>
          <Plus className="size-4" /> Add bullet
        </Button>
      </div>
    </div>
  );
}

export function PersonalStep({ resume, update }: StepProps) {
  const p = resume.personal;
  const [loading, setLoading] = useState(false);
  const setP = (patch: Partial<typeof p>) => update({ personal: { ...p, ...patch } });

  const emailError = p.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email) ? "Enter a valid email" : undefined;

  const ai = async () => {
    if (!p.title.trim()) {
      toast.error("Add your professional title first.");
      return;
    }
    setLoading(true);
    try {
      const res = await generateSummary({
        data: {
          name: p.fullName,
          role: p.title,
          field: resume.skills.slice(0, 6).join(", "),
          highlights: [
            ...resume.education.map((e) => `${e.degree} ${e.field} at ${e.school}`),
            ...resume.experience.map((e) => `${e.role} at ${e.company}: ${e.bullets.join(" ")}`),
            ...resume.projects.map((pr) => `${pr.name}: ${pr.bullets.join(" ")}`),
          ].join("\n"),
        },
      });
      setP({ summary: res.summary });
      toast.success("Summary generated");
    } catch (e) {
      toast.error(aiError(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name *" value={p.fullName} onChange={(v) => setP({ fullName: v })} placeholder="Aisha Verma" error={!p.fullName ? "Required" : undefined} />
        <Field label="Professional title *" value={p.title} onChange={(v) => setP({ title: v })} placeholder="Frontend Developer" error={!p.title ? "Required" : undefined} />
        <Field label="Email *" type="email" value={p.email} onChange={(v) => setP({ email: v })} placeholder="you@example.com" error={!p.email ? "Required" : emailError} />
        <Field label="Phone *" value={p.phone} onChange={(v) => setP({ phone: v })} placeholder="+91 98765 43210" error={!p.phone ? "Required" : undefined} />
        <Field label="Location" value={p.location} onChange={(v) => setP({ location: v })} placeholder="Bengaluru, India" />
        <Field label="Website / Portfolio" value={p.website} onChange={(v) => setP({ website: v })} placeholder="yoursite.dev" />
        <Field label="LinkedIn" value={p.linkedin} onChange={(v) => setP({ linkedin: v })} placeholder="linkedin.com/in/you" />
      </div>
      <div>
        <div className="flex items-center justify-between">
          <Label className="text-xs">Professional summary</Label>
          <Button size="sm" variant="outline" onClick={ai} disabled={loading}>
            {loading ? <Loader2 className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5" />} AI summary
          </Button>
        </div>
        <Textarea
          rows={5}
          className="mt-2"
          maxLength={800}
          value={p.summary}
          placeholder="2–3 sentences on who you are and the value you bring."
          onChange={(e) => setP({ summary: e.target.value })}
        />
      </div>
    </div>
  );
}

export function EducationStep({ resume, update }: StepProps) {
  const list = resume.education;
  const set = (id: string, patch: Partial<(typeof list)[number]>) =>
    update({ education: list.map((e) => (e.id === id ? { ...e, ...patch } : e)) });

  return (
    <div className="space-y-4">
      {list.map((e) => (
        <EntryCard key={e.id} title={e.school || "New education"} onRemove={() => update({ education: list.filter((x) => x.id !== e.id) })}>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="School / University *" value={e.school} onChange={(v) => set(e.id, { school: v })} error={!e.school ? "Required" : undefined} />
            <Field label="Degree *" value={e.degree} onChange={(v) => set(e.id, { degree: v })} placeholder="B.Tech" error={!e.degree ? "Required" : undefined} />
            <Field label="Field of study" value={e.field} onChange={(v) => set(e.id, { field: v })} placeholder="Computer Science" />
            <Field label="Grade / GPA" value={e.grade} onChange={(v) => set(e.id, { grade: v })} placeholder="8.7 CGPA" />
            <Field label="Start" value={e.start} onChange={(v) => set(e.id, { start: v })} placeholder="2022" />
            <Field label="End" value={e.end} onChange={(v) => set(e.id, { end: v })} placeholder="2026" />
          </div>
        </EntryCard>
      ))}
      <Button
        variant="outline"
        onClick={() => update({ education: [...list, { id: uid(), school: "", degree: "", field: "", start: "", end: "", grade: "" }] })}
      >
        <Plus className="size-4" /> Add education
      </Button>
    </div>
  );
}

export function SkillsStep({ resume, update }: StepProps) {
  const [value, setValue] = useState("");
  const [field, setField] = useState("");
  const [loading, setLoading] = useState(false);

  const add = (skill: string) => {
    const s = skill.trim();
    if (!s || resume.skills.includes(s)) return;
    update({ skills: [...resume.skills, s].slice(0, 40) });
  };

  const ai = async () => {
    if (!field.trim()) {
      toast.error("Enter a career field first.");
      return;
    }
    setLoading(true);
    try {
      const res = await suggestSkills({ data: { field, existing: resume.skills } });
      update({ skills: [...resume.skills, ...res.skills.filter((s) => !resume.skills.includes(s))].slice(0, 40) });
      toast.success("Skills suggested");
    } catch (e) {
      toast.error(aiError(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        <Input
          value={value}
          maxLength={60}
          placeholder="Add a skill and press Enter"
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add(value);
              setValue("");
            }
          }}
        />
        <Button
          onClick={() => {
            add(value);
            setValue("");
          }}
        >
          <Plus className="size-4" /> Add
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {resume.skills.length === 0 && <p className="text-sm text-muted-foreground">No skills yet. Add at least five.</p>}
        {resume.skills.map((s) => (
          <Badge key={s} variant="secondary" className="gap-1 py-1.5 pl-3 pr-1.5 text-sm">
            {s}
            <button
              aria-label={`Remove ${s}`}
              className="rounded-full p-1 transition-smooth hover:bg-background"
              onClick={() => update({ skills: resume.skills.filter((x) => x !== s) })}
            >
              <Trash2 className="size-3" />
            </button>
          </Badge>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-brand-soft/60 p-4">
        <p className="text-sm font-semibold">AI skill suggestions</p>
        <p className="mt-1 text-xs text-muted-foreground">Tell us your career field and we'll suggest in-demand skills.</p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <Input value={field} maxLength={80} placeholder="e.g. Data analytics, UX design" onChange={(e) => setField(e.target.value)} />
          <Button onClick={ai} disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />} Suggest
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ProjectsStep({ resume, update }: StepProps) {
  const list = resume.projects;
  const set = (id: string, patch: Partial<(typeof list)[number]>) =>
    update({ projects: list.map((p) => (p.id === id ? { ...p, ...patch } : p)) });

  return (
    <div className="space-y-4">
      {list.map((p) => (
        <EntryCard key={p.id} title={p.name || "New project"} onRemove={() => update({ projects: list.filter((x) => x.id !== p.id) })}>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Project name *" value={p.name} onChange={(v) => set(p.id, { name: v })} error={!p.name ? "Required" : undefined} />
            <Field label="Link" value={p.link} onChange={(v) => set(p.id, { link: v })} placeholder="github.com/you/project" />
            <Field label="Tech stack" value={p.tech} onChange={(v) => set(p.id, { tech: v })} placeholder="React, Node, PostgreSQL" />
          </div>
          <BulletEditor kind="project" title={p.name} context={`${p.tech}. ${p.link}`} bullets={p.bullets} onChange={(b) => set(p.id, { bullets: b })} />
        </EntryCard>
      ))}
      <Button variant="outline" onClick={() => update({ projects: [...list, { id: uid(), name: "", link: "", tech: "", bullets: [] }] })}>
        <Plus className="size-4" /> Add project
      </Button>
    </div>
  );
}

export function ExperienceStep({ resume, update }: StepProps) {
  const list = resume.experience;
  const set = (id: string, patch: Partial<(typeof list)[number]>) =>
    update({ experience: list.map((e) => (e.id === id ? { ...e, ...patch } : e)) });

  return (
    <div className="space-y-4">
      {list.map((e) => (
        <EntryCard key={e.id} title={e.company || "New role"} onRemove={() => update({ experience: list.filter((x) => x.id !== e.id) })}>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Company *" value={e.company} onChange={(v) => set(e.id, { company: v })} error={!e.company ? "Required" : undefined} />
            <Field label="Role *" value={e.role} onChange={(v) => set(e.id, { role: v })} error={!e.role ? "Required" : undefined} />
            <Field label="Location" value={e.location} onChange={(v) => set(e.id, { location: v })} />
            <Field label="Start" value={e.start} onChange={(v) => set(e.id, { start: v })} placeholder="Jun 2025" />
            <Field label="End" value={e.end} onChange={(v) => set(e.id, { end: v })} placeholder="Present" />
          </div>
          <BulletEditor kind="experience" title={`${e.role} at ${e.company}`} context={e.location} bullets={e.bullets} onChange={(b) => set(e.id, { bullets: b })} />
        </EntryCard>
      ))}
      <Button
        variant="outline"
        onClick={() => update({ experience: [...list, { id: uid(), company: "", role: "", location: "", start: "", end: "", bullets: [] }] })}
      >
        <Plus className="size-4" /> Add experience
      </Button>
    </div>
  );
}

export function CertificationsStep({ resume, update }: StepProps) {
  const list = resume.certifications;
  const set = (id: string, patch: Partial<(typeof list)[number]>) =>
    update({ certifications: list.map((c) => (c.id === id ? { ...c, ...patch } : c)) });

  return (
    <div className="space-y-4">
      {list.map((c) => (
        <EntryCard key={c.id} title={c.name || "New certification"} onRemove={() => update({ certifications: list.filter((x) => x.id !== c.id) })}>
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Certification *" value={c.name} onChange={(v) => set(c.id, { name: v })} error={!c.name ? "Required" : undefined} />
            <Field label="Issuer" value={c.issuer} onChange={(v) => set(c.id, { issuer: v })} placeholder="Coursera" />
            <Field label="Year" value={c.year} onChange={(v) => set(c.id, { year: v })} placeholder="2025" />
          </div>
        </EntryCard>
      ))}
      <Button variant="outline" onClick={() => update({ certifications: [...list, { id: uid(), name: "", issuer: "", year: "" }] })}>
        <Plus className="size-4" /> Add certification
      </Button>
    </div>
  );
}

export function AchievementsStep({ resume, update }: StepProps) {
  const list = resume.achievements;
  const set = (id: string, patch: Partial<(typeof list)[number]>) =>
    update({ achievements: list.map((a) => (a.id === id ? { ...a, ...patch } : a)) });

  return (
    <div className="space-y-4">
      {list.map((a) => (
        <EntryCard key={a.id} title={a.title || "New achievement"} onRemove={() => update({ achievements: list.filter((x) => x.id !== a.id) })}>
          <Field label="Title *" value={a.title} onChange={(v) => set(a.id, { title: v })} error={!a.title ? "Required" : undefined} />
          <div>
            <Label className="text-xs">Detail</Label>
            <Textarea rows={2} className="mt-1.5" maxLength={300} value={a.detail} onChange={(e) => set(a.id, { detail: e.target.value })} />
          </div>
        </EntryCard>
      ))}
      <Button variant="outline" onClick={() => update({ achievements: [...list, { id: uid(), title: "", detail: "" }] })}>
        <Plus className="size-4" /> Add achievement
      </Button>
    </div>
  );
}