import { createServerFn } from "@tanstack/react-start";
import { generateText, Output } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const MODEL = "google/gemini-3.6-flash";

function gateway() {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI is not configured yet. Please try again later.");
  return createLovableAiGatewayProvider(key);
}

const SummaryInput = z.object({
  name: z.string().max(120).default(""),
  role: z.string().max(160).default(""),
  field: z.string().max(160).default(""),
  highlights: z.string().max(3000).default(""),
});

export const generateSummary = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => SummaryInput.parse(d))
  .handler(async ({ data }) => {
    const result = await generateText({
      model: gateway()(MODEL),
      system:
        "You are a professional resume writer. Write concise, achievement-focused resume summaries. No first person pronouns, no clichés, no markdown.",
      prompt: `Write a 2-3 sentence professional resume summary.\nName: ${data.name}\nTarget role: ${data.role}\nField: ${data.field}\nBackground notes: ${data.highlights}`,
    });
    return { summary: result.text.trim() };
  });

const SkillsInput = z.object({ field: z.string().min(1).max(160), existing: z.array(z.string()).max(60).default([]) });

export const suggestSkills = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => SkillsInput.parse(d))
  .handler(async ({ data }) => {
    const { output } = await generateText({
      model: gateway()(MODEL),
      output: Output.object({ schema: z.object({ skills: z.array(z.string()).max(12) }) }),
      system: "You suggest concrete, hireable resume skills. Short skill names only.",
      prompt: `Suggest 10 relevant resume skills for the career field "${data.field}". Exclude these already listed: ${data.existing.join(", ") || "none"}.`,
    });
    return { skills: output?.skills ?? [] };
  });

const BulletsInput = z.object({
  kind: z.enum(["project", "experience"]),
  title: z.string().max(160).default(""),
  context: z.string().max(2000).default(""),
});

export const generateBullets = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => BulletsInput.parse(d))
  .handler(async ({ data }) => {
    const { output } = await generateText({
      model: gateway()(MODEL),
      output: Output.object({ schema: z.object({ bullets: z.array(z.string()).max(5) }) }),
      system:
        "You write resume bullet points. Each starts with a strong action verb, is under 22 words, and includes a plausible measurable outcome. No markdown bullets.",
      prompt: `Write 3 resume bullet points for this ${data.kind}.\nTitle: ${data.title}\nDetails: ${data.context}`,
    });
    return { bullets: output?.bullets ?? [] };
  });

const ScoreInput = z.object({ resume: z.string().min(1).max(12000) });

export const scoreResume = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => ScoreInput.parse(d))
  .handler(async ({ data }) => {
    const { output } = await generateText({
      model: gateway()(MODEL),
      output: Output.object({
        schema: z.object({
          score: z.number().min(0).max(100),
          strengths: z.array(z.string()).max(4),
          improvements: z.array(z.string()).max(5),
        }),
      }),
      system: "You are a strict but fair technical recruiter reviewing resumes for ATS and impact.",
      prompt: `Score this resume out of 100 and give strengths and specific improvements.\n\n${data.resume}`,
    });
    return output ?? { score: 0, strengths: [], improvements: [] };
  });