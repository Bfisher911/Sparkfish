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
                            Prefer to speak directly? Select a time on Blaine's calendar to discuss your needs.
                        </p>
                    </div>

                    <div className="rounded-2xl border p-8 bg-card flex flex-col items-center text-center space-y-6 shadow-sm h-full justify-center min-h-[400px]">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
                        </div>
                        <div>
                            <h3 className="text-xl font-medium mb-2">Schedule via Microsoft Bookings</h3>
                            <p className="text-muted-foreground max-w-sm mx-auto">
                                View available times and schedule a strategy call directly on Blaine's calendar.
                            </p>
                        </div>
                        <Button asChild size="lg" className="w-full sm:w-auto">
                            <a href="https://outlook.office.com/bookwithme/user/82c5edc29d764a0e8d6cbb1662f1ceec@tulane.edu?anonymous&ismsaljsauthenabled&ep=plink" target="_blank" rel="noreferrer">
                                Open Calendar
                            </a>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
