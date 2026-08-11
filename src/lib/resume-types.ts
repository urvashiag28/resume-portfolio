export type TemplateId = "modern" | "minimalist" | "corporate" | "creative" | "student";

export type Entry = { id: string };

export type Education = Entry & {
  school: string;
  degree: string;
  field: string;
  start: string;
  end: string;
  grade: string;
};

export type Experience = Entry & {
  company: string;
  role: string;
  location: string;
  start: string;
  end: string;
  bullets: string[];
};

export type Project = Entry & {
  name: string;
  link: string;
  tech: string;
  bullets: string[];
};

export type Certification = Entry & {
  name: string;
  issuer: string;
  year: string;
};

export type Achievement = Entry & {
  title: string;
  detail: string;
};

export type Personal = {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  summary: string;
};

export type Resume = {
  id: string;
  name: string;
  template: TemplateId;
  updatedAt: number;
  personal: Personal;
  education: Education[];
  skills: string[];
  projects: Project[];
  experience: Experience[];
  certifications: Certification[];
  achievements: Achievement[];
};

export const uid = () => Math.random().toString(36).slice(2, 10);

export const emptyResume = (name = "Untitled resume"): Resume => ({
  id: uid(),
  name,
  template: "modern",
  updatedAt: Date.now(),
  personal: {
    fullName: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    summary: "",
  },
  education: [],
  skills: [],
  projects: [],
  experience: [],
  certifications: [],
  achievements: [],
});

export const sampleResume = (): Resume => ({
  ...emptyResume("Sample — Software Intern"),
  personal: {
    fullName: "Aisha Verma",
    title: "Computer Science Student · Frontend Developer",
    email: "aisha.verma@example.com",
    phone: "+91 98765 43210",
    location: "Bengaluru, India",
    website: "aishaverma.dev",
    linkedin: "linkedin.com/in/aishaverma",
    summary:
      "Final-year Computer Science student with hands-on experience building accessible React interfaces and shipping two production side-projects used by 3,000+ students.",
  },
  skills: ["React", "TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS", "Git", "Figma"],
  education: [
    {
      id: uid(),
      school: "PES University",
      degree: "B.Tech",
      field: "Computer Science",
      start: "2022",
      end: "2026",
      grade: "8.7 CGPA",
    },
  ],
  experience: [
    {
      id: uid(),
      company: "Northwind Labs",
      role: "Frontend Engineering Intern",
      location: "Remote",
      start: "Jun 2025",
      end: "Aug 2025",
      bullets: [
        "Rebuilt the onboarding flow in React and TypeScript, cutting drop-off by 24%.",
        "Added a component test suite covering 80% of shared UI primitives.",
      ],
    },
  ],
  projects: [
    {
      id: uid(),
      name: "StudySync",
      link: "github.com/aisha/studysync",
      tech: "React, Supabase, Tailwind",
      bullets: [
        "Built a collaborative study planner adopted by 3,000+ campus users.",
        "Designed an offline-first sync layer that reduced failed saves to under 1%.",
      ],
    },
  ],
  certifications: [
    { id: uid(), name: "Meta Front-End Developer", issuer: "Coursera", year: "2025" },
  ],
  achievements: [
    { id: uid(), title: "Winner, HackBLR 2025", detail: "1st of 142 teams for an accessibility tool." },
  ],
});

export function completion(resume: Resume): number {
  const checks = [
    !!resume.personal.fullName,
    !!resume.personal.title,
    !!resume.personal.email,
    !!resume.personal.phone,
    !!resume.personal.location,
    resume.personal.summary.length > 40,
    resume.education.length > 0,
    resume.skills.length >= 5,
    resume.projects.length > 0,
    resume.experience.length > 0,
    resume.certifications.length > 0,
    resume.achievements.length > 0,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}