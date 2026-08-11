import { Link } from "@tanstack/react-router";
import { Github, Linkedin, Mail, Sparkles, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="no-print mt-24 border-t border-border bg-secondary/50">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-display text-lg font-bold">
            <span className="grid size-8 place-items-center rounded-lg bg-hero-gradient text-primary-foreground">
              <Sparkles className="size-4" />
            </span>
            ResumeCraft <span className="text-primary">AI</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            AI-assisted resumes for students and job seekers. Build, score and export in minutes.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Product</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/builder" className="transition-smooth hover:text-foreground">Resume Builder</Link></li>
            <li><Link to="/templates" className="transition-smooth hover:text-foreground">Templates</Link></li>
            <li><Link to="/dashboard" className="transition-smooth hover:text-foreground">Dashboard</Link></li>
            <li><Link to="/pricing" className="transition-smooth hover:text-foreground">Pricing</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Company</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="transition-smooth hover:text-foreground">About</Link></li>
            <li><Link to="/faq" className="transition-smooth hover:text-foreground">FAQ</Link></li>
            <li><Link to="/contact" className="transition-smooth hover:text-foreground">Contact Us</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Get in touch</h4>
          <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="size-4" /> hello@resumecraft.ai
          </p>
          <div className="mt-4 flex gap-3">
            <a href="https://github.com" aria-label="GitHub" className="rounded-md border border-border bg-card p-2 transition-smooth hover:shadow-soft">
              <Github className="size-4" />
            </a>
            <a href="https://linkedin.com" aria-label="LinkedIn" className="rounded-md border border-border bg-card p-2 transition-smooth hover:shadow-soft">
              <Linkedin className="size-4" />
            </a>
            <a href="https://twitter.com" aria-label="Twitter" className="rounded-md border border-border bg-card p-2 transition-smooth hover:shadow-soft">
              <Twitter className="size-4" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} ResumeCraft AI. Built for students and job seekers.
      </div>
    </footer>
  );
}