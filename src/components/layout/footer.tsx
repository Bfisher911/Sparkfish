import Link from "next/link";
import Image from "next/image";

export function Footer() {
    return (
        <footer className="border-t py-12 bg-muted/40">
            <div className="container grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Image src="/logo.png" alt="Sparkfish Logo" width={32} height={32} className="object-contain opacity-80" />
                        <div className="font-bold text-lg tracking-tight">Spark<span className="text-muted-foreground">fish</span></div>
                    </div>
                    <p className="text-sm text-muted-foreground max-w-xs">
                        Equipping professionals and organizations with practical AI skills through expert-led cohort programs.
                    </p>
                </div>

                <div>
                    <h3 className="font-medium mb-4">Programs</h3>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                        <li><Link href="/programs/six-month" className="hover:text-foreground transition-colors">6-Month Accelerator</Link></li>
                        <li><Link href="/programs/twelve-month" className="hover:text-foreground transition-colors">12-Month Fellowship</Link></li>
                        <li><Link href="/weekend-courses" className="hover:text-foreground transition-colors">Weekend Courses</Link></li>
                        <li><Link href="/tracks" className="hover:text-foreground transition-colors">Career Tracks</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-medium mb-4">Company</h3>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                        <li><Link href="/about" className="hover:text-foreground transition-colors">About Workspace</Link></li>
                        <li><Link href="/speaking" className="hover:text-foreground transition-colors">Speaking & Clients</Link></li>
                        <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact Us</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-medium mb-4">Connect</h3>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                        <li><a href="https://BlaineFisher.com" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">BlaineFisher.com</a></li>
                        <li><a href="https://www.linkedin.com/in/blaine-fisher/" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">LinkedIn</a></li>
                        <li><a href="https://www.linkedin.com/build-relation/newsletter-follow?entityUrn=7257851677544710145" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">AI Newsletter</a></li>
                        <li><a href="https://www.amazon.com/AI-Human-Navigating-Transformed-World-ebook/dp/B0FQFPPJBT" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">The AI Human (Book)</a></li>
                    </ul>
                </div>
            </div>

            <div className="container mt-12 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
                <p>© {new Date().getFullYear()} Sparkfish LLC. All rights reserved.</p>
                <div className="flex gap-4">
                    <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
                    <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
                </div>
            </div>
        </footer>
    );
}
