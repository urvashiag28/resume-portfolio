import type { Resume, TemplateId } from "@/lib/resume-types";
import { cn } from "@/lib/utils";

export const TEMPLATES: { id: TemplateId; label: string; blurb: string }[] = [
  { id: "modern", label: "Modern", blurb: "Bold header band, ideal for tech and product roles." },
  { id: "minimalist", label: "Minimalist", blurb: "Quiet typography, maximum whitespace, ATS-safe." },
  { id: "corporate", label: "Corporate", blurb: "Serif headings and a formal two-column body." },
  { id: "creative", label: "Creative", blurb: "Accent sidebar for design and marketing folks." },
  { id: "student", label: "Student", blurb: "Education-first layout for internships and campus roles." },
];

function Contact({ resume }: { resume: Resume }) {
  const parts = [
    resume.personal.email,
    resume.personal.phone,
    resume.personal.location,
    resume.personal.website,
    resume.personal.linkedin,
  ].filter(Boolean);
  return <p className="text-[11px] leading-relaxed opacity-80">{parts.join("  ·  ")}</p>;
}

function Section({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("mt-4", className)}>
      <h3 className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">{title}</h3>
      <div className="space-y-2 text-[11.5px] leading-relaxed">{children}</div>
    </section>
  );
}

function Body({ resume, compact = false }: { resume: Resume; compact?: boolean }) {
  return (
    <>
      {resume.personal.summary && (
        <Section title="Summary">
          <p>{resume.personal.summary}</p>
        </Section>
      )}
      {resume.experience.length > 0 && (
        <Section title="Experience">
          {resume.experience.map((e) => (
            <div key={e.id}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                <p className="font-semibold">
                  {e.role || "Role"} {e.company ? `· ${e.company}` : ""}
                </p>
                <p className="text-[10.5px] opacity-70">
                  {[e.start, e.end].filter(Boolean).join(" – ")} {e.location ? `· ${e.location}` : ""}
                </p>
              </div>
              <ul className="ml-4 list-disc">
                {e.bullets.filter(Boolean).map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </Section>
      )}
      {resume.projects.length > 0 && (
        <Section title="Projects">
          {resume.projects.map((p) => (
            <div key={p.id}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                <p className="font-semibold">{p.name || "Project"}</p>
                <p className="text-[10.5px] opacity-70">{p.tech}</p>
              </div>
              {p.link && <p className="text-[10.5px] opacity-70">{p.link}</p>}
              <ul className="ml-4 list-disc">
                {p.bullets.filter(Boolean).map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </Section>
      )}
      {!compact && resume.education.length > 0 && (
        <Section title="Education">
          {resume.education.map((ed) => (
            <div key={ed.id} className="flex flex-wrap items-baseline justify-between gap-x-2">
              <p className="font-semibold">
                {ed.degree} {ed.field ? `in ${ed.field}` : ""} — {ed.school}
              </p>
              <p className="text-[10.5px] opacity-70">
                {[ed.start, ed.end].filter(Boolean).join(" – ")} {ed.grade ? `· ${ed.grade}` : ""}
              </p>
            </div>
          ))}
        </Section>
      )}
      {!compact && resume.skills.length > 0 && (
        <Section title="Skills">
          <p>{resume.skills.join(" · ")}</p>
        </Section>
      )}
      {resume.certifications.length > 0 && (
        <Section title="Certifications">
          {resume.certifications.map((c) => (
            <p key={c.id}>
              {c.name} {c.issuer ? `— ${c.issuer}` : ""} {c.year ? `(${c.year})` : ""}
            </p>
          ))}
        </Section>
      )}
      {resume.achievements.length > 0 && (
        <Section title="Achievements">
          {resume.achievements.map((a) => (
            <p key={a.id}>
              <span className="font-semibold">{a.title}</span>
              {a.detail ? ` — ${a.detail}` : ""}
            </p>
          ))}
        </Section>
      )}
    </>
  );
}

export function ResumePreview({ resume, className }: { resume: Resume; className?: string }) {
  const name = resume.personal.fullName || "Your Name";
  const title = resume.personal.title || "Your professional title";
  const t = resume.template;

  return (
    <div
      className={cn(
        "print-sheet mx-auto w-full max-w-[760px] overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-soft",
        className,
      )}
    >
      {t === "modern" && (
        <div>
          <header className="bg-hero-gradient px-8 py-7 text-primary-foreground">
            <h2 className="text-2xl font-bold">{name}</h2>
            <p className="text-[12.5px] opacity-90">{title}</p>
            <div className="mt-2">
              <Contact resume={resume} />
            </div>
          </header>
          <div className="px-8 py-6">
            <Body resume={resume} />
          </div>
        </div>
      )}

      {t === "minimalist" && (
        <div className="px-9 py-9">
          <header className="border-b border-border pb-3">
            <h2 className="text-xl font-semibold tracking-tight">{name}</h2>
            <p className="text-[12px] text-muted-foreground">{title}</p>
            <div className="mt-1.5">
              <Contact resume={resume} />
            </div>
          </header>
          <Body resume={resume} />
        </div>
      )}

      {t === "corporate" && (
        <div className="px-9 py-8">
          <header className="border-b-2 border-primary pb-3 text-center">
            <h2 className="font-display text-2xl font-bold uppercase tracking-[0.12em]">{name}</h2>
            <p className="text-[12px] uppercase tracking-[0.2em] text-muted-foreground">{title}</p>
            <div className="mt-2">
              <Contact resume={resume} />
            </div>
          </header>
          <Body resume={resume} />
        </div>
      )}

      {t === "creative" && (
        <div className="grid grid-cols-1 sm:grid-cols-[210px_1fr]">
          <aside className="bg-brand-soft px-6 py-7">
            <h2 className="text-xl font-bold leading-tight text-ink">{name}</h2>
            <p className="mt-1 text-[12px] text-muted-foreground">{title}</p>
            <div className="mt-3">
              <Contact resume={resume} />
            </div>
            {resume.skills.length > 0 && (
              <div className="mt-5">
                <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Skills</h3>
                <ul className="space-y-1 text-[11.5px]">
                  {resume.skills.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
            {resume.education.length > 0 && (
              <div className="mt-5">
                <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Education</h3>
                {resume.education.map((ed) => (
                  <p key={ed.id} className="mb-2 text-[11.5px] leading-relaxed">
                    <span className="font-semibold">{ed.degree}</span> {ed.field}
                    <br />
                    {ed.school}
                    <br />
                    <span className="opacity-70">{[ed.start, ed.end].filter(Boolean).join(" – ")}</span>
                  </p>
                ))}
              </div>
            )}
          </aside>
          <div className="px-7 py-7">
            <Body resume={resume} compact />
          </div>
        </div>
      )}

      {t === "student" && (
        <div className="px-9 py-8">
          <header>
            <h2 className="text-2xl font-bold text-primary">{name}</h2>
            <p className="text-[12.5px] text-muted-foreground">{title}</p>
            <div className="mt-1.5">
              <Contact resume={resume} />
            </div>
          </header>
          {resume.education.length > 0 && (
            <Section title="Education">
              {resume.education.map((ed) => (
                <div key={ed.id} className="flex flex-wrap items-baseline justify-between gap-x-2">
                  <p className="font-semibold">
                    {ed.degree} {ed.field ? `in ${ed.field}` : ""} — {ed.school}
                  </p>
                  <p className="text-[10.5px] opacity-70">
                    {[ed.start, ed.end].filter(Boolean).join(" – ")} {ed.grade ? `· ${ed.grade}` : ""}
                  </p>
                </div>
              ))}
            </Section>
          )}
          {resume.skills.length > 0 && (
            <Section title="Skills">
              <p>{resume.skills.join(" · ")}</p>
            </Section>
          )}
          <Body resume={resume} compact />
        </div>
      )}
    </div>
  );
}