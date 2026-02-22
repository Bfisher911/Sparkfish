import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }) {
    const { code } = await params;
    return {
        title: `Verify Certificate ${code} | Sparkfish`,
        description: "Verify a Sparkfish course completion certificate.",
    };
}

export default async function VerifyCertificatePage({ params }: { params: Promise<{ code: string }> }) {
    const { code } = await params;
    const supabase = await createClient();

    const { data: cert, error } = await supabase
        .from("certificates")
        .select(`
      certificate_code, 
      issued_at, 
      pdf_url,
      enrollments (
        profiles (name, organization),
        cohorts (
          programs (title, type)
        ),
        tracks (title)
      )
    `)
        .eq("certificate_code", code)
        .single();

    if (error || !cert) {
        return (
            <div className="container flex items-center justify-center min-vh-100 py-24 text-center">
                <div className="space-y-6 max-w-md">
                    <div className="mx-auto h-24 w-24 rounded-full bg-red-100 flex items-center justify-center mb-6">
                        <svg className="h-12 w-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold">Certificate Not Found</h1>
                    <p className="text-muted-foreground">The certificate code <span className="font-mono">{code}</span> is invalid or does not exist in our system.</p>
                    <Button asChild className="w-full">
                        <Link href="/programs">Return to Home</Link>
                    </Button>
                </div>
            </div>
        );
    }

    const enrollment = cert.enrollments as any;
    const profile = enrollment?.profiles;
    const program = enrollment?.cohorts?.programs;
    const track = enrollment?.tracks;

    return (
        <div className="container flex items-center justify-center min-h-[80vh] py-16">
            <div className="w-full max-w-2xl space-y-8 bg-card p-10 rounded-3xl border shadow-sm text-center">
                <div className="mx-auto h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mb-2">
                    <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-green-700 dark:text-green-500">Verified Authentic</h1>
                    <p className="text-muted-foreground mt-2">This certificate was officially issued by Sparkfish LLC.</p>
                </div>

                <div className="bg-muted/30 border rounded-2xl p-8 text-left space-y-6 flex flex-col items-center">
                    <div className="text-center w-full pb-6 border-b">
                        <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-1">Awarded To</div>
                        <div className="text-2xl font-bold">{profile?.name}</div>
                        {profile?.organization && <div className="text-muted-foreground text-sm mt-1">{profile.organization}</div>}
                    </div>

                    <div className="w-full space-y-4">
                        <div className="grid grid-cols-3 gap-4 border-b pb-4">
                            <span className="text-sm font-medium text-muted-foreground">Program</span>
                            <span className="col-span-2 font-semibold text-right">{program?.title}</span>
                        </div>
                        {track && (
                            <div className="grid grid-cols-3 gap-4 border-b pb-4">
                                <span className="text-sm font-medium text-muted-foreground">Track Focus</span>
                                <span className="col-span-2 font-medium text-right">{track.title}</span>
                            </div>
                        )}
                        <div className="grid grid-cols-3 gap-4 border-b pb-4">
                            <span className="text-sm font-medium text-muted-foreground">Issue Date</span>
                            <span className="col-span-2 font-medium text-right">{new Date(cert.issued_at).toLocaleDateString()}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 items-center">
                            <span className="text-sm font-medium text-muted-foreground">Certificate ID</span>
                            <span className="col-span-2 font-mono text-sm bg-muted px-2 py-1 rounded text-right">{cert.certificate_code}</span>
                        </div>
                    </div>
                </div>

                {cert.pdf_url && (
                    <Button asChild variant="outline" className="mt-4">
                        <a href={cert.pdf_url} target="_blank" rel="noreferrer">
                            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download Original PDF
                        </a>
                    </Button>
                )}
            </div>
        </div>
    );
}
