import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { FileText } from 'lucide-react';

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header Section */}
      <section className="relative py-12 bg-gradient-hero text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl shadow-soft">
              <FileText className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Terms & Conditions
          </h1>
          <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto">
            Navoday Talent Exam - Rules and Guidelines
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card rounded-2xl shadow-card p-8 space-y-8">
            <div className="text-center mb-8">
              <p className="text-muted-foreground text-lg leading-relaxed">
                Welcome to the Navoday Talent Exam ("we," "our," "us"). These Terms & Conditions ("Terms") govern your registration, 
                participation, and use of our website and services. By accessing our platform, registering for the exam, or using our 
                services, you agree to comply with these Terms. If you do not agree, please refrain from using our services.
              </p>
            </div>

            <div className="space-y-8">
              <div className="border-l-4 border-primary pl-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">1. Eligibility</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Participants must meet the age, class, or qualification criteria as specified in the exam guidelines.</li>
                  <li>• All information provided during registration must be accurate, complete, and truthful.</li>
                  <li>• We reserve the right to verify eligibility before, during, or after the exam.</li>
                </ul>
              </div>

              <div className="border-l-4 border-secondary pl-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">2. Registration & Account</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Candidates must register using the official website or authorized channels.</li>
                  <li>• You are responsible for maintaining the confidentiality of your login credentials.</li>
                  <li>• Any unauthorized use of your account should be reported to us immediately.</li>
                </ul>
              </div>

              <div className="border-l-4 border-accent pl-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">3. Examination Rules</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• The exam must be taken under the conditions specified (e.g., time limits, permitted devices, and materials).</li>
                  <li>• Any form of cheating, impersonation, or malpractice will result in disqualification.</li>
                  <li>• We reserve the right to monitor and record the examination process for quality and security purposes.</li>
                </ul>
              </div>

              <div className="border-l-4 border-warning pl-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">4. Payments & Fees</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Exam fees must be paid in full before the exam date via approved payment methods.</li>
                  <li>• Fees are non-refundable unless otherwise stated in the refund policy.</li>
                  <li>• Any payment disputes must be raised within 7 days of the transaction.</li>
                </ul>
              </div>

              <div className="border-l-4 border-primary pl-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">5. Results & Certificates</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Results will be announced on the official website or via official communication channels.</li>
                  <li>• Certificates will be issued only to candidates who meet the qualifying criteria.</li>
                  <li>• We are not responsible for delays caused by unforeseen technical or administrative issues.</li>
                </ul>
              </div>

              <div className="border-l-4 border-secondary pl-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">6. Intellectual Property</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• All content on our website, including exam materials, questions, logos, and graphics, is our intellectual property.</li>
                  <li>• You may not copy, distribute, modify, or use our materials without written permission.</li>
                </ul>
              </div>

              <div className="border-l-4 border-accent pl-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">7. Limitation of Liability</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• We are not liable for any technical failures, internet issues, or disruptions during the exam.</li>
                  <li>• Our liability is limited to the amount paid for the exam fee.</li>
                  <li>• We are not responsible for losses arising from user negligence or misuse of our platform.</li>
                </ul>
              </div>

              <div className="border-l-4 border-warning pl-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">8. Privacy & Data Use</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Your personal information will be collected, processed, and stored in accordance with our Privacy Policy.</li>
                  <li>• By registering, you consent to the use of your information for exam administration and related purposes.</li>
                </ul>
              </div>

              <div className="border-l-4 border-primary pl-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">9. Prohibited Activities</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Misuse of the website or exam system.</li>
                  <li>• Attempting to hack, disrupt, or bypass security measures.</li>
                  <li>• Sharing login credentials or exam content with others.</li>
                </ul>
              </div>

              <div className="border-l-4 border-secondary pl-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">10. Amendments</h2>
                <p className="text-muted-foreground">
                  We reserve the right to update these Terms at any time. Any changes will be posted on this page with the 
                  "Last Updated" date revised accordingly. Continued use of our services after changes indicates your acceptance 
                  of the revised Terms.
                </p>
              </div>

              <div className="border-l-4 border-accent pl-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">11. Governing Law</h2>
                <p className="text-muted-foreground">
                  These Terms are governed by the laws of Gandhinagar, Gujarat. Any disputes will be subject to the jurisdiction 
                  of the courts in Gandhinagar, Gujarat.
                </p>
              </div>

              <div className="bg-gradient-card rounded-xl p-6 border border-border">
                <h2 className="text-2xl font-bold text-foreground mb-4">12. Contact Us</h2>
                <p className="text-muted-foreground mb-4">
                  For any queries regarding these Terms, contact:
                </p>
                <div className="space-y-2 text-muted-foreground">
                  <p><strong>Navoday Talent Exam</strong></p>
                  <p><strong>Email:</strong> nteexam@gmail.com</p>
                  <p><strong>Phone:</strong> +919426060635</p>
                  <p><strong>Address:</strong> 305, 3rd Floor, Flamingo, Sargasan, Gandhinagar, Gujarat-382421</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TermsConditions;