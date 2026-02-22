import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Programs | Sparkfish",
    description: "Browse our AI accelerator programs, fellowships, and weekend courses.",
};

export default async function ProgramsPage() {
    const supabase = await createClient();

    // Fetch programs that are active
    const { data: programs, error } = await supabase
        .from("programs")
        .select("*, cohorts(*)")
        .eq("active", true)
        .order("created_at", { ascending: true });

    if (error) {
        console.error("Error fetching programs:", error);
    }

    const sixMonth = programs?.find((p) => p.type === "six_month");
    const twelveMonth = programs?.find((p) => p.type === "twelve_month");
    const weekendCourses = programs?.filter((p) => p.type === "weekend_course") || [];

    return (
        <div className="container py-16 md:py-24 space-y-16">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">AI Accelerators & Programs</h1>
                <p className="text-xl text-muted-foreground">
                    Choose a path that aligns with your timeline and goals. All programs are cohort-based and delivered live via Zoom.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {sixMonth && (
                    <div className="flex flex-col rounded-3xl border bg-card p-8 shadow-sm h-full">
                        <div className="inline-flex max-w-fit rounded-lg bg-primary/10 px-3 py-1 font-medium text-primary text-sm mb-4">
                            Most Popular
                        </div>
                        <h2 className="text-3xl font-bold mb-4">{sixMonth.title}</h2>
                        <p className="text-muted-foreground flex-1 mb-6">
                            {sixMonth.description}
                        </p>
                        <div className="space-y-4">
                            <div className="text-sm font-medium">Upcoming Cohorts:</div>
                            <ul className="text-sm space-y-2 text-muted-foreground">
                                {sixMonth.cohorts?.filter((c: any) => c.active).map((cohort: any) => (
                                    <li key={cohort.id} className="flex justify-between border-b pb-2">
                                        <span>{cohort.title}</span>
                                        <span className="font-medium text-foreground">{cohort.start_date}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="mt-8 pt-6 border-t">
                            <Button className="w-full" asChild>
                                <Link href={`/programs/${sixMonth.slug}`}>View Details & Register</Link>
                            </Button>
                        </div>
                    </div>
                )}

                {twelveMonth && (
                    <div className="flex flex-col rounded-3xl border bg-card p-8 shadow-sm h-full">
                        <div className="inline-flex max-w-fit rounded-lg bg-muted px-3 py-1 font-medium text-muted-foreground text-sm mb-4">
                            Advanced Track
                        </div>
                        <h2 className="text-3xl font-bold mb-4">{twelveMonth.title}</h2>
                        <p className="text-muted-foreground flex-1 mb-6">
                            {twelveMonth.description}
                        </p>
                        <div className="space-y-4">
                            <div className="text-sm font-medium">Upcoming Cohorts:</div>
                            <ul className="text-sm space-y-2 text-muted-foreground">
                                {twelveMonth.cohorts?.filter((c: any) => c.active).map((cohort: any) => (
                                    <li key={cohort.id} className="flex justify-between border-b pb-2">
                                        <span>{cohort.title}</span>
                                        <span className="font-medium text-foreground">{cohort.start_date}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="mt-8 pt-6 border-t">
                            <Button className="w-full" variant="secondary" asChild>
                                <Link href={`/programs/${twelveMonth.slug}`}>View Details & Register</Link>
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-24">
                <div className="flex items-center justify-between border-b pb-4 mb-8">
                    <h3 className="text-2xl font-bold">Weekend Courses</h3>
                    <Button variant="ghost" asChild>
                        <Link href="/weekend-courses">View All Catalog &rarr;</Link>
                    </Button>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {weekendCourses.map((course) => (
                        <div key={course.id} className="rounded-xl border bg-card p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
                            <div>
                                <h4 className="font-bold text-lg mb-2">{course.title}</h4>
                                <p className="text-sm text-muted-foreground">{course.description}</p>
                            </div>
                            <div className="mt-6">
                                <Button variant="outline" className="w-full" asChild>
                                    <Link href={`/weekend-courses#${course.slug}`}>Learn More</Link>
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
