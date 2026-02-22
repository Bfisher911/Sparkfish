import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Weekend Courses | Sparkfish",
    description: "Browse our intensive weekend AI courses and masterclasses.",
};

export default async function WeekendCoursesPage() {
    const supabase = await createClient();

    const { data: courses, error } = await supabase
        .from("programs")
        .select("*, cohorts(*)")
        .eq("type", "weekend_course")
        .eq("active", true)
        .order("created_at", { ascending: true });

    if (error) {
        console.error("Error fetching weekend courses", error);
    }

    return (
        <div className="container py-16 md:py-24 space-y-16">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Weekend Courses</h1>
                <p className="text-lg text-muted-foreground">
                    Short, intensive sprints designed to rapidly upskill you in specific AI disciplines over just a few days.
                </p>
            </div>

            <div className="grid gap-12 max-w-4xl mx-auto">
                {courses?.map((course) => (
                    <div key={course.id} id={course.slug} className="rounded-3xl border bg-card p-6 md:p-10 shadow-sm flex flex-col md:flex-row gap-8 scroll-m-24">
                        <div className="flex-1 space-y-4">
                            <h2 className="text-2xl font-bold">{course.title}</h2>
                            <p className="text-muted-foreground">{course.description}</p>

                            <div className="prose prose-sm dark:prose-invert">
                                <p>
                                    These intensives pack what normally takes months of trial-and-error into a guided
                                    weekend experience. You will leave with working templates, automation scripts, and
                                    a clear understanding of how to apply the concepts on Monday morning.
                                </p>
                            </div>
                        </div>

                        <div className="md:w-72 space-y-4 rounded-xl bg-muted/50 p-6 border">
                            <h3 className="font-semibold">Upcoming Sessions</h3>
                            {course.cohorts?.filter((c: any) => c.active).length === 0 ? (
                                <p className="text-sm text-muted-foreground">No upcoming sessions scheduled.</p>
                            ) : (
                                <ul className="space-y-4">
                                    {course.cohorts?.filter((c: any) => c.active).map((cohort: any) => {
                                        const seatsAvailable = cohort.seat_limit - cohort.seats_taken;
                                        const isFull = seatsAvailable <= 0;

                                        return (
                                            <li key={cohort.id} className="text-sm space-y-2 pb-4 border-b last:border-0 last:pb-0">
                                                <div className="font-medium">{cohort.title}</div>
                                                <div className="text-muted-foreground line-clamp-1">{cohort.schedule_text}</div>
                                                <div className="flex items-center justify-between pt-2">
                                                    <span className={isFull ? "text-destructive" : "text-green-600 dark:text-green-400"}>
                                                        {isFull ? "Full" : `${seatsAvailable} seats`}
                                                    </span>
                                                    <Button size="sm" disabled={isFull} asChild={!isFull}>
                                                        {isFull ? <span>Waitlist</span> : <Link href={`/checkout?cohort=${cohort.id}`}>Enroll</Link>}
                                                    </Button>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>
                    </div>
                ))}
                {courses?.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        No weekend courses are currently active. Please check back later.
                    </div>
                )}
            </div>
        </div>
    );
}
