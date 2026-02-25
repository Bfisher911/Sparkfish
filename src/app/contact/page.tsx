"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setStatus("loading");
        setErrorMessage("");

        const formData = new FormData(e.currentTarget);

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                body: JSON.stringify(Object.fromEntries(formData)),
                headers: { "Content-Type": "application/json" },
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to send message");
            }

            setStatus("success");
            (e.target as HTMLFormElement).reset();
        } catch (err: any) {
            setStatus("error");
            setErrorMessage(err.message);
        }
    }

    return (
        <div className="container py-16 md:py-24 max-w-6xl">
            <div className="grid md:grid-cols-2 gap-16">
                {/* Form Column */}
                <div className="space-y-8">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight">Get in Touch</h1>
                        <p className="text-muted-foreground mt-4 text-lg">
                            Interested in custom corporate training, speaking engagements, or learning about our programs? Let us know how we can help.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 bg-card p-8 rounded-2xl border shadow-sm">
                        {status === "success" && (
                            <div className="p-4 bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-400 rounded-lg border border-green-200 dark:border-green-900">
                                Message sent successfully! We will get back to you shortly.
                            </div>
                        )}

                        {status === "error" && (
                            <div className="p-4 bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-900">
                                {errorMessage}
                            </div>
                        )}

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium">Name</label>
                                <Input id="name" name="name" required placeholder="John Doe" />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium">Email</label>
                                <Input id="email" name="email" type="email" required placeholder="john@example.com" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="organization" className="text-sm font-medium">Organization</label>
                            <Input id="organization" name="organization" required placeholder="Company or University name" />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="track" className="text-sm font-medium">Track of Interest (Optional)</label>
                            <Input id="track" name="track" placeholder="e.g. Healthcare, Education, Business Productivity" />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="message" className="text-sm font-medium">Message</label>
                            <Textarea id="message" name="message" required rows={5} placeholder="How can we assist you?" />
                        </div>

                        {/* Honeypot field */}
                        <div className="hidden" aria-hidden="true">
                            <input type="text" name="b_url" tabIndex={-1} autoComplete="off" />
                        </div>

                        <Button type="submit" className="w-full" disabled={status === "loading"}>
                            {status === "loading" ? "Sending..." : "Send Message"}
                        </Button>
                    </form>
                </div>

                {/* Bookings Column */}
                <div className="space-y-8">
                    <div>
                        <h2 className="text-2xl font-bold">Book a Strategy Call</h2>
                        <p className="text-muted-foreground mt-2">
                            Prefer to speak directly? Select a time on Blaine's calendar below.
                        </p>
                    </div>

                    <div className="rounded-2xl border overflow-hidden bg-card h-[600px] relative">
                        <iframe
                            src="https://outlook.office.com/bookwithme/user/82c5edc29d764a0e8d6cbb1662f1ceec@tulane.edu?anonymous&ismsaljsauthenabled&ep=plink"
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            className="absolute inset-0 z-10 bg-white"
                            title="Microsoft Bookings"
                        />
                        {/* Fallback while loading */}
                        <div className="absolute inset-0 flex items-center justify-center p-8 text-center bg-slate-50 dark:bg-slate-900 border">
                            <div className="space-y-4">
                                <p className="text-muted-foreground">If the calendar widget fails to load:</p>
                                <Button asChild>
                                    <a href="https://outlook.office.com/bookwithme/user/82c5edc29d764a0e8d6cbb1662f1ceec@tulane.edu?anonymous&ismsaljsauthenabled&ep=plink" target="_blank" rel="noreferrer">
                                        Open Calendar in New Tab
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
