import { createAdminClient, createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata = {
    title: "Admin Console | Sparkfish",
};

export default async function AdminPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/signin");
    }

    const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();

    if (!profile?.is_admin) {
        redirect("/dashboard");
    }

    // Fetch Admin Data safely using admin client if needed, or normal client since RLS allows admin access
    const adminClient = await createAdminClient();

    const { data: programs } = await adminClient.from("programs").select("*").order("created_at", { ascending: false });
    const { data: cohorts } = await adminClient.from("cohorts").select("*, programs(title)").order("start_date", { ascending: false });
    const { data: enrollments } = await adminClient.from("enrollments").select("*, profiles(name, email), cohorts(title)").order("created_at", { ascending: false });
    const { data: tracks } = await adminClient.from("tracks").select("*");

    return (
        <div className="container py-12 md:py-16 space-y-8 max-w-7xl">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Admin Console</h1>
                <p className="text-muted-foreground mt-1">Manage all Sparkfish platform data, programs, and learners.</p>
            </div>

            <Tabs defaultValue="cohorts" className="space-y-6">
                <TabsList className="grid w-full max-w-md grid-cols-4">
                    <TabsTrigger value="cohorts">Cohorts</TabsTrigger>
                    <TabsTrigger value="programs">Programs</TabsTrigger>
                    <TabsTrigger value="enrollments">Enrollments</TabsTrigger>
                    <TabsTrigger value="tracks">Tracks</TabsTrigger>
                </TabsList>

                <TabsContent value="cohorts">
                    <div className="rounded-md border bg-card">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h2 className="text-xl font-semibold">Active Cohorts</h2>
                            <Button size="sm">Create Cohort</Button>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Program</TableHead>
                                    <TableHead>Start Date</TableHead>
                                    <TableHead>Seats</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {cohorts?.map((c) => (
                                    <TableRow key={c.id}>
                                        <TableCell className="font-medium">{c.title}</TableCell>
                                        <TableCell>{c.programs?.title}</TableCell>
                                        <TableCell>{new Date(c.start_date).toLocaleDateString()}</TableCell>
                                        <TableCell>{c.seats_taken} / {c.seat_limit}</TableCell>
                                        <TableCell>
                                            {c.active ? (
                                                <Badge variant="default" className="bg-green-500/10 text-green-600 hover:bg-green-500/20 shadow-none border-green-500/20">Active</Badge>
                                            ) : (
                                                <Badge variant="secondary">Inactive</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="sm">Edit</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {cohorts?.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center text-muted-foreground">No cohorts found.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                <TabsContent value="programs">
                    <div className="rounded-md border bg-card">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h2 className="text-xl font-semibold">Programs Overview</h2>
                            <Button size="sm">Create Program</Button>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Stripe Price ID</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {programs?.map((p) => (
                                    <TableRow key={p.id}>
                                        <TableCell className="font-medium">{p.title}</TableCell>
                                        <TableCell className="capitalize">{p.type.replace("_", " ")}</TableCell>
                                        <TableCell className="font-mono text-xs text-muted-foreground">{p.stripe_price_id || "None set"}</TableCell>
                                        <TableCell>
                                            {p.active ? (
                                                <Badge variant="default" className="bg-green-500/10 text-green-600 hover:bg-green-500/20 shadow-none border-green-500/20">Active</Badge>
                                            ) : (
                                                <Badge variant="secondary">Inactive</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="sm">Edit</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                <TabsContent value="enrollments">
                    <div className="rounded-md border bg-card">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h2 className="text-xl font-semibold">Student Enrollments</h2>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Learner</TableHead>
                                    <TableHead>Cohort</TableHead>
                                    <TableHead>Enrolled At</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {enrollments?.map((e) => (
                                    <TableRow key={e.id}>
                                        <TableCell>
                                            <div className="font-medium">{e.profiles?.name}</div>
                                            <div className="text-xs text-muted-foreground">{e.profiles?.email}</div>
                                        </TableCell>
                                        <TableCell>{e.cohorts?.title}</TableCell>
                                        <TableCell>{new Date(e.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            {e.status === "active" ? (
                                                <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">Active</Badge>
                                            ) : e.status === "completed" ? (
                                                <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Completed</Badge>
                                            ) : (
                                                <Badge variant="secondary">Cancelled</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                {e.status === "active" && <Button variant="outline" size="sm">Mark Completed</Button>}
                                                <Button variant="ghost" size="sm">Details</Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                <TabsContent value="tracks">
                    <div className="rounded-md border bg-card">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h2 className="text-xl font-semibold">Industry Tracks</h2>
                            <Button size="sm">Add Track</Button>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Slug</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tracks?.map((t) => (
                                    <TableRow key={t.id}>
                                        <TableCell className="font-medium">{t.title}</TableCell>
                                        <TableCell className="font-mono text-xs">{t.slug}</TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="sm">Edit</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
