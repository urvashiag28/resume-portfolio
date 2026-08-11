import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ResumePreview, TEMPLATES } from "@/components/resume/ResumePreview";
import { sampleResume, type TemplateId } from "@/lib/resume-types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/templates")({
  head: () => ({
    meta: [
      { title: "Resume Templates — ResumeCraft AI" },
      { name: "description", content: "Preview five professional resume templates: Modern, Minimalist, Corporate, Creative and Student. Switch in real time." },
      { property: "og:title", content: "Resume Templates — ResumeCraft AI" },
      { property: "og:description", content: "Five ATS-friendly resume templates with real-time switching." },
    ],
  }),
  component: TemplatesPage,
});

function TemplatesPage() {
  const [active, setActive] = useState<TemplateId>("modern");
  const demo = { ...sampleResume(), template: active };

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <h1 className="text-4xl font-bold">Professional resume templates</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Every template is ATS-friendly and switches instantly — your content never changes.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[300px_1fr]">
        <div className="space-y-3">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={cn(
                "w-full rounded-xl border border-border bg-card p-4 text-left transition-smooth hover:shadow-soft",
                active === t.id && "border-primary bg-brand-soft shadow-soft",
              )}
            >
              <p className="font-semibold">{t.label}</p>
              <p className="mt-1 text-xs text-muted-foreground">{t.blurb}</p>
            </button>
          ))}
          <Button asChild className="w-full">
            <Link to="/builder">Use this template</Link>
          </Button>
        </div>
        <ResumePreview resume={demo} className="shadow-lift" />
      </div>
    </div>
  );
}