import { Resend } from "resend";

export const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendRegistrationConfirmation(email: string, name: string, programName: string, zoomUrl?: string) {
    if (!resend) {
        console.log(`[Email Mock] Registration Confirmation to ${email} for ${programName}. Zoom: ${zoomUrl}`);
        return;
    }

    const zoomText = zoomUrl ? `Your cohort Zoom link is: ${zoomUrl}\nPlease keep this link secure.` : `Your Zoom link will be posted in your learner dashboard prior to the start date.`;

    await resend.emails.send({
        from: "Sparkfish <onboarding@resend.dev>", // replace with verified domain
        to: email,
        subject: `You're Enrolled: ${programName}`,
        text: `
Hi ${name},

Thank you for enrolling in ${programName}!

We are thrilled to welcome you to the cohort.

ACCESS INSTRUCTIONS:
Access your dashboard at: https://sparkfish.app/dashboard
${zoomText}

If you have any questions, please reply to this email.

Best,
Blaine Fisher
Sparkfish LLC
    `
    });
}

export async function sendCertificateNotification(email: string, name: string, programName: string, certificateUrl: string) {
    if (!resend) {
        console.log(`[Email Mock] Certificate Notification to ${email} for ${programName}. Cert: ${certificateUrl}`);
        return;
    }

    await resend.emails.send({
        from: "Sparkfish <onboarding@resend.dev>",
        to: email,
        subject: `Your Certificate for ${programName} is Ready`,
        text: `
Hi ${name},

Congratulations on completing ${programName}!

Your certificate of completion has been generated and is now available.

You can view and verify your certificate here:
${certificateUrl}

You can also download a PDF copy directly from your learner dashboard.

Best,
Sparkfish Team
    `
    });
}
