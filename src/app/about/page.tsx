import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
    title: "About Us | Sparkfish",
    description: "Learn about Sparkfish LLC and our founder, Blaine Fisher.",
};

export default function AboutPage() {
    return (
        <div className="container py-16 md:py-24 max-w-4xl space-y-12">
            <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">About Sparkfish</h1>
                <p className="text-xl text-muted-foreground">
                    Sparkfish LLC was founded to bridge the gap between AI capabilities and organizational readiness.
                </p>
            </div>

            <div className="prose prose-slate dark:prose-invert max-w-none">
                <p>
                    Artificial intelligence is moving faster than any technology in human history.
                    While the tools are powerful, the true bottleneck for most organizations is not technology—it is
                    adoption, literacy, and strategy.
                </p>
                <p>
                    Sparkfish delivers immersive, cohort-based education programs to professionals and teams.
                    Through weekend courses, 6-Month Accelerators, and 12-Month Fellowships, we equip you with
                    practical skills, ethical frameworks, and the vision to lead AI transformation.
                </p>

                <h2 className="text-2xl font-bold mt-12 mb-4">Meet Our Founder</h2>

                <div className="flex flex-col md:flex-row gap-8 items-start mt-6">
                    <div className="relative rounded-2xl w-full md:w-1/3 aspect-[3/4] overflow-hidden border shadow-sm">
                        <Image
                            src="/blaine_profile.jpg"
                            alt="Blaine Fisher Profile"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 33vw"
                        />
                    </div>
                    <div className="md:w-2/3 space-y-4">
                        <h3 className="text-xl font-bold">Blaine Fisher</h3>
                        <p className="text-muted-foreground">
                            Blaine Fisher is an experienced educator, author, and AI strategy consultant. Through his work at
                            Tulane University and beyond, he has trained thousands of leaders, faculty, and professionals across
                            industries on safe, impactful AI deployment.
                        </p>
                        <p className="text-muted-foreground">
                            He is the author of <em>The AI Human: Navigating a Transformed World</em> and runs the widely-read
                            AI Newsletter. Blaine blends deep technical understanding with an accessible, practical teaching style.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
