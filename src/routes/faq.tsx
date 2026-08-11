import { createFileRoute } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — ResumeCraft AI" },
      { name: "description", content: "Answers about AI resume writing, ATS compatibility, data privacy, PDF export and the Premium plan." },
      { property: "og:title", content: "FAQ — ResumeCraft AI" },
      { property: "og:description", content: "Common questions about ResumeCraft AI, ATS friendliness and privacy." },
    ],
  }),
  component: FaqPage,
});

const faqs: [string, string][] = [
  ["Is ResumeCraft AI free?", "Yes. You can build unlimited resumes, use AI summaries and resume scoring, and export PDFs on the free plan. Premium adds every template and unlimited AI rewrites."],
  ["Are the templates ATS-friendly?", "All five templates use a single-column-friendly content order, real text (no images of text) and standard section headings, so applicant tracking systems parse them reliably."],
  ["Where is my data stored?", "In your browser's local storage. Nothing is uploaded to a server, so clearing your browser data will remove saved resumes — export a PDF to keep a copy."],
  ["How does the AI work?", "You give short, rough notes and the AI rewrites them into achievement-focused resume language. You always review and edit before anything is saved."],
  ["Can I download as PDF?", "Yes. Use Download PDF in the builder or dashboard — it opens your browser's print dialog with a print-optimised sheet. Choose 'Save as PDF'."],
  ["Can I create more than one resume?", "Yes. The dashboard stores multiple resumes with completion tracking, so you can tailor a version per role."],
];

function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-bold">Frequently asked questions</h1>
      <Accordion type="single" collapsible className="mt-8">
        {faqs.map(([q, a]) => (
          <AccordionItem key={q} value={q}>
            <AccordionTrigger className="text-left">{q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}