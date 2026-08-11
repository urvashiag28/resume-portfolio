import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — ResumeCraft AI" },
      { name: "description", content: "Free forever resume builder with AI assistance, plus a Premium plan for unlimited AI rewrites, all templates and priority export." },
      { property: "og:title", content: "Pricing — ResumeCraft AI" },
      { property: "og:description", content: "Start free. Upgrade to Premium for unlimited AI rewrites and every template." },
    ],
  }),
  component: PricingPage,
});

const plans = [
  {
    name: "Free",
    price: "$0",
    note: "forever",
    features: [
      "Unlimited resumes stored locally",
      "3 core templates",
      "AI summary generation",
      "Resume score with suggestions",
      "PDF export",
    ],
    cta: "Start free",
    featured: false,
  },
  {
    name: "Premium",
    price: "$6",
    note: "per month",
    features: [
      "Everything in Free",
      "All 5 premium templates",
      "Unlimited AI bullet rewrites",
      "Skill suggestions by career field",
      "Cover letter assistant (beta)",
      "Priority support",
    ],
    cta: "Go Premium",
    featured: true,
  },
];

function PricingPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-4xl font-bold">Simple pricing</h1>
      <p className="mt-3 text-muted-foreground">Build for free. Upgrade only when you want the extras.</p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {plans.map((p) => (
          <Card key={p.name} className={cn("relative", p.featured && "border-primary shadow-lift")}>
            {p.featured && (
              <span className="absolute -top-3 left-6 rounded-full bg-hero-gradient px-3 py-1 text-xs font-medium text-primary-foreground">
                Most popular
              </span>
            )}
            <CardContent className="pt-8">
              <h2 className="text-xl font-semibold">{p.name}</h2>
              <p className="mt-3">
                <span className="font-display text-4xl font-bold">{p.price}</span>
                <span className="ml-2 text-sm text-muted-foreground">{p.note}</span>
              </p>
              <ul className="mt-6 space-y-3 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" /> {f}
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-8 w-full" variant={p.featured ? "default" : "outline"}>
                <Link to="/builder">{p.cta}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}