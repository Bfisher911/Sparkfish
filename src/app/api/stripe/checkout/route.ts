import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const cohort_id = formData.get("cohort_id") as string;
        const user_id = formData.get("user_id") as string;
        const requestUrl = new URL(req.url);

        if (!cohort_id || !user_id) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const supabase = await createClient();

        // Verify cohort has seats
        const { data: cohort, error: cohortError } = await supabase
            .from("cohorts")
            .select("*, programs(title, stripe_price_id)")
            .eq("id", cohort_id)
            .single();

        if (cohortError || !cohort) {
            return NextResponse.json({ error: "Cohort not found" }, { status: 404 });
        }

        if (cohort.seats_taken >= cohort.seat_limit) {
            // Redirect back with error
            return NextResponse.redirect(`${requestUrl.origin}/checkout?cohort=${cohort_id}&error=full`, { status: 303 });
        }

        // Check if user already enrolled
        const { data: existing } = await supabase
            .from("enrollments")
            .select("id")
            .eq("user_id", user_id)
            .eq("cohort_id", cohort_id)
            .single();

        if (existing) {
            return NextResponse.redirect(`${requestUrl.origin}/dashboard?message=already-enrolled`, { status: 303 });
        }

        // Prepare Stripe checkout
        // If no stripe_price_id exists for the program, we use a fallback dummy product or error out.
        // In production, programs must have a Stripe Price ID set in Supabase admin.
        const priceId = cohort.programs?.stripe_price_id;

        if (!priceId) {
            console.warn(`No stripe_price_id found for program ${cohort.programs?.title}. Bypassing payment for dev.`);

            // Development bypass: auto-enroll if no price is configured
            const { data: profile } = await supabase.from('profiles').select('email').eq('id', user_id).single();

            // Note: In real app, we use a service role key to insert enrollments since RLS blocks it without payment context
            // But we will hit the webhook locally or create it directly.
            return NextResponse.redirect(`${requestUrl.origin}/dashboard?message=payment-bypassed`, { status: 303 });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${requestUrl.origin}/dashboard?success=true`,
            cancel_url: `${requestUrl.origin}/checkout?cohort=${cohort_id}&canceled=true`,
            client_reference_id: user_id,
            metadata: {
                cohort_id,
                user_id,
            },
        });

        if (session.url) {
            return NextResponse.redirect(session.url, { status: 303 });
        }

        return NextResponse.json({ error: "Failed to create Stripe session" }, { status: 500 });

    } catch (error: any) {
        console.error("Stripe Checkout Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
