import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useGetAllAdmissions,
  useGetAllAttendanceDates,
  useGetAttendanceByDate,
  useGetTotalAdmissions,
  useMarkAttendance,
  useRemoveAttendance,
} from "@/hooks/useQueries";
import {
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  Download,
  Loader2,
  LogIn,
  LogOut,
  Shield,
  Users,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { Admission } from "../backend.d";

const ADMIN_USERNAME = "Yogahmh#983240";
const ADMIN_PASSWORD = "yoga$hmh^96740";

function formatDate(ts: bigint): string {
  const ms = Number(ts / 1_000_000n);
  return new Date(ms).toLocaleDateString("hi-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function todayString(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function formatRegCode(idx: number): string {
  return `Yoga#HMH${String(idx + 1).padStart(3, "0")}`;
}

function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return "";
  const [yyyy, mm, dd] = dateStr.split("-");
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${dd} ${months[Number.parseInt(mm, 10) - 1]} ${yyyy}`;
}

function downloadCSV(filename: string, rows: string[][]): void {
  const csvContent = rows
    .map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
    )
    .join("\n");
  const bom = "\uFEFF";
  const blob = new Blob([bom + csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function AttendanceTab({ admissions }: { admissions: Admission[] }) {
  const [selectedDate, setSelectedDate] = useState(todayString());

  const { data: presentIds = [], isLoading: attendanceLoading } =
    useGetAttendanceByDate(selectedDate);
  const { data: allDates = [] } = useGetAllAttendanceDates();
  const markMutation = useMarkAttendance();
  const removeMutation = useRemoveAttendance();

  const presentSet = new Set(presentIds.map((id) => Number(id)));
  const presentCount = admissions.filter((_, idx) =>
    presentSet.has(idx),
  ).length;

  const handleToggle = (idx: number) => {
    const admissionId = BigInt(idx);
    if (presentSet.has(idx)) {
      removeMutation.mutate({ admissionId, date: selectedDate });
    } else {
      markMutation.mutate({ admissionId, date: selectedDate });
    }
  };

  const isTogglePending = (idx: number) => {
    return (
      (markMutation.isPending &&
        markMutation.variables?.admissionId === BigInt(idx) &&
        markMutation.variables?.date === selectedDate) ||
      (removeMutation.isPending &&
        removeMutation.variables?.admissionId === BigInt(idx) &&
        removeMutation.variables?.date === selectedDate)
    );
  };

  const handleDownloadAttendance = () => {
    const header = ["Sr. No.", "Reg. Code", "नाम", "मोबाइल", "स्थिति"];
    const rows = admissions.map((admission, idx) => [
      String(idx + 1),
      formatRegCode(idx),
      admission.fullName,
      admission.mobile,
      presentSet.has(idx) ? "उपस्थित" : "अनुपस्थित",
    ]);
    downloadCSV(`attendance-${selectedDate}.csv`, [header, ...rows]);
  };

  return (
    <div className="space-y-5">
      {/* Date selector + stats row */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="attendance-date" className="text-sm font-medium">
            <CalendarDays className="inline w-4 h-4 mr-1 -mt-0.5" />
            तारीख चुनें · Select Date
          </Label>
          <Input
            id="attendance-date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-48 bg-background border-border"
            data-ocid="attendance.date.input"
          />
        </div>

        <div className="flex gap-3 flex-wrap">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-success/10 border border-success/20">
            <CheckCircle2 className="w-4 h-4 text-success" />
            <span className="text-sm font-semibold text-success">
              {presentCount} उपस्थित
            </span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted border border-border">
            <XCircle className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-muted-foreground">
              {admissions.length - presentCount} अनुपस्थित
            </span>
          </div>
        </div>

        {admissions.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadAttendance}
            data-ocid="admin.attendance.download.button"
            className="gap-2 border-border hover:border-primary/40 hover:text-primary sm:ml-auto"
          >
            <Download className="w-4 h-4" />
            Download CSV
          </Button>
        )}
      </div>

      {/* Past dates quick nav */}
      {allDates.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground self-center">
            पिछली तारीखें:
          </span>
          {[...allDates]
            .sort((a, b) => b.localeCompare(a))
            .slice(0, 7)
            .map((d) => (
              <button
                type="button"
                key={d}
                onClick={() => setSelectedDate(d)}
                data-ocid="attendance.date.tab"
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                  selectedDate === d
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {formatDisplayDate(d)}
              </button>
            ))}
        </div>
      )}

      {/* Attendance table */}
      <Card className="border-border shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-primary" />
            {formatDisplayDate(selectedDate)} · उपस्थिति
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {attendanceLoading ? (
            <div
              className="p-6 space-y-3"
              data-ocid="attendance.table.loading_state"
            >
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-10 w-full rounded-lg" />
              ))}
            </div>
          ) : admissions.length === 0 ? (
            <div
              className="p-12 text-center"
              data-ocid="attendance.table.empty_state"
            >
              <p className="text-muted-foreground text-sm">
                कोई प्रतिभागी नहीं मिला।
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table data-ocid="attendance.table">
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-border">
                    <TableHead className="font-semibold text-foreground w-10">
                      #
                    </TableHead>
                    <TableHead className="font-semibold text-foreground">
                      Reg. Code
                    </TableHead>
                    <TableHead className="font-semibold text-foreground">
                      नाम
                    </TableHead>
                    <TableHead className="font-semibold text-foreground">
                      मोबाइल
                    </TableHead>
                    <TableHead className="font-semibold text-foreground text-center">
                      स्थिति
                    </TableHead>
                    <TableHead className="font-semibold text-foreground text-center">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {admissions.map((admission: Admission, idx: number) => {
                    const isPresent = presentSet.has(idx);
                    const pending = isTogglePending(idx);
                    const rowNum = idx + 1;
                    return (
                      <TableRow
                        key={`${admission.fullName}-${admission.mobile}-${idx}`}
                        data-ocid={`attendance.row.${rowNum}`}
                        className={`border-border transition-colors ${
                          isPresent
                            ? "bg-success/5 hover:bg-success/10"
                            : "hover:bg-muted/40"
                        }`}
                      >
                        <TableCell className="text-muted-foreground text-xs">
                          {rowNum}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="text-xs font-mono border-primary/30 text-primary bg-primary/5"
                          >
                            {formatRegCode(idx)}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium text-foreground">
                          {admission.fullName}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {admission.mobile}
                        </TableCell>
                        <TableCell className="text-center">
                          {isPresent ? (
                            <Badge className="bg-success/15 text-success border-success/30 hover:bg-success/25 gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              उपस्थित
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="text-muted-foreground border-border gap-1"
                            >
                              <XCircle className="w-3 h-3" />
                              अनुपस्थित
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            size="sm"
                            variant={isPresent ? "outline" : "default"}
                            onClick={() => handleToggle(idx)}
                            disabled={pending}
                            data-ocid={`attendance.toggle.${rowNum}`}
                            className={`text-xs h-7 px-3 ${
                              isPresent
                                ? "border-destructive/40 text-destructive hover:bg-destructive/10 hover:border-destructive"
                                : "bg-success hover:bg-success/90 text-white border-success"
                            }`}
                          >
                            {pending ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : isPresent ? (
                              "Absent Mark करें"
                            ) : (
                              "Present Mark करें"
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const { data: admissions, isLoading: admissionsLoading } =
    useGetAllAdmissions();
  const { data: totalCount } = useGetTotalAdmissions();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);
    await new Promise((r) => setTimeout(r, 400));
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      setLoginError("Username या Password गलत है। पुनः प्रयास करें।");
    }
    setIsLoggingIn(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername("");
    setPassword("");
    setLoginError("");
  };

  const handleDownloadAdmissions = () => {
    if (!admissions || admissions.length === 0) return;
    const header = [
      "Sr. No.",
      "Reg. Code",
      "नाम",
      "मोबाइल",
      "DOB",
      "पता",
      "व्यवसाय",
      "Submitted At",
    ];
    const rows = admissions.map((admission, idx) => [
      String(idx + 1),
      formatRegCode(idx),
      admission.fullName,
      admission.mobile,
      admission.dob,
      admission.address,
      (admission as Admission & { occupation?: string }).occupation ?? "",
      formatDate(admission.submittedAt),
    ]);
    downloadCSV("admission-list.csv", [header, ...rows]);
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen mandala-bg flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <Card className="border-border shadow-saffron">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="font-display text-2xl">
                Admin Login
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                एडमिन पैनल देखने के लिए लॉगिन करें
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Username दर्ज करें"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    data-ocid="admin.login.input"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Password दर्ज करें"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    data-ocid="admin.login.input"
                    required
                  />
                </div>
                {loginError && (
                  <p
                    className="text-xs text-destructive text-center"
                    data-ocid="admin.login.error_state"
                  >
                    {loginError}
                  </p>
                )}
                <Button
                  type="submit"
                  disabled={isLoggingIn}
                  data-ocid="admin.login.primary_button"
                  className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> लॉगिन हो
                      रहा है...
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" /> लॉगिन करें
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen mandala-bg">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">
                Admin Panel
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">
                Free Yoga Camp HMH · निःशुल्क योग सेवा शिविर
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              data-ocid="admin.logout.button"
              className="border-border hover:border-destructive/40 hover:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" /> लॉगआउट
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <Card className="border-border">
              <CardContent className="pt-5 pb-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold font-display text-foreground">
                    {totalCount?.toString() ?? "—"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    कुल प्रतिभागी · Total Participants
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="pt-5 pb-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary/15 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <Badge className="bg-secondary/15 text-secondary border-secondary/20 hover:bg-secondary/25">
                    Admin
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    Logged in
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="admissions" className="w-full">
            <TabsList className="mb-5 bg-muted border border-border h-10">
              <TabsTrigger
                value="admissions"
                data-ocid="admin.admissions.tab"
                className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-xs"
              >
                <Users className="w-4 h-4" />
                एडमिशन
              </TabsTrigger>
              <TabsTrigger
                value="attendance"
                data-ocid="admin.attendance.tab"
                className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-xs"
              >
                <CalendarCheck className="w-4 h-4" />
                उपस्थिति
              </TabsTrigger>
            </TabsList>

            {/* Admissions Tab */}
            <TabsContent value="admissions">
              <Card className="border-border shadow-xs">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base font-semibold">
                    एडमिशन सूची · Admission List
                  </CardTitle>
                  {admissions && admissions.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadAdmissions}
                      data-ocid="admin.admissions.download.button"
                      className="gap-2 border-border hover:border-primary/40 hover:text-primary"
                    >
                      <Download className="w-4 h-4" />
                      Download CSV
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="p-0">
                  {admissionsLoading ? (
                    <div
                      className="p-6 space-y-3"
                      data-ocid="admin.table.loading_state"
                    >
                      {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-10 w-full rounded-lg" />
                      ))}
                    </div>
                  ) : !admissions || admissions.length === 0 ? (
                    <div
                      className="p-12 text-center"
                      data-ocid="admin.table.empty_state"
                    >
                      <p className="text-muted-foreground text-sm">
                        अभी कोई एडमिशन नहीं हुआ।
                      </p>
                      <p className="text-muted-foreground text-xs mt-1">
                        No admissions yet.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table data-ocid="admin.table">
                        <TableHeader>
                          <TableRow className="hover:bg-transparent border-border">
                            <TableHead className="font-semibold text-foreground">
                              #
                            </TableHead>
                            <TableHead className="font-semibold text-foreground">
                              Reg. Code
                            </TableHead>
                            <TableHead className="font-semibold text-foreground">
                              नाम
                            </TableHead>
                            <TableHead className="font-semibold text-foreground">
                              मोबाइल
                            </TableHead>
                            <TableHead className="font-semibold text-foreground">
                              DOB
                            </TableHead>
                            <TableHead className="font-semibold text-foreground">
                              पता
                            </TableHead>
                            <TableHead className="font-semibold text-foreground">
                              व्यवसाय
                            </TableHead>
                            <TableHead className="font-semibold text-foreground">
                              समय
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {admissions.map(
                            (admission: Admission, idx: number) => (
                              <TableRow
                                key={`${admission.fullName}-${admission.mobile}-${idx}`}
                                data-ocid={`admin.row.${idx + 1}`}
                                className="border-border hover:bg-muted/40"
                              >
                                <TableCell className="text-muted-foreground text-xs w-8">
                                  {idx + 1}
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant="outline"
                                    className="text-xs font-mono border-primary/30 text-primary bg-primary/5"
                                  >
                                    {formatRegCode(idx)}
                                  </Badge>
                                </TableCell>
                                <TableCell className="font-medium text-foreground">
                                  {admission.fullName}
                                </TableCell>
                                <TableCell className="text-sm">
                                  {admission.mobile}
                                </TableCell>
                                <TableCell className="text-sm">
                                  {admission.dob}
                                </TableCell>
                                <TableCell className="text-sm max-w-[160px] truncate">
                                  {admission.address}
                                </TableCell>
                                <TableCell className="text-sm">
                                  {(
                                    admission as Admission & {
                                      occupation?: string;
                                    }
                                  ).occupation ?? "—"}
                                </TableCell>
                                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                                  {formatDate(admission.submittedAt)}
                                </TableCell>
                              </TableRow>
                            ),
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Attendance Tab */}
            <TabsContent value="attendance">
              {admissionsLoading ? (
                <div
                  className="p-6 space-y-3"
                  data-ocid="attendance.loading_state"
                >
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-10 w-full rounded-lg" />
                  ))}
                </div>
              ) : (
                <AttendanceTab admissions={admissions ?? []} />
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </main>
  );
}
