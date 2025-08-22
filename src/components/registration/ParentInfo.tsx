import { Users, Phone, Mail, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ParentInfo } from '@/utils/registrationUtils';

interface ParentInfoStepProps {
  data: ParentInfo;
  onUpdate: (data: ParentInfo) => void;
  errors: Record<string, string>;
}

const ParentInfoStep = ({ data, onUpdate, errors }: ParentInfoStepProps) => {
  const handleInputChange = (field: keyof ParentInfo, value: string) => {
    onUpdate({
      ...data,
      [field]: value
    });
  };

  return (
    <Card className="shadow-card bg-gradient-card border-0">
      {/* <CardHeader>
        <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          Parent/Guardian Information
        </CardTitle>
        <p className="text-muted-foreground">Please provide parent or guardian contact details</p>
      </CardHeader> */}
      <CardContent className="space-y-6">
        {/* Parent/Guardian Name */}
        {/* <div className="space-y-2">
          <Label htmlFor="parentName" className="text-sm font-medium text-foreground">
            Name of Parent/Guardian *
          </Label>
          <Input
            id="parentName"
            type="text"
            value={data.parentName}
            onChange={(e) => handleInputChange('parentName', e.target.value)}
            placeholder="Enter parent or guardian's full name"
            className={`bg-background ${errors.parentName ? 'border-destructive' : 'border-border'}`}
          />
          {errors.parentName && <p className="text-sm text-destructive">{errors.parentName}</p>}
        </div> */}

        {/* Contact Information */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="parentContactNumber" className="text-sm font-medium text-foreground flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              Contact Number *
            </Label>
            <Input
              id="parentContactNumber"
              type="tel"
              value={data.parentContactNumber}
              onChange={(e) => handleInputChange('parentContactNumber', e.target.value)}
              placeholder="Enter parent's mobile number"
              className={`bg-background ${errors.parentContactNumber ? 'border-destructive' : 'border-border'}`}
            />
            {errors.parentContactNumber && <p className="text-sm text-destructive">{errors.parentContactNumber}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="parentEmail" className="text-sm font-medium text-foreground flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              Email Address *
            </Label>
            <Input
              id="parentEmail"
              type="email"
              value={data.parentEmail}
              onChange={(e) => handleInputChange('parentEmail', e.target.value)}
              placeholder="Enter parent's email address"
              className={`bg-background ${errors.parentEmail ? 'border-destructive' : 'border-border'}`}
            />
            {errors.parentEmail && <p className="text-sm text-destructive">{errors.parentEmail}</p>}
          </div>
        </div> */}

        {/* Important Information */}
        <div className="space-y-4">
          {/* <div className="bg-muted/50 rounded-lg p-4 border-l-4 border-info">
            <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" />
              Why do we need parent/guardian information?
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• To send exam notifications and updates</li>
              <li>• To communicate important announcements</li>
              <li>• For emergency contact during exam days</li>
              <li>• To share student performance reports</li>
              <li>• To provide password reset assistance</li>
            </ul>
          </div> */}

          <div className="bg-gradient-success rounded-lg p-4 text-white">
            <h4 className="font-semibold mb-2">Communication Preferences:</h4>
            <div className="text-sm space-y-1">
              <p>✓ SMS notifications for important updates</p>
              <p>✓ Email reminders for exam dates and deadlines</p>
              <p>✓ WhatsApp updates (if number supports)</p>
              <p>✓ Parent portal access for tracking progress</p>
            </div>
          </div>

          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
            <h4 className="font-semibold text-foreground mb-2">Privacy & Security:</h4>
            <p className="text-sm text-muted-foreground">
              We respect your privacy and follow strict data protection guidelines. 
              Parent contact information is used solely for educational communication 
              and will never be shared with third parties without consent.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ParentInfoStep;