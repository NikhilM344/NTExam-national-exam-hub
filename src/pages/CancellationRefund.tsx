import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { RefreshCw } from 'lucide-react';

const CancellationRefund = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header Section */}
      <section className="relative py-12 bg-gradient-hero text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl shadow-soft">
              <RefreshCw className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Cancellation & Refund Policy
          </h1>
          <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto">
            Navoday Talent Exam - Transparent Terms for Cancellations and Refunds
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card rounded-2xl shadow-card p-8 space-y-8">
            <div className="text-center mb-8">
              <p className="text-muted-foreground text-lg leading-relaxed">
                At Navoday Talent Exam ("we," "our," "us"), we strive to provide a smooth and transparent registration process. 
                This Cancellation & Refund Policy explains the terms under which candidates may request a cancellation or refund 
                of their exam fees. By registering for the exam, you agree to the terms outlined below.
              </p>
            </div>

            <div className="space-y-8">
              <div className="border-l-4 border-primary pl-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">1. Cancellation by the Candidate</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Once registration and payment are completed, cancellations are generally not permitted.</li>
                  <li>• Candidates who are unable to attend the exam may contact our support team at least 30 days before the scheduled exam date to request consideration for rescheduling (subject to approval and availability).</li>
                  <li>• No cancellations will be accepted after the registration deadline.</li>
                </ul>
              </div>

              <div className="border-l-4 border-secondary pl-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">2. Refund Policy</h2>
                <p className="text-muted-foreground mb-4">Exam fees are non-refundable except in cases where:</p>
                <ul className="space-y-2 text-muted-foreground ml-4">
                  <li>o The exam is cancelled or postponed by Navoday Talent Exam for reasons beyond the candidate's control.</li>
                  <li>o Duplicate payments are made due to a technical error.</li>
                </ul>
                <div className="mt-4 space-y-2 text-muted-foreground">
                  <p>• In approved refund cases, the amount will be credited to the original payment method within 15–30 working days.</p>
                  <p>• Transaction charges, if any, will be deducted from the refund amount.</p>
                </div>
              </div>

              <div className="border-l-4 border-accent pl-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">3. Cancellation by the Institute</h2>
                <p className="text-muted-foreground mb-4">We reserve the right to cancel, postpone, or reschedule the exam in cases such as:</p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Technical issues or server downtime.</li>
                  <li>• Natural disasters, emergencies, or government restrictions.</li>
                  <li>• Any other unforeseen circumstances.</li>
                </ul>
                <p className="text-muted-foreground mt-4 mb-2">In such cases, candidates will be offered either:</p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• A full refund, or</li>
                  <li>• The option to reschedule for a future exam date at no additional cost.</li>
                </ul>
              </div>

              <div className="border-l-4 border-warning pl-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">4. No-Show Policy</h2>
                <p className="text-muted-foreground">
                  Candidates who fail to appear for the exam on the scheduled date and time will not be eligible for a refund 
                  or rescheduling, except in documented medical emergencies or unavoidable circumstances (subject to our discretion).
                </p>
              </div>

              <div className="border-l-4 border-primary pl-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">5. How to Request a Refund</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Email us at nteexam@gmail.com with your name, registration number, payment receipt, and reason for refund.</li>
                  <li>• All requests will be reviewed, and our decision will be final.</li>
                </ul>
              </div>

              <div className="bg-gradient-card rounded-xl p-6 border border-border">
                <h2 className="text-2xl font-bold text-foreground mb-4">6. Contact Us</h2>
                <p className="text-muted-foreground mb-4">
                  For any cancellation or refund-related queries, please reach out to:
                </p>
                <div className="space-y-2 text-muted-foreground">
                  <p><strong>Navoday Talent Exam</strong></p>
                  <p><strong>Email:</strong> nteexam@gmail.com</p>
                  <p><strong>Phone:</strong> +919426060635</p>
                  <p><strong>Address:</strong> 305, 3rd Floor, Flamingo, Sargasan, Gandhinagar, Gujarat-382421</p>
                </div>
              </div>

              {/* Important Notice */}
              <div className="bg-warning/10 border border-warning/30 rounded-xl p-6">
                <h3 className="text-lg font-bold text-foreground mb-3">Important Notice</h3>
                <p className="text-muted-foreground">
                  Please read this policy carefully before registering for the exam. By completing your registration and payment, 
                  you acknowledge that you have read, understood, and agreed to these terms and conditions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CancellationRefund;