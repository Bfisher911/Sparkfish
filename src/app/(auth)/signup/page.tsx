"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const supabase = createClient();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                },
                // We typically would want an email confirmation, but for now allow direct login
                // or tell them to check email if Supabase requires it.
            }
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            if (data?.session) {
                router.push("/dashboard");
                router.refresh();
            } else {
                setMessage("Check your email for the confirmation link to complete registration.");
                setLoading(false);
            }
        }
    };

    return (
        <div className="container flex items-center justify-center py-24">
            <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-2xl border shadow-sm">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight">Create an Account</h1>
                    <p className="text-muted-foreground mt-2">Join Sparkfish and start learning</p>
                </div>

                <form onSubmit={handleSignUp} className="space-y-6">
                    {error && <div className="p-3 text-sm text-red-500 bg-red-500/10 rounded-md">{error}</div>}
                    {message && <div className="p-3 text-sm text-green-600 bg-green-500/10 rounded-md">{message}</div>}

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Full Name</label>
                        <Input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email Address</label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Password</label>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Creating Account..." : "Sign Up"}
                    </Button>
                </form>

                <div className="text-center text-sm text-muted-foreground">
                    Already have an account? <Link href="/signin" className="text-primary hover:underline">Sign In</Link>
                </div>
            </div>
        </div>
    );
}
