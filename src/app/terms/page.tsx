import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service | Sparkfish",
    description: "Terms of service for Sparkfish LLC users and learners.",
};

export default function TermsPage() {
    return (
        <div className="container py-16 max-w-3xl">
            <div className="prose prose-slate dark:prose-invert">
                <h1>Terms of Service</h1>
                <p>Last updated: October 2026</p>

                <h2>1. Agreement to Terms</h2>
                <p>
                    By accessing our website and enrolling in our programs, you agree to be bound by these Terms of Service.
                    If you disagree with any part of these terms, you may not access our services.
                </p>

                <h2>2. Program Enrollment and Payments</h2>
                <p>
                    When you enroll in a Sparkfish cohort, you agree to provide complete and accurate information.
                    Payment is required in full (or via approved installment plans) before cohort access is granted.
                    All payments are processed securely via Stripe.
                </p>

                <h2>3. Intellectual Property</h2>
                <p>
                    The content, organization, graphics, design, compilation, magnetic translation, digital conversion and other
                    matters related to the Site and our Programs are protected under applicable copyrights, trademarks and other proprietary laws.
                    The copying, redistribution, use or publication by you of any such matters or any part of the Site is strictly prohibited.
                </p>

                <h2>4. User Conduct</h2>
                <p>
                    You agree to use our programs and dashboard only for lawful purposes. You must not:
                </p>
                <ul>
                    <li>Share your account credentials or Zoom links with unauthorized parties.</li>
                    <li>Distribute course materials without explicit permission.</li>
                    <li>Engage in harassing or disruptive behavior during live cohort sessions.</li>
                </ul>

                <h2>5. Limitation of Liability</h2>
                <p>
                    Sparkfish LLC shall not be liable for any indirect, incidental, special, consequential or punitive damages,
                    or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use,
                    goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the services.
                </p>

                <h2>6. Changes to Terms</h2>
                <p>
                    We reserve the right, at our sole discretion, to modify or replace these Terms at any time.
                    By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
                </p>
            </div>
        </div>
    );
}
