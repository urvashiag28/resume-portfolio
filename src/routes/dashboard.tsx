import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Download, FilePlus2, PenLine, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useResumes } from "@/lib/resume-storage";
import { completion } from "@/lib/resume-types";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Your Resumes — ResumeCraft AI Dashboard" },
      { name: "description", content: "Manage saved resumes, track completion percentage, edit previous versions and download PDFs from your ResumeCraft AI dashboard." },
      { property: "og:title", content: "Your Resumes — ResumeCraft AI Dashboard" },
      { property: "og:description", content: "Save multiple resumes, track completion and export PDFs." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { resumes, ready, remove, create } = useResumes();
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Your resumes</h1>
          <p className="mt-1 text-sm text-muted-foreground">Saved locally in this browser. Export a PDF to keep a permanent copy.</p>
        </div>
        <Button
          onClick={() => {
            const r = create();
            navigate({ to: "/builder", search: { id: r.id } });
          }}
        >
          <FilePlus2 className="size-4" /> New resume
        </Button>
      </div>

      {ready && resumes.length === 0 && (
        <Card className="mt-10">
          <CardContent className="py-14 text-center">
            <p className="text-muted-foreground">No resumes yet.</p>
            <Button asChild className="mt-5">
              <Link to="/builder">Create your first resume</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {resumes.map((r) => {
          const pct = completion(r);
          return (
            <Card key={r.id} className="transition-smooth hover:-translate-y-1 hover:shadow-lift">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-lg font-semibold">{r.name}</h2>
                  <Badge variant="secondary" className="capitalize">{r.template}</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {r.personal.fullName || "Unnamed"} · updated {new Date(r.updatedAt).toLocaleDateString()}
                </p>
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Completion</span>
                    <span>{pct}%</span>
                  </div>
                  <Progress value={pct} className="mt-1.5" />
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Button asChild size="sm">
                    <Link to="/builder" search={{ id: r.id }}>
                      <PenLine className="size-3.5" /> Edit
                    </Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link to="/builder" search={{ id: r.id }}>
                      <Download className="size-3.5" /> PDF
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      remove(r.id);
                      toast.success("Resume deleted");
                    }}
                  >
                    <Trash2 className="size-3.5 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}