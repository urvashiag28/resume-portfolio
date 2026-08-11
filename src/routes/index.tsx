import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Download,
  FileText,
  LayoutTemplate,
  ShieldCheck,
  Sparkles,
  Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ResumePreview } from "@/components/resume/ResumePreview";
import { sampleResume } from "@/lib/resume-types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ResumeCraft AI — Build a Professional Resume in Minutes" },
      {
        name: "description",
        content:
          "ResumeCraft AI helps students and job seekers create ATS-ready resumes with AI summaries, skill suggestions, bullet points and resume scoring.",
      },
      { property: "og:title", content: "ResumeCraft AI — Build a Professional Resume in Minutes" },
      {
        property: "og:description",
        content: "AI-assisted resume builder with 5 professional templates, live preview and PDF export.",
      },
    ],
  }),
  component: Index,
});

const features = [
  { icon: Wand2, title: "AI writing assistant", body: "Generate polished summaries and measurable bullet points from a few rough notes." },
  { icon: Sparkles, title: "Smart skill suggestions", body: "Get skills recruiters actually search for, tailored to your career field." },
  { icon: BarChart3, title: "Resume score", body: "Instant 0–100 scoring with concrete, prioritised improvement suggestions." },
  { icon: LayoutTemplate, title: "5 pro templates", body: "Switch between Modern, Minimalist, Corporate, Creative and Student in one click." },
  { icon: Download, title: "PDF export", body: "Export a clean, print-perfect PDF straight from your browser." },
  { icon: ShieldCheck, title: "Private by default", body: "Everything is stored locally in your browser. No account required." },
];

const testimonials = [
  { name: "Rohan Mehta", role: "CS student, landed an SDE internship", quote: "I went from a blank page to a recruiter-ready resume in one sitting. The scoring told me exactly what was missing." },
  { name: "Priya Nair", role: "Marketing associate", quote: "The AI bullet points turned my vague responsibilities into numbers-driven achievements. Three callbacks in two weeks." },
  { name: "Daniel Osei", role: "Career switcher, data analytics", quote: "Switching templates live made it easy to find a layout that suited a non-traditional background." },
];

function Index() {
  const demo = sampleResume();

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 -top-40 h-96 bg-hero-gradient opacity-10 blur-3xl" />
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 lg:grid-cols-2 lg:py-24">
          <div className="animate-rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-soft">
              <Sparkles className="size-3.5 text-primary" /> Powered by AI
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-6xl">
              Build a Professional Resume in Minutes
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              ResumeCraft AI writes your summary, sharpens your bullet points and scores your resume — so you can
              spend your time applying, not formatting.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/builder">
                  Create Resume <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/templates">View Templates</Link>
              </Button>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-6">
              {[
                ["5", "Templates"],
                ["4", "AI tools"],
                ["100%", "Free to start"],
              ].map(([v, l]) => (
                <div key={l}>
                  <dt className="font-display text-2xl font-bold text-primary">{v}</dt>
                  <dd className="text-xs text-muted-foreground">{l}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="animate-rise lg:pl-6">
            <div className="rotate-[1.2deg] transition-smooth hover:rotate-0">
              <ResumePreview resume={demo} className="shadow-lift" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-bold">Everything you need to get shortlisted</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          A focused toolkit that handles the writing, the layout and the review.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} className="transition-smooth hover:-translate-y-1 hover:shadow-lift">
              <CardContent className="pt-6">
                <span className="grid size-11 place-items-center rounded-xl bg-brand-soft text-primary">
                  <f.icon className="size-5" />
                </span>
                <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-secondary/40 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-bold">Loved by students and job seekers</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {testimonials.map((t) => (
              <Card key={t.name} className="h-full">
                <CardContent className="pt-6">
                  <FileText className="size-5 text-primary" />
                  <p className="mt-4 text-sm leading-relaxed">“{t.quote}”</p>
                  <p className="mt-5 text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="overflow-hidden rounded-3xl bg-hero-gradient px-8 py-14 text-center text-primary-foreground shadow-lift">
          <h2 className="text-3xl font-bold">Your next resume is 10 minutes away</h2>
          <p className="mx-auto mt-3 max-w-xl opacity-90">
            Start with a template, let AI fill the hard parts, and export a polished PDF.
          </p>
          <Button asChild size="lg" variant="secondary" className="mt-7">
            <Link to="/builder">Start building free</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
