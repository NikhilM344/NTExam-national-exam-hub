import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { BookOpen, Shield } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header Section */}
      <section className="relative py-12 bg-gradient-hero text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl shadow-soft">
              <Shield className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto">
            Navoday Talent Exam - Protecting Your Personal Information
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card rounded-2xl shadow-card p-8 space-y-8">
            <div className="text-center mb-8">
              <p className="text-muted-foreground text-lg leading-relaxed">
                At Navoday Talent Exam, we respect your privacy and are committed to protecting your personal information. 
                This Privacy Policy explains how we collect, use, and safeguard the information you provide when you register 
                for or participate in our online examinations, access our website, or use our services.
              </p>
            </div>

            <div className="space-y-8">
              <div className="border-l-4 border-primary pl-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">1. Information We Collect</h2>
                <p className="text-muted-foreground mb-4">We may collect the following information from you:</p>
                <ul className="space-y-2 text-muted-foreground">
                  <li><strong>Personal Details:</strong> Name, date of birth, gender, contact number, email address, postal address.</li>
                  <li><strong>Academic Information:</strong> School/college name, class, subjects, and performance records.</li>
                  <li><strong>Login & Account Data:</strong> Username, password, and account activity logs.</li>
                  <li><strong>Payment Details:</strong> Transaction ID, payment mode, and billing information (processed via secure third-party gateways).</li>
                  <li><strong>Technical Data:</strong> IP address, browser type, device details, and cookies for improving user experience.</li>
                </ul>
              </div>

              <div className="border-l-4 border-secondary pl-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">2. How We Use Your Information</h2>
                <p className="text-muted-foreground mb-4">We use the information collected for:</p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Registering candidates for the Navoday Talent Exam.</li>
                  <li>• Conducting online examinations and evaluating results.</li>
                  <li>• Sending exam notifications, updates, and announcements.</li>
                  <li>• Processing payments and generating receipts.</li>
                  <li>• Providing customer support and resolving queries.</li>
                  <li>• Improving our website's functionality and security.</li>
                  <li>• Complying with legal obligations.</li>
                </ul>
              </div>

              <div className="border-l-4 border-accent pl-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">3. Data Security</h2>
                <p className="text-muted-foreground">
                  We implement industry-standard security measures to protect your personal information from unauthorized 
                  access, alteration, disclosure, or destruction. However, no method of data transmission or storage is 100% 
                  secure, and we cannot guarantee absolute security.
                </p>
              </div>

              <div className="border-l-4 border-warning pl-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">4. Sharing of Information</h2>
                <p className="text-muted-foreground mb-4">We do not sell, rent, or trade your personal data. We may share information only with:</p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Authorized exam partners and evaluators for conducting assessments.</li>
                  <li>• Payment gateway providers to process transactions securely.</li>
                  <li>• Legal authorities if required by law or to protect our legal rights.</li>
                </ul>
              </div>

              <div className="border-l-4 border-primary pl-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">5. Cookies and Tracking Technologies</h2>
                <p className="text-muted-foreground">
                  Our website may use cookies to enhance your browsing experience. You can choose to disable cookies in your 
                  browser settings, but some features of the website may not function properly.
                </p>
              </div>

              <div className="border-l-4 border-secondary pl-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">6. Your Rights</h2>
                <p className="text-muted-foreground mb-4">You have the right to:</p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Access and review your personal data.</li>
                  <li>• Request corrections to inaccurate information.</li>
                  <li>• Withdraw consent for non-essential data processing.</li>
                  <li>• Request deletion of your account and associated data (subject to exam and legal requirements).</li>
                </ul>
              </div>

              <div className="border-l-4 border-accent pl-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">7. Third-Party Links</h2>
                <p className="text-muted-foreground">
                  Our website may contain links to external sites. We are not responsible for the privacy practices of these 
                  websites and encourage you to review their privacy policies.
                </p>
              </div>

              <div className="border-l-4 border-warning pl-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">8. Policy Updates</h2>
                <p className="text-muted-foreground">
                  We may update this Privacy Policy from time to time to reflect changes in our practices. Updates will be 
                  posted on this page with the "Last Updated" date revised accordingly.
                </p>
              </div>

              <div className="bg-gradient-card rounded-xl p-6 border border-border">
                <h2 className="text-2xl font-bold text-foreground mb-4">9. Contact Us</h2>
                <p className="text-muted-foreground mb-4">
                  If you have any questions or concerns regarding this Privacy Policy, you can contact us at:
                </p>
                <div className="space-y-2 text-muted-foreground">
                  <p><strong>Navoday Talent Exam</strong></p>
                  <p><strong>Email:</strong> nteexam@gmail.com</p>
                  <p><strong>Phone:</strong> +919426060635</p>
                  <p><strong>Address:</strong> 305, 3rd Floor, Flamingo, Sargasan, Gandhinagar, Gujarat 382421</p>
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

export default PrivacyPolicy;