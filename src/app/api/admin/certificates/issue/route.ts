import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { generateCertificatePDF } from "@/lib/pdf";
import { sendCertificateNotification } from "@/lib/email";
import crypto from 'crypto';

export async function POST(req: Request) {
    try {
        const supabase = await createAdminClient();

        // Auth check to ensure only admins can issue certificates
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
        if (!profile?.is_admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        const { enrollment_id } = await req.json();
        if (!enrollment_id) return NextResponse.json({ error: "Missing enrollment_id" }, { status: 400 });

        // Fetch details
        const { data: enrollment, error } = await supabase
            .from("enrollments")
            .select(`
        id, user_id, status,
        profiles (name, email),
        cohorts (programs (title), end_date),
        tracks (title)
      `)
            .eq("id", enrollment_id)
            .single();

        if (error || !enrollment) {
            return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });
        }

        if (enrollment.status !== "completed") {
            // Auto-update to complete if issuing certificate
            await supabase.from("enrollments").update({ status: "completed" }).eq("id", enrollment_id);
        }

        // Check if already has a cert
        const { data: existingCert } = await supabase.from("certificates").select("id").eq("enrollment_id", enrollment_id).single();
        if (existingCert) {
            return NextResponse.json({ error: "Certificate already exists for this enrollment" }, { status: 400 });
        }

        // Generate PDF
        const code = crypto.randomBytes(4).toString('hex').toUpperCase(); // e.g., 8A2B9C1D
        const dateFormatted = new Date().toLocaleDateString();

        const e = enrollment as any;
        const pdfBuffer = await generateCertificatePDF(
            e.profiles?.name || "Student",
            e.cohorts?.programs?.title || "Program",
            e.tracks?.title,
            dateFormatted,
            code
        );

        // Upload to Supabase Storage (assuming 'certificates' bucket exists, if not, it will fail, 
        // so we handle it gracefully or skip URL for dev)
        const filePath = `certificates/${code}.pdf`;
        let pdfUrl = "";

        // Create bucket via Postgres isn't directly possible via API without specific setup, 
        // but we'll attempt upload and fallback to no URL if bucket missing.
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from("certificates")
            .upload(filePath, pdfBuffer, { contentType: "application/pdf", upsert: true });

        if (!uploadError) {
            const { data: publicUrlData } = supabase.storage.from("certificates").getPublicUrl(filePath);
            pdfUrl = publicUrlData.publicUrl;
        } else {
            console.warn("Could not upload PDF to Supabase Storage. Is the 'certificates' bucket created? Error:", uploadError.message);
        }

        // Save metadata in DB
        const { error: insertError } = await supabase.from("certificates").insert({
            enrollment_id: enrollment_id,
            certificate_code: code,
            pdf_url: pdfUrl || null,
            completion_date: new Date().toISOString().split('T')[0],
        });

        if (insertError) {
            throw insertError;
        }

        // Notify User
        const email = e.profiles?.email;
        // Real email from auth.users required
        const { data: authUser } = await supabase.auth.admin.getUserById(enrollment.user_id);
        const actualEmail = authUser?.user?.email;

        if (actualEmail) {
            const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://sparkfish.app'}/certificate/verify/${code}`;
            await sendCertificateNotification(actualEmail, e.profiles?.name || "Student", e.cohorts?.programs?.title || "Program", verifyUrl);
        }

        return NextResponse.json({ success: true, code, pdfUrl });

    } catch (err: any) {
        console.error("Issue Certificate Error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
