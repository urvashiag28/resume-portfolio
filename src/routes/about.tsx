import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About ResumeCraft AI" },
      { name: "description", content: "Why we built ResumeCraft AI: an AI resume builder that helps students and job seekers turn raw experience into recruiter-ready resumes." },
      { property: "og:title", content: "About ResumeCraft AI" },
      { property: "og:description", content: "Our mission: make great resumes accessible to every student and job seeker." },
    ],
  }),
  component: AboutPage,
});

const values = [
  { title: "Substance over styling", body: "A resume wins on measurable outcomes. Our AI pushes you toward numbers, scope and impact." },
  { title: "Accessible to everyone", body: "The core builder is free forever. No paywall between a student and their first interview." },
  { title: "Your data stays yours", body: "Resumes are stored in your own browser. Nothing is uploaded or sold." },
];

function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-bold">We help people write the resume they deserve</h1>
      <p className="mt-5 text-lg text-muted-foreground">
        ResumeCraft AI started as a campus side-project after watching brilliant classmates get filtered out by
        resumes that undersold them. Most people don't have a writing problem — they have a translation problem.
        Turning "I helped with the website" into "Rebuilt the onboarding flow, cutting drop-off 24%" is what our AI
        does best.
      </p>
      <p className="mt-4 text-muted-foreground">
        Today the builder combines a structured multi-step form, five recruiter-tested templates, and an AI review
        layer that scores your resume and tells you exactly what to fix next.
      </p>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {values.map((v) => (
          <Card key={v.title}>
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold">{v.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{v.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button asChild size="lg" className="mt-12">
        <Link to="/builder">Try the builder</Link>
      </Button>
    </div>
  );
}