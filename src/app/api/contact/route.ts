import { NextResponse } from "next/server";
import { Resend } from "resend";

// Very basic in-memory rate limiting map (IP -> timestamp array)
// In production, use Redis or Supabase for this.
const rateLimitMap = new Map<string, number[]>();

export async function POST(req: Request) {
    try {
        const ip = req.headers.get("x-forwarded-for") || "unknown";
        const now = Date.now();
        const windowMs = 60 * 1000; // 1 minute
        const maxRequests = 3;

        let timestamps = rateLimitMap.get(ip) || [];
        timestamps = timestamps.filter(ts => now - ts < windowMs);

        if (timestamps.length >= maxRequests) {
            return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
        }

        timestamps.push(now);
        rateLimitMap.set(ip, timestamps);

        const body = await req.json();

        // Honeypot check
        if (body.b_url && body.b_url !== "") {
            // It's a spam bot filling the hidden field
            return NextResponse.json({ success: true }); // pretend it worked
        }

        const { name, email, organization, track, message } = body;

        if (!name || !email || !message) {
            return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
        }

        if (!process.env.RESEND_API_KEY) {
            console.log("No RESEND_API_KEY found, logging email instead:");
            console.log(`From: ${name} <${email}>`);
            console.log(`Organization: ${organization}`);
            console.log(`Track: ${track}`);
            console.log(`Message: ${message}`);
            return NextResponse.json({ success: true, fakeOut: true });
        }

        const resend = new Resend(process.env.RESEND_API_KEY);

        const { data, error } = await resend.emails.send({
            from: "Sparkfish Contact <onboarding@resend.dev>", // replace with verified domain in production
            to: "Bfisher3@tulane.edu",
            replyTo: email,
            subject: `New Sparkfish Inquiry from ${name}`,
            text: `
Name: ${name}
Email: ${email}
Organization: ${organization || "N/A"}
Track of Interest: ${track || "N/A"}

Message:
${message}
      `,
        });

        if (error) {
            console.error(error);
            return NextResponse.json({ error: "Failed to send email." }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
