import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dashboard | Sparkfish",
};

export default async function DashboardPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/signin");
    }

    // Fetch user profile
    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    // Fetch enrollments with related cohort, program, track tracking
    const { data: enrollments, error: enrollError } = await supabase
        .from("enrollments")
        .select(`
      id, 
      status, 
      cohort_id, 
      created_at,
      cohorts (
        title, start_date, schedule_text,
        programs (title, type)
      ),
      certificates (id, certificate_code, pdf_url)
    `)
        .eq("user_id", user.id);

    if (enrollError) {
        console.error("Dashboard fetch error:", enrollError);
    }

    // To fetch Zoom URLs we mapped to a secure Postgres function `get_cohort_zoom_url`
    // We can call it for each enrolled cohort.
    const activeEnrollments = enrollments?.filter(e => e.status === "active") || [];
    const completedEnrollments = enrollments?.filter(e => e.status === "completed") || [];

    const zoomLinks: Record<string, string | null> = {};
    for (const e of activeEnrollments) {
        const { data: zoomUrl } = await supabase.rpc("get_cohort_zoom_url", { target_cohort_id: e.cohort_id });
        zoomLinks[e.cohort_id] = zoomUrl || null;
    }

    return (
        <div className="container py-12 md:py-16 max-w-5xl space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b pb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Welcome, {profile?.name || "Learner"}</h1>
                    <p className="text-muted-foreground mt-1">Manage your active accelerator programs and cohort accesses.</p>
                </div>
                <div className="flex gap-4">
                    {profile?.is_admin && (
                        <Button variant="outline" asChild>
                            <Link href="/admin">Admin Console</Link>
                        </Button>
                    )}
                    <form action="/api/auth/signout" method="POST">
                        <Button variant="secondary" type="submit">Sign Out</Button>
                    </form>
                </div>
            </div>

            <div className="space-y-8">
                <h2 className="text-2xl font-semibold tracking-tight">Active Programs</h2>

                {activeEnrollments.length === 0 ? (
                    <div className="text-center p-12 border bg-muted/40 rounded-2xl">
                        <p className="text-muted-foreground mb-4">You are not currently actively enrolled in any programs.</p>
                        <Button asChild>
                            <Link href="/programs">Browse Programs</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                        {activeEnrollments.map((enrollment: any) => {
                            const cohort = enrollment.cohorts;
                            const program = cohort?.programs;
                            const zoomUrl = zoomLinks[enrollment.cohort_id];

                            return (
                                <div key={enrollment.id} className="rounded-2xl border bg-card p-6 shadow-sm space-y-6">
                                    <div>
                                        <div className="inline-flex rounded-md bg-green-500/10 px-2 py-1 text-xs font-medium text-green-600 dark:text-green-400 mb-3 border border-green-500/20">
                                            Active Enrollment
                                        </div>
                                        <h3 className="text-xl font-bold leading-tight">{program?.title}</h3>
                                        <p className="text-sm font-medium text-muted-foreground mt-1">{cohort?.title}</p>
                                    </div>

                                    <div className="space-y-3 p-4 bg-muted/50 rounded-lg text-sm border">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Schedule:</span>
                                            <span className="font-medium text-right max-w-[200px] leading-tight">{cohort?.schedule_text}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Start Date:</span>
                                            <span className="font-medium">{cohort?.start_date}</span>
                                        </div>
                                    </div>

                                    <div>
                                        {zoomUrl ? (
                                            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" asChild>
                                                <a href={zoomUrl} target="_blank" rel="noreferrer">
                                                    <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M16 16l8 4.093v-16.186l-8 4.093v-8h-16v24h16z" /></svg>
                                                    Join Zoom Session
                                                </a>
                                            </Button>
                                        ) : (
                                            <Button className="w-full" disabled variant="outline">
                                                Zoom Link Pending
                                            </Button>
                                        )}
                                    </div>

                                    <div className="pt-4 border-t">
                                        <h4 className="text-sm font-semibold mb-2">Program Resources</h4>
                                        <p className="text-xs text-muted-foreground">
                                            Placeholder: Drive folders and syllabus links will appear here once the cohort begins.
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {completedEnrollments.length > 0 && (
                <div className="space-y-6 pt-8 border-t">
                    <h2 className="text-2xl font-semibold tracking-tight">Completed & Certificates</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {completedEnrollments.map((enrollment: any) => {
                            const cohort = enrollment.cohorts;
                            const cert = enrollment.certificates?.[0]; // Array because of relation, but 1-to-1 in practice

                            return (
                                <div key={enrollment.id} className="rounded-xl border bg-muted/30 p-6 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-semibold text-lg">{cohort?.programs?.title}</h3>
                                        <p className="text-sm text-muted-foreground">{cohort?.title}</p>
                                    </div>
                                    {cert ? (
                                        <div className="mt-6 flex gap-3">
                                            {cert.pdf_url && (
                                                <Button size="sm" asChild>
                                                    <a href={cert.pdf_url} target="_blank" rel="noreferrer">Download Certificate</a>
                                                </Button>
                                            )}
                                            <Button size="sm" variant="outline" asChild>
                                                <Link href={`/certificate/verify/${cert.certificate_code}`}>Verify</Link>
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="mt-6 text-sm text-slate-500 italic">Certificate processing...</div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
