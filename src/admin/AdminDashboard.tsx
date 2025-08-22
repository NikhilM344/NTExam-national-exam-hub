// src/admin/AdminDashboard.tsx
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Eye,
  RefreshCcw,
  CheckCircle2,
  XCircle,
  Printer,
  CalendarDays,
  MapPin,
  Settings2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

/* ---------- Types ---------- */
type Registration = {
  id: string;
  created_at?: string;
  full_name?: string;
  email?: string;
  class_grade?: string;
  is_paid?: boolean;
  exam_date?: string | null;
  exam_center?: string | null;
  subjects?: string[] | null;

  // personal
  date_of_birth?: string | null;
  gender?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  postal_code?: string | null;
  contact_number?: string | null;

  // school
  school_name?: string | null;
  school_address?: string | null;
  school_city?: string | null;
  school_state?: string | null;
  school_postal_code?: string | null;

  // parent
  parent_name?: string | null;
  parent_contact_number?: string | null;
  parent_email?: string | null;

  terms_accepted?: boolean | null;
};

type ResultRow = {
  id: string;
  registration_id: string;
  score?: number | null;
  total?: number | null;
  percentage?: number | null;
  rank?: number | null;
  published_at?: string | null;
};

export default function AdminDashboard() {
  const { toast } = useToast();

  // pulled from localStorage (set during admin login)
  const admin = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("adminSession") || "{}");
    } catch {
      return {};
    }
  }, []);

  /* ---------- State ---------- */
  const [loadingRegs, setLoadingRegs] = useState(false);
  const [regs, setRegs] = useState<Registration[]>([]);
  const [search, setSearch] = useState("");

  const [detailOpen, setDetailOpen] = useState(false);
  const [selected, setSelected] = useState<Registration | null>(null);

  const [resLoading, setResLoading] = useState(false);
  const [results, setResults] = useState<ResultRow[]>([]);

  // per-row "Set exam" dialog
  const [examOpen, setExamOpen] = useState(false);
  const [examForm, setExamForm] = useState<{ date: string; center: string }>({
    date: "",
    center: "",
  });

  // bulk exam setup
  const [bulk, setBulk] = useState<{ classGrade: string; date: string; center: string }>(
    {
      classGrade: "",
      date: "",
      center: "",
    }
  );

  /* ---------- Fetchers ---------- */
  const loadRegistrations = async () => {
    setLoadingRegs(true);
    try {
      const { data, error } = await supabase.from("registrations").select("*");
      if (error) throw error;
      setRegs(Array.isArray(data) ? (data as Registration[]) : []);
    } catch (e: any) {
      toast({
        title: "Failed to load registrations",
        description: e?.message || "Unknown error",
        variant: "destructive",
      });
    } finally {
      setLoadingRegs(false);
    }
  };

  const loadResults = async () => {
    setResLoading(true);
    try {
      const { data, error } = await supabase.from("exam_results").select("*");
      if (error) throw error;
      setResults(Array.isArray(data) ? (data as ResultRow[]) : []);
    } catch {
      // ignore if table not created yet
    } finally {
      setResLoading(false);
    }
  };

  useEffect(() => {
    loadRegistrations();
    loadResults();
  }, []);

  /* ---------- Derived ---------- */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return regs;
    return regs.filter((r) => {
      const hay =
        `${r.full_name || ""} ${r.email || ""} ${r.class_grade || ""} ${r.school_name || ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [regs, search]);

  const resultByReg = useMemo(() => {
    const map = new Map<string, ResultRow>();
    results.forEach((r) => map.set(r.registration_id, r));
    return map;
  }, [results]);

  /* ---------- Helpers / Actions ---------- */
  const viewDetails = (r: Registration) => {
    setSelected(r);
    setDetailOpen(true);
  };

  const openSetExamDialog = (r: Registration) => {
    setSelected(r);
    setExamForm({
      date: r.exam_date || "",
      center: r.exam_center || "",
    });
    setExamOpen(true);
  };

  const saveExamForOne = async () => {
    if (!selected) return;
    if (!examForm.date || !examForm.center) {
      toast({
        title: "Missing fields",
        description: "Date and center are required.",
        variant: "destructive",
      });
      return;
    }
    try {
      const { error } = await supabase
        .from("registrations")
        .update({
          exam_date: examForm.date,
          exam_center: examForm.center,
        })
        .eq("id", selected.id);
      if (error) throw error;
      toast({
        title: "Exam info saved",
        description: `Updated ${selected.full_name || "student"}.`,
      });
      setExamOpen(false);
      loadRegistrations();
    } catch (e: any) {
      toast({ title: "Failed to update", description: e?.message, variant: "destructive" });
    }
  };

  const applyExamBulk = async () => {
    if (!bulk.classGrade || !bulk.date || !bulk.center) {
      toast({
        title: "Missing fields",
        description: "Class, date and center are required.",
        variant: "destructive",
      });
      return;
    }
    try {
      const { error } = await supabase
        .from("registrations")
        .update({ exam_date: bulk.date, exam_center: bulk.center })
        .eq("class_grade", bulk.classGrade);
      if (error) throw error;
      toast({ title: "Exam assigned", description: `Applied to class ${bulk.classGrade}.` });
      loadRegistrations();
    } catch (e: any) {
      toast({ title: "Failed to apply exam", description: e?.message, variant: "destructive" });
    }
  };

  const generateCertificate = (r: Registration, res?: ResultRow) => {
    const win = window.open("", "_blank", "noopener,noreferrer,width=800,height=600");
    if (!win) return;
    const today = new Date().toLocaleDateString();
    const percentage =
      res?.percentage ?? (res?.score && res?.total ? ((res.score / res.total) * 100).toFixed(2) : "—");
    win.document.write(`<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><title>Certificate - ${r.full_name || "Student"}</title>
<style>
  body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; padding: 40px; background: #f7f7fb; }
  .cert { background: white; border: 2px solid #111827; padding: 32px; max-width: 700px; margin: 0 auto; text-align:center; }
  .head { font-size: 24px; font-weight: 800; margin-bottom: 8px; }
  .sub { color: #4b5563; margin-bottom: 24px; }
  .name { font-size: 28px; font-weight: 700; margin: 16px 0; }
  .meta { color: #374151; margin: 8px 0; }
  .footer { margin-top: 32px; color: #6b7280; font-size: 14px; }
  .badge { display: inline-block; padding: 4px 10px; border: 1px solid #111827; border-radius: 9999px; font-size: 12px; }
</style></head>
<body>
  <div class="cert">
    <div class="head">Certificate of Participation</div>
    <div class="sub">This certifies that</div>
    <div class="name">${r.full_name || "-"}</div>
    <div class="sub">has successfully participated in</div>
    <div class="name">NTExam (Navoday Talent Exam)</div>
    <div class="meta">Class: ${r.class_grade || "—"} · Exam Date: ${r.exam_date || "—"}</div>
    <div class="meta">Score: ${res?.score ?? "—"} / ${res?.total ?? "—"} · Percentage: ${percentage}% · Rank: ${res?.rank ?? "—"}</div>
    <div class="footer">Issued on ${today}. <span class="badge">Verified</span></div>
  </div>
  <script>window.print();</script>
</body></html>`);
    win.document.close();
  };

  /* ---------- UI ---------- */
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome <strong>{admin?.name || admin?.email || "admin"}</strong>
            {admin?.role ? ` (${admin.role})` : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => {
              localStorage.removeItem("adminSession");
              window.location.href = "/login";
            }}
          >
            Logout
          </Button>
        </div>
      </div>

      <Tabs defaultValue="registrations" className="space-y-6">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="registrations">Registrations</TabsTrigger>
          <TabsTrigger value="exam-setup">Exam Setup</TabsTrigger>
          <TabsTrigger value="results">Results & Certificates</TabsTrigger>
        </TabsList>

        {/* --- Registrations Tab --- */}
        <TabsContent value="registrations" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <CardTitle>Registrations</CardTitle>
              <div className="flex flex-wrap items-center gap-2">
                <Input
                  placeholder="Search by name, email, class…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-64"
                />
                <Button variant="outline" onClick={loadRegistrations}>
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loadingRegs ? (
                <div className="py-10 text-center text-muted-foreground">Loading…</div>
              ) : filtered.length === 0 ? (
                <div className="py-10 text-center text-muted-foreground">No registrations found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-left border-b">
                      <tr>
                        <th className="py-2 pr-4">Student</th>
                        <th className="py-2 pr-4">Email</th>
                        <th className="py-2 pr-4">Class</th>
                        <th className="py-2 pr-4">Paid</th>
                        <th className="py-2 pr-4">Exam</th>
                        <th className="py-2 pr-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((r) => {
                        const res = resultByReg.get(r.id);
                        return (
                          <tr key={r.id} className="border-b last:border-b-0">
                            <td className="py-3 pr-4">{r.full_name || "-"}</td>
                            <td className="py-3 pr-4">{r.email || "-"}</td>
                            <td className="py-3 pr-4">{r.class_grade || "-"}</td>
                            <td className="py-3 pr-4">
                              {r.is_paid ? (
                                <Badge className="bg-green-600/10 text-green-700">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Paid
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="bg-red-600/10 text-red-700">
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Unpaid
                                </Badge>
                              )}
                            </td>
                            <td className="py-3 pr-4">
                              <div className="text-xs">
                                <div>
                                  <b>Date:</b> {r.exam_date || "—"}
                                </div>
                                <div>
                                  <b>Center:</b> {r.exam_center || "—"}
                                </div>
                              </div>
                            </td>
                            <td className="py-3 pr-4">
                              <div className="flex flex-wrap gap-2">
                                <Button size="sm" variant="outline" onClick={() => viewDetails(r)}>
                                  <Eye className="h-4 w-4 mr-1" /> View
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => openSetExamDialog(r)}>
                                  <Settings2 className="h-4 w-4 mr-1" /> Set Exam
                                </Button>
                                <Button size="sm" onClick={() => generateCertificate(r, res)} disabled={!res}>
                                  <Printer className="h-4 w-4 mr-1" /> Certificate
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- Exam Setup (bulk) --- */}
        <TabsContent value="exam-setup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings2 className="h-5 w-5" />
                Assign Exam (Bulk by Class)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input
                  placeholder="Class Grade (e.g. 6, 7, 8...)"
                  value={bulk.classGrade}
                  onChange={(e) => setBulk((s) => ({ ...s, classGrade: e.target.value }))}
                />
                <Input
                  type="date"
                  value={bulk.date}
                  onChange={(e) => setBulk((s) => ({ ...s, date: e.target.value }))}
                />
                <Input
                  placeholder="Exam Center"
                  value={bulk.center}
                  onChange={(e) => setBulk((s) => ({ ...s, center: e.target.value }))}
                />
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={applyExamBulk}>
                  <CalendarDays className="h-4 w-4 mr-2" />
                  Apply to Class
                </Button>
                <Button variant="outline" onClick={loadRegistrations}>
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  Refresh Registrations
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                This updates <b>all</b> registrations where <b>class_grade</b> equals the value you enter.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- Results Tab --- */}
        <TabsContent value="results" className="space-y-4">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Results & Certificates</CardTitle>
              <Button variant="outline" onClick={loadResults}>
                <RefreshCcw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </CardHeader>
            <CardContent>
              {resLoading ? (
                <div className="py-8 text-center text-muted-foreground">Loading…</div>
              ) : results.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">No results yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-left border-b">
                      <tr>
                        <th className="py-2 pr-4">Student</th>
                        <th className="py-2 pr-4">Email</th>
                        <th className="py-2 pr-4">Score</th>
                        <th className="py-2 pr-4">%</th>
                        <th className="py-2 pr-4">Rank</th>
                        <th className="py-2 pr-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((r) => {
                        const reg = regs.find((x) => x.id === r.registration_id);
                        return (
                          <tr key={r.id} className="border-b last:border-b-0">
                            <td className="py-3 pr-4">{reg?.full_name || r.registration_id}</td>
                            <td className="py-3 pr-4">{reg?.email || "—"}</td>
                            <td className="py-3 pr-4">
                              {r.score ?? "—"} / {r.total ?? "—"}
                            </td>
                            <td className="py-3 pr-4">{r.percentage ?? "—"}</td>
                            <td className="py-3 pr-4">{r.rank ?? "—"}</td>
                            <td className="py-3 pr-4">
                              <Button size="sm" onClick={() => generateCertificate(reg || ({} as any), r)}>
                                <Printer className="h-4 w-4 mr-1" />
                                Generate Certificate
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* --- Student Details Dialog --- */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
          </DialogHeader>
          {selected ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="rounded-md border p-3">
                <div className="font-semibold mb-2">Personal</div>
                <div><b>Name:</b> {selected.full_name || "—"}</div>
                <div><b>Email:</b> {selected.email || "—"}</div>
                <div><b>Phone:</b> {selected.contact_number || "—"}</div>
                <div><b>DOB:</b> {selected.date_of_birth || "—"}</div>
                <div><b>Gender:</b> {selected.gender || "—"}</div>
                <div><b>Address:</b> {selected.address || "—"}</div>
                <div><b>City/State:</b> {selected.city || "—"}/{selected.state || "—"}</div>
                <div><b>Postal Code:</b> {selected.postal_code || "—"}</div>
              </div>

              <div className="rounded-md border p-3">
                <div className="font-semibold mb-2">School / Exam</div>
                <div><b>School:</b> {selected.school_name || "—"}</div>
                <div><b>Class:</b> {selected.class_grade || "—"}</div>
                <div><b>Exam Date:</b> {selected.exam_date || "—"}</div>
                <div><b>Center:</b> {selected.exam_center || "—"}</div>
                <div><b>Subjects:</b> {(selected.subjects || []).join(", ") || "—"}</div>
                <div className="mt-2">
                  {selected.is_paid ? (
                    <Badge className="bg-green-600/10 text-green-700">
                      <CheckCircle2 className="h-3 w-3 mr-1" /> Paid
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-red-600/10 text-red-700">
                      <XCircle className="h-3 w-3 mr-1" /> Unpaid
                    </Badge>
                  )}
                </div>
              </div>

              <div className="rounded-md border p-3 md:col-span-2">
                <div className="font-semibold mb-2">Parent / Guardian</div>
                <div><b>Name:</b> {selected.parent_name || "—"}</div>
                <div><b>Contact:</b> {selected.parent_contact_number || "—"}</div>
                <div><b>Email:</b> {selected.parent_email || "—"}</div>
              </div>
            </div>
          ) : null}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- Set Exam (single) Dialog --- */}
      <Dialog open={examOpen} onOpenChange={setExamOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Set Exam</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <CalendarDays className="h-4 w-4" /> Exam Date
              </label>
              <Input
                type="date"
                value={examForm.date}
                onChange={(e) => setExamForm((s) => ({ ...s, date: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Exam Center
              </label>
              <Input
                placeholder="Center name / address"
                value={examForm.center}
                onChange={(e) => setExamForm((s) => ({ ...s, center: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setExamOpen(false)}>Cancel</Button>
            <Button onClick={saveExamForOne}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
