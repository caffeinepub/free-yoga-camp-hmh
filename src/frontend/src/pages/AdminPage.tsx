import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import {
  useGetAllAdmissions,
  useGetTotalAdmissions,
  useIsCallerAdmin,
} from "@/hooks/useQueries";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, LogIn, LogOut, Shield, Users } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { Admission } from "../backend.d";

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

export default function AdminPage() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();
  const { data: admissions, isLoading: admissionsLoading } =
    useGetAllAdmissions();
  const { data: totalCount } = useGetTotalAdmissions();

  const [loginError, setLoginError] = useState("");

  const handleLogin = async () => {
    setLoginError("");
    try {
      await login();
    } catch (err: any) {
      if (err?.message === "User is already authenticated") {
        await clear();
        setTimeout(() => login(), 300);
      } else {
        setLoginError("लॉगिन में समस्या हुई। पुनः प्रयास करें।");
      }
    }
  };

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
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
            <CardContent className="flex flex-col gap-3">
              {loginError && (
                <p
                  className="text-xs text-destructive text-center"
                  data-ocid="admin.login.error_state"
                >
                  {loginError}
                </p>
              )}
              <Button
                onClick={handleLogin}
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
                    <LogIn className="mr-2 h-4 w-4" /> Internet Identity से लॉगिन
                    करें
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    );
  }

  if (isAdminLoading) {
    return (
      <main className="min-h-screen mandala-bg flex items-center justify-center">
        <div
          data-ocid="admin.loading_state"
          className="flex flex-col items-center gap-3"
        >
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-muted-foreground text-sm">जाँच हो रही है...</p>
        </div>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen mandala-bg flex items-center justify-center px-4">
        <Card
          className="border-destructive/30 max-w-sm w-full"
          data-ocid="admin.error_state"
        >
          <CardContent className="pt-8 pb-8 text-center flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center">
              <Shield className="w-7 h-7 text-destructive" />
            </div>
            <p className="font-semibold text-foreground">पहुँच अस्वीकृत</p>
            <p className="text-sm text-muted-foreground">
              आपके पास admin अधिकार नहीं हैं।
            </p>
            <Button
              variant="outline"
              onClick={handleLogout}
              data-ocid="admin.logout.button"
              className="border-destructive/30 text-destructive hover:bg-destructive/10"
            >
              <LogOut className="mr-2 h-4 w-4" /> लॉगआउट
            </Button>
          </CardContent>
        </Card>
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
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">
                Admin Panel
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">
                सभी एडमिशन · All Admissions
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

          <Card className="border-border shadow-xs">
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                एडमिशन सूची · Admission List
              </CardTitle>
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
                          नाम
                        </TableHead>
                        <TableHead className="font-semibold text-foreground">
                          मोबाइल
                        </TableHead>
                        <TableHead className="font-semibold text-foreground">
                          DOB
                        </TableHead>
                        <TableHead className="font-semibold text-foreground">
                          ID Type
                        </TableHead>
                        <TableHead className="font-semibold text-foreground">
                          पता
                        </TableHead>
                        <TableHead className="font-semibold text-foreground">
                          Email
                        </TableHead>
                        <TableHead className="font-semibold text-foreground">
                          समय
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {admissions.map((admission: Admission, idx: number) => (
                        <TableRow
                          key={`${admission.fullName}-${admission.mobile}-${idx}`}
                          data-ocid={`admin.row.${idx + 1}`}
                          className="border-border hover:bg-muted/40"
                        >
                          <TableCell className="text-muted-foreground text-xs w-8">
                            {idx + 1}
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
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="text-xs border-primary/30 text-primary bg-primary/5"
                            >
                              {admission.idProofType}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm max-w-[160px] truncate">
                            {admission.address}
                          </TableCell>
                          <TableCell className="text-sm">
                            {admission.email}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatDate(admission.submittedAt)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}
