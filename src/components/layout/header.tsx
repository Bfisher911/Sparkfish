import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                    <Image src="/logo.png" alt="Sparkfish Logo" width={32} height={32} className="object-contain" />
                    <span className="font-bold inline-block text-xl tracking-tight text-primary">Spark<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F24405] to-orange-400">fish</span></span>
                </Link>
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                    <Link href="/programs" className="transition-colors hover:text-foreground/80 text-foreground/60">Programs</Link>
                    <Link href="/tracks" className="transition-colors hover:text-foreground/80 text-foreground/60">Tracks</Link>
                    <Link href="/weekend-courses" className="transition-colors hover:text-foreground/80 text-foreground/60">Weekend Courses</Link>
                    <Link href="/speaking" className="transition-colors hover:text-foreground/80 text-foreground/60">Speaking</Link>
                    <Link href="/about" className="transition-colors hover:text-foreground/80 text-foreground/60">About</Link>
                    <Link href="/contact" className="transition-colors hover:text-foreground/80 text-foreground/60">Contact</Link>
                </nav>
                <div className="flex items-center gap-4">
                    <Link href="/signin" className="text-sm font-medium transition-colors hover:text-primary">Sign in</Link>
                    <div className="hidden sm:flex gap-2">
                        <Button asChild variant="outline">
                            <Link href="/contact">Book a Call</Link>
                        </Button>
                        <Button asChild>
                            <Link href="/programs">View Programs</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
}
