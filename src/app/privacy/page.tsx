import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy | Sparkfish",
    description: "Privacy policy for Sparkfish LLC users and learners.",
};

export default function PrivacyPage() {
    return (
        <div className="container py-16 max-w-3xl">
            <div className="prose prose-slate dark:prose-invert">
                <h1>Privacy Policy</h1>
                <p>Last updated: October 2026</p>

                <h2>1. Introduction</h2>
                <p>
                    Sparkfish LLC ("we", "our", or "us") respects your privacy and is committed to protecting your personal data.
                    This privacy policy will inform you as to how we look after your personal data when you visit our website
                    and tell you about your privacy rights.
                </p>

                <h2>2. Data We Collect</h2>
                <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:</p>
                <ul>
                    <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier, and title/role.</li>
                    <li><strong>Contact Data:</strong> includes email address, telephone numbers, and organization name.</li>
                    <li><strong>Financial Data:</strong> handled externally by Stripe. We do not store raw credit card numbers.</li>
                    <li><strong>Transaction Data:</strong> includes details about payments and programs you have purchased.</li>
                    <li><strong>Usage Data:</strong> includes information about how you use our website and programs.</li>
                </ul>

                <h2>3. How We Use Your Data</h2>
                <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
                <ul>
                    <li>Where we need to perform the contract we are about to enter into or have entered into with you (e.g., enrolling you in a cohort).</li>
                    <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                    <li>Where we need to comply with a legal or regulatory obligation.</li>
                </ul>

                <h2>4. Data Security</h2>
                <p>
                    We have put in place appropriate security measures to prevent your personal data from being accidentally lost,
                    used or accessed in an unauthorised way, altered or disclosed. We limit access to your personal data to those
                    employees, agents, contractors and other third parties who have a business need to know.
                </p>

                <h2>5. Contact Us</h2>
                <p>If you have any questions about this privacy policy or our privacy practices, please contact us at bfisher3@tulane.edu.</p>
            </div>
        </div>
    );
}
