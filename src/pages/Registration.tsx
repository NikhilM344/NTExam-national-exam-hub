import { BookOpen, Users } from 'lucide-react';
import RegistrationForm from '@/components/RegistrationForm';

const Registration = () => {
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-gradient-hero text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="h-8 w-8" />
            <h1 className="text-3xl sm:text-4xl font-bold">
              Student Registration
            </h1>
            <Users className="h-8 w-8" />
          </div>
          <p className="text-xl text-white/90 mb-2">
            Join NTexam - National Talent Exam
          </p>
          <p className="text-white/80 max-w-2xl mx-auto">
            Complete your registration to participate in our competitive exams and showcase your academic talents. 
            Follow the step-by-step process to ensure accurate registration.
          </p>
        </div>
      </div>

      {/* Registration Form */}
      <div className="py-12">
        <RegistrationForm />
      </div>

      {/* Help Section */}
      <div className="bg-background py-8 border-t">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Need Help with Registration?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="bg-card p-4 rounded-lg shadow-soft">
                <h4 className="font-medium text-foreground mb-2">Technical Support</h4>
                <p className="text-muted-foreground">
                  Email: support@ntexam.in<br />
                  Phone: +91 9876543210
                </p>
              </div>
              <div className="bg-card p-4 rounded-lg shadow-soft">
                <h4 className="font-medium text-foreground mb-2">Registration Help</h4>
                <p className="text-muted-foreground">
                  Email: registration@ntexam.in<br />
                  Available: Mon-Fri 9AM-6PM
                </p>
              </div>
              <div className="bg-card p-4 rounded-lg shadow-soft">
                <h4 className="font-medium text-foreground mb-2">Payment Issues</h4>
                <p className="text-muted-foreground">
                  Email: payments@ntexam.in<br />
                  Response within 24 hours
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;