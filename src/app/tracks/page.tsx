import { createClient } from "@/lib/supabase/server";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Career Tracks | Sparkfish",
    description: "Learn about the specific industry tracks available within our cohorts.",
};

export default async function TracksPage() {
    const supabase = await createClient();

    const { data: tracks, error } = await supabase
        .from("tracks")
        .select("*")
        .order("created_at", { ascending: true });

    if (error) {
        console.error("Error fetching tracks", error);
    }

    return (
        <div className="container py-16 md:py-24 space-y-16 max-w-5xl">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Industry Tracks</h1>
                <p className="text-xl text-muted-foreground">
                    Context matters. Our foundation builds your general AI capacity, while your selected track ensures
                    you learn specific workflows applicable to your daily job.
                </p>
            </div>

            <div className="grid gap-8">
                {tracks?.map((track) => (
                    <div key={track.id} className="rounded-3xl border bg-card p-8 shadow-sm hover:shadow-md transition-shadow">
                        <h2 className="text-2xl font-bold mb-4">{track.title}</h2>
                        <p className="text-lg text-muted-foreground mb-6 max-w-3xl">
                            {track.description}
                        </p>
                        <div className="grid md:grid-cols-2 gap-6 pt-6 border-t">
                            <div>
                                <h3 className="font-semibold mb-3">Key Focus Areas</h3>
                                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                    <li className="flex items-center">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                                        Specialized prompt libraries
                                    </li>
                                    <li className="flex items-center">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                                        Industry compliance and ethics
                                    </li>
                                    <li className="flex items-center">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                                        Departmental deployment strategy
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-3">Who it&apos;s for</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Professionals, managers, and directors working within or alongside this function,
                                    looking to automate repetitive tasks and elevate their strategic output.
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-12 p-8 bg-muted/50 rounded-2xl text-center border">
                <h3 className="font-medium text-lg mb-2">Don't see your specific industry?</h3>
                <p className="text-muted-foreground text-sm mb-0">
                    We recommend the <strong>Business Productivity Track</strong> for general knowledge workers, marketers,
                    sales professionals, and operations leaders. The principles adapt easily to any corporate environment.
                </p>
            </div>
        </div>
    );
}
