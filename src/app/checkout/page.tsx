import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ cohort?: string }> }) {
    const { cohort: cohortId } = await searchParams;
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect(`/signin?redirect=/checkout?cohort=${cohortId}`);
    }

    if (!cohortId) {
        redirect("/programs");
    }

    const { data: cohort, error } = await supabase
        .from("cohorts")
        .select("*, programs(title, description, stripe_price_id)")
        .eq("id", cohortId)
        .single();

    if (error || !cohort) {
        return (
            <div className="container py-24 text-center">
                <h1 className="text-2xl font-bold">Cohort not found</h1>
                <p className="text-muted-foreground mt-2">The cohort you are trying to enroll in does not exist or is fully booked.</p>
            </div>
        );
    }

    const seatsAvailable = cohort.seat_limit - cohort.seats_taken;
    const isFull = seatsAvailable <= 0;

    return (
        <div className="container py-16 max-w-2xl">
            <div className="space-y-8 rounded-2xl border bg-card p-8 shadow-sm">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Complete Enrollment</h1>
                    <p className="text-muted-foreground mt-2">You are registering for:</p>
                </div>

                <div className="space-y-4 p-6 bg-muted/30 rounded-xl border">
                    <div>
                        <div className="text-sm font-medium text-muted-foreground">Program</div>
                        <div className="text-xl font-bold">{cohort.programs?.title}</div>
                    </div>
                    <div>
                        <div className="text-sm font-medium text-muted-foreground">Cohort</div>
                        <div className="font-semibold">{cohort.title}</div>
                        <div className="text-sm mt-1">{cohort.schedule_text}</div>
                    </div>
                    <div className="pt-4 border-t flex justify-between items-center">
                        <span className="text-sm font-medium text-muted-foreground">Status</span>
                        <span className={isFull ? "text-destructive font-medium" : "text-green-600 font-medium"}>
                            {isFull ? "Waitlist Only" : `${seatsAvailable} seats remaining`}
                        </span>
                    </div>
                </div>

                {isFull ? (
                    <div className="text-center p-4 bg-red-50 dark:bg-red-950/20 text-red-600 rounded-lg">
                        This cohort is currently full. Please browse our other programs.
                    </div>
                ) : (
                    <form action="/api/stripe/checkout" method="POST">
                        <input type="hidden" name="cohort_id" value={cohort.id} />
                        <input type="hidden" name="user_id" value={user.id} />
                        <Button type="submit" size="lg" className="w-full h-12 text-lg">
                            Proceed to Payment
                        </Button>
                        <p className="text-xs text-center text-muted-foreground mt-4">
                            You will be redirected to Stripe's secure checkout.
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
}
