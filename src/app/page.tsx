import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-background to-background dark:from-sky-950/20 dark:via-background dark:to-background pointer-events-none" />
        <div className="container relative z-10 flex flex-col items-center text-center space-y-8">
          <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm bg-muted/50 backdrop-blur-sm text-muted-foreground shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2 animate-pulse" />
            Enrollment open for Fall 2026 Cohorts
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Master Artificial Intelligence, <br className="hidden md:block" /> Future-Proof Your Career.
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl">
            Sparkfish delivers expert-led, cohort-based AI accelerators for professionals and organizations ready to lead in the age of AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button size="lg" asChild className="h-12 px-8 text-base">
              <Link href="/programs">Explore Programs</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-12 px-8 text-base bg-background/50 backdrop-blur-sm">
              <Link href="/contact">Book a Strategy Call</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats / Proof Section */}
      <section className="border-y bg-muted/30 py-12">
        <div className="container grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-border/50">
          <div className="flex flex-col items-center justify-center space-y-2">
            <span className="text-4xl font-bold tracking-tighter">500+</span>
            <span className="text-sm font-medium text-muted-foreground">Professionals Trained</span>
          </div>
          <div className="flex flex-col items-center justify-center space-y-2">
            <span className="text-4xl font-bold tracking-tighter">98%</span>
            <span className="text-sm font-medium text-muted-foreground">Completion Rate</span>
          </div>
          <div className="flex flex-col items-center justify-center space-y-2">
            <span className="text-4xl font-bold tracking-tighter">15+</span>
            <span className="text-sm font-medium text-muted-foreground">Industry Tracks</span>
          </div>
          <div className="flex flex-col items-center justify-center space-y-2">
            <span className="text-4xl font-bold tracking-tighter">4.9/5</span>
            <span className="text-sm font-medium text-muted-foreground">Average Rating</span>
          </div>
        </div>
      </section>

      {/* Flagship Programs */}
      <section className="py-24">
        <div className="container space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Accelerators Built for Impact</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the program that fits your goals. From weekend sprints to comprehensive 12-month fellowships, we have a path for you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* 6-Month Card */}
            <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border bg-card p-8 shadow-sm transition-all hover:shadow-md hover:border-primary/50">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 space-y-6">
                <div className="inline-flex rounded-lg bg-primary/10 px-3 py-1 font-medium text-primary text-sm">Most Popular</div>
                <h3 className="text-2xl font-bold">6-Month AI Accelerator</h3>
                <p className="text-muted-foreground leading-relaxed">
                  A comprehensive, weekend-based live cohort that transforms your AI capabilities. Master prompting, workflows, and strategy with a dedicated professional network.
                </p>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center"><svg className="mr-2 h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Live Zoom Cohorts</li>
                  <li className="flex items-center"><svg className="mr-2 h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Industry-Specific Tracks</li>
                  <li className="flex items-center"><svg className="mr-2 h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Verifiable Certificate</li>
                </ul>
              </div>
              <div className="relative z-10 mt-8">
                <Button className="w-full" asChild>
                  <Link href="/programs/six-month">View Program Details</Link>
                </Button>
              </div>
            </div>

            {/* 12-Month Card */}
            <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border bg-card p-8 shadow-sm transition-all hover:shadow-md hover:border-primary/50">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 space-y-6">
                <div className="inline-flex rounded-lg bg-muted px-3 py-1 font-medium text-muted-foreground text-sm">Advanced Track</div>
                <h3 className="text-2xl font-bold">12-Month AI Fellowship</h3>
                <p className="text-muted-foreground leading-relaxed">
                  The ultimate deep-dive for AI leaders. Includes everything in the 6-Month program, plus a guided capstone project and strategic implementation support.
                </p>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center"><svg className="mr-2 h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Guided Capstone Project</li>
                  <li className="flex items-center"><svg className="mr-2 h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> 1-on-1 Mentorship</li>
                  <li className="flex items-center"><svg className="mr-2 h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Executive Certificate</li>
                </ul>
              </div>
              <div className="relative z-10 mt-8">
                <Button className="w-full" variant="secondary" asChild>
                  <Link href="/programs/twelve-month">View Program Details</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tracks Section */}
      <section className="bg-slate-900 text-slate-50 py-24">
        <div className="container flex flex-col items-center text-center space-y-12">
          <div className="space-y-4 max-w-3xl">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Tailored to Your Industry</h2>
            <p className="text-lg text-slate-400">
              We teach AI in context. When you enroll, you choose a functional track to ensure case studies, workflows, and peers align with your unique daily challenges.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 w-full max-w-5xl">
            <div className="rounded-2xl bg-slate-800/50 border border-slate-700 p-6 flex flex-col items-center text-center hover:bg-slate-800 transition-colors">
              <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Business Productivity</h3>
              <p className="text-sm text-slate-400">Workflow automation, knowledge bases, and proposals.</p>
            </div>
            <div className="rounded-2xl bg-slate-800/50 border border-slate-700 p-6 flex flex-col items-center text-center hover:bg-slate-800 transition-colors">
              <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Healthcare Providers</h3>
              <p className="text-sm text-slate-400">HIPAA-safe patterns, patient docs, and operations.</p>
            </div>
            <div className="rounded-2xl bg-slate-800/50 border border-slate-700 p-6 flex flex-col items-center text-center hover:bg-slate-800 transition-colors">
              <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Education & Faculty</h3>
              <p className="text-sm text-slate-400">Course design, AI literacy, and academic workflows.</p>
            </div>
          </div>
          <Button variant="outline" className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-800" asChild>
            <Link href="/tracks">Explore All Tracks</Link>
          </Button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 border-t">
        <div className="container max-w-4xl text-center space-y-8">
          <h2 className="text-4xl font-extrabold tracking-tight">Ready to lead the AI transformation?</h2>
          <p className="text-xl text-muted-foreground">
            Join the Sparkfish community today. Cohorts fill up quickly, secure your seat for our next session.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" asChild className="h-14 px-10 text-lg">
              <Link href="/programs">View Cohort Schedule</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
