import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const supabase = await createClient();
    const { data: program } = await supabase.from("programs").select("title, description").eq("slug", slug).single();

    if (!program) return { title: "Program Not Found" };

    return {
        title: `${program.title} | Sparkfish`,
        description: program.description,
    };
}

export default async function ProgramDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const supabase = await createClient();

    // Fetch program and its cohorts
    const { data: program, error } = await supabase
        .from("programs")
        .select("*, cohorts(*)")
        .eq("slug", slug)
        .single();

    if (error || !program) {
        notFound();
    }

    const activeCohorts = program.cohorts?.filter((c: any) => c.active) || [];

    return (
        <div className="container py-16 md:py-24 max-w-5xl space-y-16">
            <div className="space-y-6">
                <Link href="/programs" className="text-sm font-medium text-muted-foreground hover:text-foreground inline-flex items-center">
                    &larr; Back to Programs
                </Link>
                <div className="inline-flex rounded-lg bg-primary/10 px-3 py-1 font-medium text-primary text-sm my-4">
                    {program.type === "six_month" ? "6-Month Accelerator" : program.type === "twelve_month" ? "12-Month Fellowship" : "Weekend Course"}
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">{program.title}</h1>
                <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl">
                    {program.description}
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
                <div className="md:col-span-2 space-y-8 prose prose-slate dark:prose-invert max-w-none">
                    <h3>Program Overview</h3>
                    <p>
                        This program is designed for ambitious professionals ready to implement AI workflows within their day-to-day operations.
                        Delivered entirely over Zoom in a structured cohort format, you'll join peers from your industry track to solve
                        real-world challenges.
                    </p>

                    <h3>What You Will Learn</h3>
                    <ul>
                        <li>Advanced prompt engineering and context window management.</li>
                        <li>Workflow automation using off-the-shelf AI tooling.</li>
                        <li>Customized industry-specific deployment strategies.</li>
                        <li>Ethical considerations, bias navigation, and auditability.</li>
                    </ul>

                    <h3>Format & Delivery</h3>
                    <p>
                        100% live, instructor-led sessions supplemented by asynchronous project work and peer review.
                        All graduates receive a verifiable digital certificate.
                    </p>
                </div>

                <div className="space-y-6">
                    <div className="rounded-2xl border bg-card p-6 shadow-sm sticky top-24">
                        <h3 className="font-bold text-xl mb-6">Available Cohorts</h3>
                        {activeCohorts.length === 0 ? (
                            <p className="text-muted-foreground text-sm">No active cohorts available at this time. Check back soon.</p>
                        ) : (
                            <div className="space-y-6">
                                {activeCohorts.map((cohort: any) => {
                                    const seatsAvailable = cohort.seat_limit - cohort.seats_taken;
                                    const isFull = seatsAvailable <= 0;

                                    return (
                                        <div key={cohort.id} className="space-y-3 pb-6 border-b last:border-0 last:pb-0">
                                            <div>
                                                <div className="font-bold">{cohort.title}</div>
                                                <div className="text-sm text-muted-foreground">Starts: {cohort.start_date}</div>
                                                <div className="text-xs text-muted-foreground mt-1">{cohort.schedule_text}</div>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className={isFull ? "text-destructive font-medium" : "text-green-600 dark:text-green-400 font-medium"}>
                                                    {isFull ? "Sold Out" : `${seatsAvailable} seats left of ${cohort.seat_limit}`}
                                                </span>
                                            </div>
                                            <Button className="w-full mt-2" disabled={isFull} asChild={!isFull}>
                                                {isFull ? (
                                                    <span>Join Waitlist</span>
                                                ) : (
                                                    // In a real app, this would point to a checkout flow passing the cohort ID
                                                    <Link href={`/checkout?cohort=${cohort.id}`}>Enroll Now</Link>
                                                )}
                                            </Button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
