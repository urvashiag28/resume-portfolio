import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Mail, MapPin, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — ResumeCraft AI" },
      { name: "description", content: "Questions, feedback or partnership ideas? Reach the ResumeCraft AI team and we'll reply within two business days." },
      { property: "og:title", content: "Contact Us — ResumeCraft AI" },
      { property: "og:description", content: "Get in touch with the ResumeCraft AI team." },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().trim().email("Enter a valid email").max(255),
  subject: z.string().trim().min(1, "Subject is required").max(120),
  message: z.string().trim().min(10, "Please write at least 10 characters").max(1000),
});

function ContactPage() {
  const [values, setValues] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      return;
    }
    setErrors({});
    setValues({ name: "", email: "", subject: "", message: "" });
    toast.success("Message sent", { description: "We'll get back to you within two business days." });
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-4xl font-bold">Contact us</h1>
      <p className="mt-3 text-muted-foreground">We read every message — feedback shapes what we build next.</p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={submit} noValidate className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={values.name} onChange={set("name")} maxLength={100} className="mt-1.5" />
                  {errors['name'] && <p className="mt-1 text-xs text-destructive">{errors['name']}</p>}
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={values.email} onChange={set("email")} maxLength={255} className="mt-1.5" />
                  {errors['email'] && <p className="mt-1 text-xs text-destructive">{errors['email']}</p>}
                </div>
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" value={values.subject} onChange={set("subject")} maxLength={120} className="mt-1.5" />
                {errors['subject'] && <p className="mt-1 text-xs text-destructive">{errors['subject']}</p>}
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" rows={6} value={values.message} onChange={set("message")} maxLength={1000} className="mt-1.5" />
                {errors['message'] && <p className="mt-1 text-xs text-destructive">{errors['message']}</p>}
              </div>
              <Button type="submit" size="lg">Send message</Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {[
            { icon: Mail, title: "Email", body: "hello@resumecraft.ai" },
            { icon: MessageSquare, title: "Support hours", body: "Mon–Fri, 9am–6pm IST" },
            { icon: MapPin, title: "Studio", body: "Bengaluru, India (remote-first)" },
          ].map((i) => (
            <Card key={i.title}>
              <CardContent className="flex gap-3 pt-6">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-brand-soft text-primary">
                  <i.icon className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold">{i.title}</p>
                  <p className="text-sm text-muted-foreground">{i.body}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}