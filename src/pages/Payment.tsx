import { useState, useEffect } from 'react';
import { CreditCard, Shield, CheckCircle, ArrowLeft, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const Payment = () => {
  const [registrationData, setRegistrationData] = useState<any>(null);
  const [fees, setFees] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Get registration data from localStorage
    const storedData = localStorage.getItem('registrationData');
    const storedFees = localStorage.getItem('examFees');

    if (storedData) {
      setRegistrationData(JSON.parse(storedData));
    }
    if (storedFees) {
      setFees(parseInt(storedFees));
    }

    // If no data found, redirect to registration
    if (!storedData || !storedFees) {
      window.location.href = '/registration';
    }
  }, []);

  const handlePayment = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      toast({
        title: "Payment Successful!",
        description: "Your registration is now complete. Redirecting to student dashboard...",
      });

      // Store login credentials
      localStorage.setItem('studentLogin', JSON.stringify({
        email: registrationData?.personalInfo?.email,
        password: registrationData?.password,
        isLoggedIn: true,
        studentData: registrationData
      }));

      // Clear registration data
      localStorage.removeItem('registrationData');
      localStorage.removeItem('examFees');

      // Redirect to homepage
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    }, 3000);
  };

  const handleGoBack = () => {
    window.location.href = '/registration';
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
            Complete your registration payment for NTexam - National Talent Exam
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
                    <p><span className="font-medium">Name:</span> {registrationData.personalInfo.fullName}</p>
                    <p><span className="font-medium">Class:</span> {registrationData.schoolInfo.classGrade}</p>
                    <p><span className="font-medium">School:</span> {registrationData.schoolInfo.schoolName}</p>
                    <p><span className="font-medium">Email:</span> {registrationData.personalInfo.email}</p>
                  </div>
                </div>

                {/* Exam Details */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Exam Details</h4>
                  <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                    <div>
                      <span className="font-medium text-sm">Subjects:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {registrationData.examDetails.subjects.map((subject: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {registrationData.examDetails.examCenter && (
                      <p className="text-sm">
                        <span className="font-medium">Exam Center:</span> {registrationData.examDetails.examCenter}
                      </p>
                    )}
                    {registrationData.examDetails.examDate && (
                      <p className="text-sm">
                        <span className="font-medium">Exam Date:</span> {registrationData.examDetails.examDate}
                      </p>
                    )}
                  </div>
                </div>

                {/* Login Credentials */}
                <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Your Login Credentials
                  </h4>
                  <div className="text-sm space-y-1">
                    <p><span className="font-medium">Email:</span> {registrationData.personalInfo.email}</p>
                    <p><span className="font-medium">Password:</span> {registrationData.password}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Please save these credentials. You'll need them to access your student dashboard.
                    </p>
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
                      <span className="text-sm">Registration Fee ({registrationData.personalInfo.gender === 'female' ? 'Girls' : 'Boys'})</span>
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

                {/* Payment Button */}
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