// src/pages/ShippingPolicy.tsx
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck, Clock, Mail, FileText, Trophy, RefreshCcw, Shield } from "lucide-react";

const ShippingPolicy = () => {
  return (
    <main className="min-h-screen bg-background">
      {/* Hidden SEO header */}
      <div className="sr-only">
        <h1>Shipping & Delivery Policy – NTExam (Navoday Talent Exam)</h1>
        <p>Digital delivery timelines for registrations, admit cards, and results; occasional physical dispatch of prizes/certificates.</p>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Badge className="mb-4">Policy</Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Shipping & Delivery Policy
          </h1>
          <p className="mt-3 text-muted-foreground max-w-3xl">
            We primarily provide <strong>digital services</strong> (exam registrations, admit cards, results).
            No physical shipping is needed for most purchases. In limited cases (e.g., prizes/certificates),
            we may dispatch physical items—details below.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        {/* Digital delivery (Primary) */}
        <Card className="bg-card/95 backdrop-blur-sm border-border/60 shadow-card">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Digital Delivery (Default)</h2>
            </div>
            <ul className="list-disc ml-6 text-sm text-muted-foreground space-y-2">
              <li>
                <strong>Order confirmation:</strong> Immediately after successful payment,
                you’ll see an on-screen confirmation and receive an email/SMS (if provided).
              </li>
              <li>
                <strong>Registration access:</strong> Your registration details are available instantly
                in your <Link to="/student-dashboard" className="text-primary underline">Student Dashboard</Link>.
              </li>
              <li>
                <strong>Admit Cards:</strong> Released digitally before the exam; you will be notified
                via email/SMS and can download from the dashboard.
              </li>
              <li>
                <strong>Results/Certificates:</strong> Published online; downloadable PDFs (if applicable).
              </li>
              <li>
                If you do not receive emails within 10–15 minutes, please check spam/junk or contact us via the{" "}
                <a href="https://ntexam.in/#contact" className="text-primary underline">Contact Us</a> section.
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Delivery timelines */}
        <Card className="bg-card/95 backdrop-blur-sm border-border/60 shadow-card">
          <CardContent className="p-6 grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Typical Timelines</h3>
              </div>
              <ul className="list-disc ml-6 text-sm text-muted-foreground space-y-2">
                <li><strong>Payment → Confirmation:</strong> Instant (within minutes).</li>
                <li><strong>Admit Card Release:</strong> Notified ahead of exam; download digitally.</li>
                <li><strong>Results:</strong> As per official schedule; accessible online.</li>
              </ul>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Wrong Email/Phone?</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Entered a wrong email/phone during registration? Reach out via{" "}
                <a href="https://ntexam.in/#contact" className="text-primary underline">Contact Us</a> with
                your payment reference and correct details, and we’ll update and resend digital documents.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Occasional physical dispatch */}
        <Card className="bg-card/95 backdrop-blur-sm border-border/60 shadow-card">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Trophy className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Physical Dispatch (If Applicable)</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              In rare cases (e.g., prizes/medals or printed certificates), we may ship physical items within India.
            </p>
            <ul className="list-disc ml-6 text-sm text-muted-foreground space-y-2">
              <li><strong>Processing Time:</strong> Usually 5–7 business days after announcement.</li>
              <li><strong>Delivery Time:</strong> 3–7 business days in metro/urban areas; additional time in remote locations.</li>
              <li><strong>Charges:</strong> If applicable, communicated beforehand during address collection.</li>
              <li><strong>Tracking:</strong> We’ll share a tracking link via email/SMS when dispatched.</li>
              <li><strong>Failed Delivery / Address Issues:</strong> If a package is returned due to an incorrect or unavailable address, we’ll coordinate a re-dispatch. Re-shipping charges may apply.</li>
              <li><strong>Damage/Loss in Transit:</strong> Notify us within 48 hours of delivery attempt with photos/video; we’ll work with the courier for resolution/replacement as feasible.</li>
              <li><strong>International Shipping:</strong> Not available by default. Contact us for special requests.</li>
            </ul>
          </CardContent>
        </Card>

        {/* Other policies + support */}
        <Card className="bg-card/95 backdrop-blur-sm border-border/60 shadow-card">
          <CardContent className="p-6 grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Related Policies</h3>
              </div>
              <ul className="list-disc ml-6 text-sm text-muted-foreground space-y-2">
                <li>
                  <Link to="/cancellation-refund" className="text-primary underline">
                    Cancellations & Refunds
                  </Link>
                </li>
                <li>
                  <Link to="/terms-conditions" className="text-primary underline">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link to="/privacy-policy" className="text-primary underline">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <RefreshCcw className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Need Help?</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                For any delivery-related queries, please reach out via the{" "}
                <a href="https://ntexam.in/#contact" className="text-primary underline">Contact Us</a> section
                on our website with your order/registration details.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default ShippingPolicy;
