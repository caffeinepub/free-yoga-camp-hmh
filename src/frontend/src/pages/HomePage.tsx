import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useGetTotalAdmissions, useSubmitAdmission } from "@/hooks/useQueries";
import {
  CheckCircle2,
  Clock,
  Loader2,
  MapPin,
  Phone,
  Upload,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../blob";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function HomePage() {
  const { data: totalCount } = useGetTotalAdmissions();
  const submitMutation = useSubmitAdmission();

  const [form, setForm] = useState({
    fullName: "",
    mobile: "",
    dob: "",
    idProofType: "",
    address: "",
    email: "",
  });
  const [idFile, setIdFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.fullName.trim()) newErrors.fullName = "नाम आवश्यक है";
    if (!form.mobile.match(/^[6-9]\d{9}$/))
      newErrors.mobile = "सही मोबाइल नंबर दर्ज करें";
    if (!form.dob) newErrors.dob = "जन्म तिथि आवश्यक है";
    if (!form.idProofType) newErrors.idProofType = "ID प्रकार चुनें";
    if (!form.address.trim()) newErrors.address = "पता आवश्यक है";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.email = "सही ईमेल दर्ज करें";
    if (!idFile) newErrors.idFile = "ID प्रूफ फ़ाइल अपलोड करें";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsUploading(true);
      const fileBytes = new Uint8Array(await idFile!.arrayBuffer());
      const blob = ExternalBlob.fromBytes(fileBytes).withUploadProgress(
        (pct) => {
          setUploadProgress(pct);
        },
      );
      await blob.getBytes();
      const fileKey = blob.getDirectURL();
      setIsUploading(false);

      await submitMutation.mutateAsync({
        ...form,
        idProofFileKey: fileKey,
      });

      setSubmitted(true);
      toast.success("एडमिशन सफलतापूर्वक दर्ज हो गया!");
    } catch (err) {
      setIsUploading(false);
      toast.error("कुछ गलत हुआ। कृपया पुनः प्रयास करें।");
      console.error(err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setIdFile(file);
    if (file) setErrors((prev) => ({ ...prev, idFile: "" }));
  };

  const isPending = isUploading || submitMutation.isPending;

  return (
    <main className="min-h-screen mandala-bg">
      {/* Hero Section */}
      <section className="relative overflow-hidden hero-pattern pt-8 pb-12">
        <div className="container mx-auto max-w-5xl px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 gap-8 items-center"
          >
            {/* Left: Text */}
            <div className="order-2 md:order-1">
              <motion.div variants={itemVariants}>
                <span className="inline-block text-xs font-semibold tracking-widest uppercase text-secondary bg-secondary/10 px-3 py-1 rounded-full mb-4">
                  🌿 निःशुल्क सेवा · Free Service
                </span>
              </motion.div>
              <motion.h1
                variants={itemVariants}
                className="font-display text-4xl md:text-5xl font-bold text-foreground leading-tight mb-3"
              >
                निःशुल्क
                <span className="text-primary block">योग सेवा शिविर</span>
              </motion.h1>
              <motion.p
                variants={itemVariants}
                className="text-lg text-muted-foreground mb-6"
              >
                Free Yoga Service Camp · HMH
              </motion.p>

              <motion.div variants={itemVariants} className="space-y-3">
                <div className="flex items-start gap-3 bg-card/80 rounded-xl p-3 border border-border">
                  <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground text-sm">
                      स्थान / Venue
                    </p>
                    <p className="text-muted-foreground text-sm">
                      अम्बेडकर भवन, करणी चौक सुरेशिया
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-card/80 rounded-xl p-3 border border-border">
                  <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground text-sm">
                      समय / Time
                    </p>
                    <p className="text-muted-foreground text-sm">
                      प्रत्येक दिन सुबह 5:30 बजे · Every day 5:30 AM
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-card/80 rounded-xl p-3 border border-border">
                  <Phone className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground text-sm">
                      संपर्क / Contact
                    </p>
                    <p className="text-muted-foreground text-sm">
                      <a
                        href="tel:+919024783339"
                        className="hover:text-primary transition-colors"
                      >
                        +91 9024783339
                      </a>
                      {" — "}रतिराम जी सहारण (योग प्रशिक्षक)
                    </p>
                  </div>
                </div>
              </motion.div>

              {totalCount !== undefined && totalCount > 0n && (
                <motion.div
                  variants={itemVariants}
                  className="mt-4 flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <Users className="w-4 h-4 text-secondary" />
                  <span>
                    <strong className="text-secondary">
                      {totalCount.toString()}
                    </strong>{" "}
                    प्रतिभागी अब तक · participants so far
                  </span>
                </motion.div>
              )}
            </div>

            {/* Right: Flyer Image */}
            <motion.div
              variants={itemVariants}
              className="order-1 md:order-2 flex justify-center"
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-2xl translate-y-4 scale-95" />
                <img
                  src="/assets/uploads/1_1770612275298-1.jpg"
                  alt="निःशुल्क योग सेवा शिविर - Free Yoga Camp Flyer"
                  className="relative rounded-2xl shadow-saffron w-full max-w-xs md:max-w-sm object-cover border-2 border-primary/20"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Divider */}
      <div className="container mx-auto max-w-5xl px-4 my-8">
        <div className="om-divider">
          <span className="relative z-10 bg-background px-4 text-primary text-2xl">
            🕉️
          </span>
        </div>
      </div>

      {/* Admission Form */}
      <section className="container mx-auto max-w-2xl px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <h2 className="font-display text-3xl font-bold text-foreground">
              एडमिशन फॉर्म
            </h2>
            <p className="text-muted-foreground mt-2">
              Admission Form · सभी जानकारी भरें
            </p>
          </div>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                data-ocid="form.success_state"
              >
                <Card className="border-secondary/30 bg-secondary/5 shadow-green">
                  <CardContent className="pt-10 pb-10 flex flex-col items-center text-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-secondary/15 flex items-center justify-center animate-pulse-glow">
                      <CheckCircle2 className="w-10 h-10 text-secondary" />
                    </div>
                    <h3 className="font-display text-2xl font-bold text-foreground">
                      धन्यवाद! 🙏
                    </h3>
                    <p className="text-muted-foreground max-w-sm">
                      आपका एडमिशन सफलतापूर्वक दर्ज हो गया है।
                      <br />
                      <span className="text-sm">
                        Your admission has been successfully registered.
                      </span>
                    </p>
                    <div className="mt-2 bg-primary/10 rounded-xl px-6 py-3 text-sm text-foreground">
                      📍 अम्बेडकर भवन, करणी चौक सुरेशिया · सुबह 5:30 बजे
                    </div>
                    <Button
                      variant="outline"
                      className="mt-2 border-primary/30 text-primary hover:bg-primary/10"
                      onClick={() => {
                        setSubmitted(false);
                        setForm({
                          fullName: "",
                          mobile: "",
                          dob: "",
                          idProofType: "",
                          address: "",
                          email: "",
                        });
                        setIdFile(null);
                        setUploadProgress(0);
                      }}
                    >
                      नया फॉर्म भरें
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Card className="border-border shadow-saffron">
                  <CardContent className="pt-6">
                    <form
                      onSubmit={handleSubmit}
                      noValidate
                      className="space-y-5"
                    >
                      {/* Full Name */}
                      <div className="space-y-1.5">
                        <Label htmlFor="fullName" className="font-medium">
                          पूरा नाम <span className="text-primary">*</span>
                          <span className="text-muted-foreground font-normal ml-1 text-xs">
                            (Full Name)
                          </span>
                        </Label>
                        <Input
                          id="fullName"
                          data-ocid="form.name.input"
                          placeholder="अपना पूरा नाम लिखें"
                          value={form.fullName}
                          onChange={(e) =>
                            setForm((p) => ({ ...p, fullName: e.target.value }))
                          }
                          className={
                            errors.fullName ? "border-destructive" : ""
                          }
                          autoComplete="name"
                        />
                        {errors.fullName && (
                          <p
                            className="text-xs text-destructive"
                            data-ocid="form.name.error_state"
                          >
                            {errors.fullName}
                          </p>
                        )}
                      </div>

                      {/* Mobile + DOB row */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="mobile" className="font-medium">
                            मोबाइल नंबर <span className="text-primary">*</span>
                          </Label>
                          <Input
                            id="mobile"
                            data-ocid="form.mobile.input"
                            type="tel"
                            placeholder="10 अंकों का नंबर"
                            value={form.mobile}
                            onChange={(e) =>
                              setForm((p) => ({ ...p, mobile: e.target.value }))
                            }
                            className={
                              errors.mobile ? "border-destructive" : ""
                            }
                            autoComplete="tel"
                          />
                          {errors.mobile && (
                            <p
                              className="text-xs text-destructive"
                              data-ocid="form.mobile.error_state"
                            >
                              {errors.mobile}
                            </p>
                          )}
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="dob" className="font-medium">
                            जन्म तिथि <span className="text-primary">*</span>
                            <span className="text-muted-foreground font-normal ml-1 text-xs">
                              (DOB)
                            </span>
                          </Label>
                          <Input
                            id="dob"
                            data-ocid="form.dob.input"
                            type="date"
                            value={form.dob}
                            onChange={(e) =>
                              setForm((p) => ({ ...p, dob: e.target.value }))
                            }
                            className={errors.dob ? "border-destructive" : ""}
                            style={{ fontSize: "16px" }}
                          />
                          {errors.dob && (
                            <p
                              className="text-xs text-destructive"
                              data-ocid="form.dob.error_state"
                            >
                              {errors.dob}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* ID Proof Type */}
                      <div className="space-y-1.5">
                        <Label className="font-medium">
                          ID प्रूफ प्रकार <span className="text-primary">*</span>
                          <span className="text-muted-foreground font-normal ml-1 text-xs">
                            (ID Proof Type)
                          </span>
                        </Label>
                        <Select
                          value={form.idProofType}
                          onValueChange={(v) =>
                            setForm((p) => ({ ...p, idProofType: v }))
                          }
                        >
                          <SelectTrigger
                            data-ocid="form.idproof.select"
                            className={
                              errors.idProofType ? "border-destructive" : ""
                            }
                          >
                            <SelectValue placeholder="ID प्रकार चुनें" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Aadhar Card">
                              आधार कार्ड (Aadhar Card)
                            </SelectItem>
                            <SelectItem value="PAN Card">
                              पैन कार्ड (PAN Card)
                            </SelectItem>
                            <SelectItem value="Voter ID">
                              मतदाता पहचान पत्र (Voter ID)
                            </SelectItem>
                            <SelectItem value="Driving License">
                              ड्राइविंग लाइसेंस (Driving License)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.idProofType && (
                          <p
                            className="text-xs text-destructive"
                            data-ocid="form.idproof.error_state"
                          >
                            {errors.idProofType}
                          </p>
                        )}
                      </div>

                      {/* Address */}
                      <div className="space-y-1.5">
                        <Label htmlFor="address" className="font-medium">
                          पता <span className="text-primary">*</span>
                          <span className="text-muted-foreground font-normal ml-1 text-xs">
                            (Address)
                          </span>
                        </Label>
                        <Textarea
                          id="address"
                          data-ocid="form.address.textarea"
                          placeholder="अपना पूरा पता लिखें"
                          value={form.address}
                          onChange={(e) =>
                            setForm((p) => ({ ...p, address: e.target.value }))
                          }
                          className={`resize-none ${errors.address ? "border-destructive" : ""}`}
                          rows={3}
                          autoComplete="street-address"
                        />
                        {errors.address && (
                          <p
                            className="text-xs text-destructive"
                            data-ocid="form.address.error_state"
                          >
                            {errors.address}
                          </p>
                        )}
                      </div>

                      {/* ID Proof File */}
                      <div className="space-y-1.5">
                        <Label className="font-medium">
                          ID प्रूफ फ़ाइल <span className="text-primary">*</span>
                          <span className="text-muted-foreground font-normal ml-1 text-xs">
                            (ID Proof File Upload)
                          </span>
                        </Label>
                        <div
                          className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors hover:bg-primary/5 ${
                            errors.idFile
                              ? "border-destructive"
                              : "border-border hover:border-primary/40"
                          } ${idFile ? "bg-primary/5 border-primary/30" : ""}`}
                          onClick={() => fileInputRef.current?.click()}
                          onKeyDown={(e) =>
                            (e.key === "Enter" || e.key === " ") &&
                            fileInputRef.current?.click()
                          }
                          data-ocid="form.idfile.dropzone"
                        >
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*,.pdf"
                            className="hidden"
                            onChange={handleFileChange}
                            data-ocid="form.idfile.upload_button"
                          />
                          {idFile ? (
                            <div className="flex items-center justify-center gap-2 text-primary">
                              <CheckCircle2 className="w-5 h-5" />
                              <span className="text-sm font-medium truncate max-w-xs">
                                {idFile.name}
                              </span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-1.5">
                              <Upload className="w-8 h-8 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">
                                फ़ाइल चुनें या यहाँ छोड़ें
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Image या PDF · Max 10MB
                              </p>
                            </div>
                          )}
                        </div>
                        {isUploading && (
                          <div className="space-y-1">
                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full transition-all"
                                style={{ width: `${uploadProgress}%` }}
                              />
                            </div>
                            <p className="text-xs text-muted-foreground text-center">
                              अपलोड हो रहा है... {uploadProgress}%
                            </p>
                          </div>
                        )}
                        {errors.idFile && (
                          <p
                            className="text-xs text-destructive"
                            data-ocid="form.idfile.error_state"
                          >
                            {errors.idFile}
                          </p>
                        )}
                      </div>

                      {/* Email */}
                      <div className="space-y-1.5">
                        <Label htmlFor="email" className="font-medium">
                          Gmail / ईमेल <span className="text-primary">*</span>
                        </Label>
                        <Input
                          id="email"
                          data-ocid="form.email.input"
                          type="email"
                          placeholder="yourname@gmail.com"
                          value={form.email}
                          onChange={(e) =>
                            setForm((p) => ({ ...p, email: e.target.value }))
                          }
                          className={errors.email ? "border-destructive" : ""}
                          autoComplete="email"
                          style={{ fontSize: "16px" }}
                        />
                        {errors.email && (
                          <p
                            className="text-xs text-destructive"
                            data-ocid="form.email.error_state"
                          >
                            {errors.email}
                          </p>
                        )}
                      </div>

                      {/* Submit */}
                      <Button
                        type="submit"
                        data-ocid="form.submit_button"
                        disabled={isPending}
                        className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-all hover:shadow-lg hover:scale-[1.01]"
                      >
                        {isPending ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            {isUploading
                              ? "अपलोड हो रहा है..."
                              : "जमा हो रहा है..."}
                          </>
                        ) : (
                          "🙏 एडमिशन जमा करें · Submit"
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>
    </main>
  );
}
