import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Speaking & Clients | Sparkfish",
    description: "A portfolio of recent speaking engagements, keynotes, and accelerator programs.",
};

const timelineEvents = [
    {
        title: "AI Accelerator Program in India",
        date: "Upcoming Summer",
        description: "International AI strategy program equipping professionals with immediate automation and prompting skills.",
        type: "Program"
    },
    {
        title: "AI Accelerator Program in Dubai",
        date: "Past Summer",
        description: "Intensive accelerator for executives focusing on organizational ROI and safe deployment of LLMs.",
        type: "Program"
    },
    {
        title: "AI in Education and Accounting",
        date: "Recent",
        description: "Keynote speaking at the CPA accounting convention addressing automation in finance and necessary curriculum updates.",
        type: "Keynote"
    },
    {
        title: "AI and the Justice System",
        date: "Recent",
        description: "Invited talk at the Louisiana District Attorney's Office focusing on evidentiary standards, deepfakes, and workflow improvements.",
        type: "Talk"
    },
    {
        title: "Keynote to the Federal Reserve Bank",
        date: "Recent",
        description: "Strategic briefing on generative AI economic impacts and internal productivity use-cases.",
        type: "Keynote"
    },
    {
        title: "AI and the Future of Higher Education",
        date: "Recent",
        description: "Featured presentation at the NOAI Conference analyzing the shift in pedagogy and university administration.",
        type: "Conference"
    },
    {
        title: "W.A.V.E. Workshop Series",
        date: "Semesterly",
        description: "Workshops for AI Visionaries and Educators. An ongoing foundational clinic for early adopters.",
        type: "Workshop"
    },
    {
        title: "Tulane University 'Sparking Success'",
        date: "Multiple presentations",
        description: "Faculty development sessions integrating AI-first syllabus design and assignment building.",
        type: "Talk"
    },
    {
        title: "Tulane Tech Day",
        date: "Presented Twice",
        description: "Large-scale technology literacy event highlighting best practices and emerging trends in generative models.",
        type: "Talk"
    }
];

export default function SpeakingPage() {
    return (
        <div className="container py-16 md:py-24 max-w-5xl space-y-12">
            <div className="space-y-4 text-center max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Speaking & Clients</h1>
                <p className="text-xl text-muted-foreground">
                    A sample of recent keynotes, corporate training sessions, and customized accelerators.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 pt-8">
                {timelineEvents.map((event, i) => (
                    <div key={i} className="flex flex-col gap-3 rounded-2xl border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground ring-1 ring-inset ring-border">
                                {event.type}
                            </span>
                            <span className="text-sm text-muted-foreground font-medium">{event.date}</span>
                        </div>
                        <h3 className="font-bold text-lg leading-tight mt-2">{event.title}</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm flex-1">
                            {event.description}
                        </p>
                    </div>
                ))}
            </div>

            <div className="mt-16 text-center p-8 bg-muted/50 rounded-2xl border">
                <h3 className="text-lg font-medium">Looking for a speaker or custom workshop?</h3>
                <p className="text-muted-foreground mt-2 mb-6">
                    This is just a sample of recent engagements. Additional projects and specific talks are available upon request.
                </p>
                <a
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground h-10 px-4 py-2 font-medium transition-colors hover:bg-primary/90"
                >
                    Book a Consultation
                </a>
            </div>
        </div>
    );
}
