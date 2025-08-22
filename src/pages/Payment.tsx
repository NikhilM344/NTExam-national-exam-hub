import { useState, useEffect } from "react";
import { CreditCard, Shield, CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

declare global {
  interface Window {
    Razorpay: any;
  }
}

type CreateOrderResponse = {
  ok: boolean;
  key_id: string;
  order_id: string;
  amount: number; // paise
  currency: string; // "INR"
};

type VerifyResponse = {
  ok?: boolean;
  error?: string;
};

async function loadScript(src: string) {
  return new Promise<boolean>((resolve) => {
    const el = document.createElement("script");
    el.src = src;
    el.async = true;
    el.onload = () => resolve(true);
    el.onerror = () => resolve(false);
    document.body.appendChild(el);
  });
}

/** Map DB row -> UI shape the component expects */
function toClientStudentData(row: any) {
  if (!row) return null;
  return {
    personalInfo: {
      fullName: row.full_name ?? "",
      dateOfBirth: row.date_of_birth ?? "",
      gender: row.gender ?? "",
      address: row.address ?? "",
      city: row.city ?? "",
      state: row.state ?? "",
      postalCode: row.postal_code ?? "",
      contactNumber: row.contact_number ?? "",
      email: row.email ?? "",
    },
    schoolInfo: {
      schoolName: row.school_name ?? "",
      schoolAddress: row.school_address ?? "",
      schoolCity: row.school_city ?? "",
      schoolState: row.school_state ?? "",
      schoolPostalCode: row.school_postal_code ?? "",
      classGrade: row.class_grade ?? "",
      rollNumber: row.roll_number ?? "",
    },
    examDetails: {
      subjects: row.subjects ?? [],
      examCenter: row.exam_center ?? "",
      examDate: row.exam_date ?? "",
    },
    parentInfo: {
      parentName: row.parent_name ?? "",
      parentContactNumber: row.parent_contact_number ?? "",
      parentEmail: row.parent_email ?? "",
    },
    termsAccepted: !!row.terms_accepted,
  };
}

/** Optional helper for "Pay Later" (will be ignored if RLS blocks) */
async function markPaid(isPaid: boolean) {
  const registrationId = localStorage.getItem("registrationId");
  if (!registrationId) return;
  const { error } = await supabase
    .from("registrations")
    .update({ is_paid: isPaid })
    .eq("id", registrationId);
  if (error) throw error;
}

/** Simple fee rule if row.fees is missing. Adjust as needed. */
function computeFallbackFee(gender?: string) {
  const g = (gender || "").toLowerCase();
  return g === "female" ? 150 : 200; // <-- change these if your pricing differs
}

const Payment = () => {
  const [registrationData, setRegistrationData] = useState<any>(null);
  const [fees, setFees] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const registrationId = localStorage.getItem("registrationId");

        if (registrationId) {
          const { data: row, error } = await supabase
            .from("registrations")
            .select("*")
            .eq("id", registrationId)
            .maybeSingle();

          if (!error && row) {
            const clientShape = toClientStudentData(row);
            setRegistrationData(clientShape);

            // Use DB fee if present else compute and persist
            const dbFee =
              typeof row.fees === "number" && row.fees > 0
                ? row.fees
                : computeFallbackFee(row.gender);
            setFees(dbFee);

            if (!(typeof row.fees === "number" && row.fees > 0)) {
              // ignore error if column doesn't exist
              await supabase.from("registrations").update({ fees: dbFee }).eq("id", registrationId);
            }
            return;
          }
        }

        // Fallback: use any cached registrationData if available
        const storedData = localStorage.getItem("registrationData");
        if (storedData) {
          const parsed = JSON.parse(storedData);
          setRegistrationData(parsed);
          setFees(computeFallbackFee(parsed?.personalInfo?.gender));
          return;
        }

        // No usable context -> send to login
        window.location.href = "/login";
      } catch {
        window.location.href = "/login";
      }
    })();
  }, []);

  const handlePayment = async () => {
    try {
      setIsProcessing(true);

      // 1) Load Razorpay SDK (runtime)
      const ok = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!ok) {
        setIsProcessing(false);
        toast({
          title: "Payment Error",
          description: "Failed to load Razorpay SDK. Check your internet and try again.",
          variant: "destructive",
        });
        return;
      }

      // 2) Ensure we have a registrationId
      const registrationId = localStorage.getItem("registrationId");
      if (!registrationId) {
        setIsProcessing(false);
        toast({
          title: "Missing Info",
          description: "Registration ID not found.",
          variant: "destructive",
        });
        return;
      }

      // 3) Persist fee to the row (so the Edge Function can read it)
      try {
        await supabase.from("registrations").update({ fees }).eq("id", registrationId);
      } catch {
        /* ignore */
      }

      // 4) Create order via Supabase Edge Function
      const { data: orderData, error: orderErr } =
        await supabase.functions.invoke<CreateOrderResponse>("razorpay-create-order", {
          body: { registrationId },
        });

      if (orderErr || !orderData?.ok) {
        setIsProcessing(false);
        toast({
          title: "Payment Error",
          description: orderErr?.message || "Could not create payment order. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // 5) Configure & open Razorpay Checkout
      const options: any = {
        key: orderData.key_id,
        amount: orderData.amount, // paise
        currency: orderData.currency || "INR",
        name: "NTExam",
        description: "Exam Registration Fee",
        order_id: orderData.order_id,
        prefill: {
          name: registrationData?.personalInfo?.fullName || "",
          email: registrationData?.personalInfo?.email || "",
          contact: registrationData?.personalInfo?.contactNumber || "",
        },
        theme: { color: "#4f46e5" },

        handler: async (resp: any) => {
          try {
            const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = resp;

            // 6) Verify on server
            const { data: verifyData, error: verifyErr } =
              await supabase.functions.invoke<VerifyResponse>("razorpay-verify", {
                body: {
                  registrationId,
                  razorpay_order_id,
                  razorpay_payment_id,
                  razorpay_signature,
                },
              });

            if (verifyErr || !verifyData?.ok) {
              setIsProcessing(false);
              toast({
                title: "Verification Failed",
                description:
                  verifyErr?.message || verifyData?.error || "Payment could not be verified.",
                variant: "destructive",
              });
              return;
            }

            // 7) Success UX & local flags
            toast({
              title: "Payment Successful!",
              description: "Your registration is complete. Redirecting to your dashboard…",
            });

            localStorage.setItem("isPaid", "true");

            // Optional cleanups: keep registrationId so dashboard can refetch fresh data
            localStorage.removeItem("examFees");

            setTimeout(() => {
              window.location.href = "/student-dashboard";
            }, 1000);
          } catch (e: any) {
            setIsProcessing(false);
            toast({
              title: "Payment Error",
              description: e?.message || "Unexpected error occurred.",
              variant: "destructive",
            });
          }
        },

        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            toast({ title: "Payment Cancelled", description: "You cancelled the payment." });
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (err: any) => {
        setIsProcessing(false);
        toast({
          title: "Payment Failed",
          description:
            err?.error?.description || "We couldn’t process the payment. Please try again.",
          variant: "destructive",
        });
      });
      rzp.open();
    } catch (e: any) {
      setIsProcessing(false);
      toast({
        title: "Payment Error",
        description: e?.message || "Unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  const handleGoBack = () => {
    window.location.href = "/registration";
  };

  if (!registrationData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading payment details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-gradient-hero text-white py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Payment</h1>
          </div>
          <p className="text-white/90">
            Complete your registration payment for NTExam - Navoday Talent Exam
          </p>
        </div>
      </div>

      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Registration Summary */}
            <Card className="shadow-card bg-gradient-card border-0">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-foreground">
                  Registration Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Student Info */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Student Information</h4>
                  <div className="bg-muted/50 rounded-lg p-3 space-y-1 text-sm">
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      {registrationData.personalInfo.fullName}
                    </p>
                    <p>
                      <span className="font-medium">Class:</span>{" "}
                      {registrationData.schoolInfo.classGrade}
                    </p>
                    <p>
                      <span className="font-medium">School:</span>{" "}
                      {registrationData.schoolInfo.schoolName}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {registrationData.personalInfo.email}
                    </p>
                  </div>
                </div>

                {/* Exam Details */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Exam Details</h4>
                  <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                    <div>
                      <span className="font-medium text-sm">Subjects:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {(registrationData.examDetails.subjects || []).map(
                          (subject: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {subject}
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                    {registrationData.examDetails.examCenter && (
                      <p className="text-sm">
                        <span className="font-medium">Exam Center:</span>{" "}
                        {registrationData.examDetails.examCenter}
                      </p>
                    )}
                    {registrationData.examDetails.examDate && (
                      <p className="text-sm">
                        <span className="font-medium">Exam Date:</span>{" "}
                        {registrationData.examDetails.examDate}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Details */}
            <Card className="shadow-card bg-gradient-card border-0">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Fee Breakdown */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">Fee Breakdown</h4>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">
                        Registration Fee (
                        {(registrationData.personalInfo.gender || "").toLowerCase() === "female"
                          ? "Girls"
                          : "Boys"}
                        )
                      </span>
                      <span className="font-semibold">₹{fees}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Processing Fee</span>
                      <span className="font-semibold">₹0</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Total Amount</span>
                        <span className="text-xl font-bold text-primary">₹{fees}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Security */}
                <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-5 w-5 text-success" />
                    <h4 className="font-semibold text-foreground">Secure Payment</h4>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>✓ 256-bit SSL encryption</li>
                    <li>✓ PCI DSS compliant</li>
                    <li>✓ Multiple payment options</li>
                    <li>✓ Instant payment confirmation</li>
                  </ul>
                </div>

                {/* Pay Now */}
                <Button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full bg-gradient-success hover:opacity-90 text-success-foreground py-6 text-lg font-semibold"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Pay ₹{fees} & Complete Registration
                    </>
                  )}
                </Button>

                {/* Pay Later */}
                <Button
                  variant="secondary"
                  onClick={async () => {
                    try {
                      await markPaid(false); // may be blocked by RLS; that's fine
                      toast({
                        title: "Saved for later",
                        description: "You can complete payment anytime.",
                      });
                    } catch (e: any) {
                      toast({
                        title: "Could not save",
                        description: e?.message,
                        variant: "destructive",
                      });
                    } finally {
                      window.location.href = "/";
                    }
                  }}
                  className="w-full"
                >
                  Pay Later
                </Button>

                {/* Back Button */}
                <Button
                  variant="outline"
                  onClick={handleGoBack}
                  disabled={isProcessing}
                  className="w-full"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Registration
                </Button>

                {/* Payment Methods Info */}
                <div className="text-center text-xs text-muted-foreground">
                  <p>We accept UPI, Net Banking, Credit/Debit Cards</p>
                  <p>Secure payments powered by industry standards</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
