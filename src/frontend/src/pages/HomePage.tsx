import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useGetTotalAdmissions, useSubmitAdmission } from "@/hooks/useQueries";
import {
  CheckCircle2,
  Clock,
  Loader2,
  MapPin,
  Phone,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

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
    address: "",
    occupation: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.fullName.trim()) newErrors.fullName = "नाम आवश्यक है";
    if (!form.mobile.match(/^[6-9]\d{9}$/))
      newErrors.mobile = "सही मोबाइल नंबर दर्ज करें";
    if (!form.dob) newErrors.dob = "जन्म तिथि आवश्यक है";
    if (!form.address.trim()) newErrors.address = "पता आवश्यक है";
    if (!form.occupation.trim()) newErrors.occupation = "व्यवसाय आवश्यक है";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await submitMutation.mutateAsync(form);
      setSubmitted(true);
      toast.success("एडमिशन सफलतापूर्वक दर्ज हो गया!");
    } catch (err) {
      toast.error("कुछ गलत हुआ। कृपया पुनः प्रयास करें।");
      console.error(err);
    }
  };

  const isPending = submitMutation.isPending;

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
                          address: "",
                          occupation: "",
                        });
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
                          className={`resize-none ${
                            errors.address ? "border-destructive" : ""
                          }`}
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

                      {/* Occupation */}
                      <div className="space-y-1.5">
                        <Label htmlFor="occupation" className="font-medium">
                          व्यवसाय <span className="text-primary">*</span>
                          <span className="text-muted-foreground font-normal ml-1 text-xs">
                            (Occupation)
                          </span>
                        </Label>
                        <Input
                          id="occupation"
                          data-ocid="form.occupation.input"
                          placeholder="जैसे: शिक्षक, व्यापारी, गृहिणी"
                          value={form.occupation}
                          onChange={(e) =>
                            setForm((p) => ({
                              ...p,
                              occupation: e.target.value,
                            }))
                          }
                          className={
                            errors.occupation ? "border-destructive" : ""
                          }
                          autoComplete="organization-title"
                        />
                        {errors.occupation && (
                          <p
                            className="text-xs text-destructive"
                            data-ocid="form.occupation.error_state"
                          >
                            {errors.occupation}
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
                            जमा हो रहा है...
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
