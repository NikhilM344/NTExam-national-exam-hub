import { Building, MapPin, GraduationCap, Hash } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SchoolInfo, states, classes } from '@/utils/registrationUtils';

interface SchoolInfoStepProps {
  data: SchoolInfo;
  onUpdate: (data: SchoolInfo) => void;
  errors: Record<string, string>;
}

const SchoolInfoStep = ({ data, onUpdate, errors }: SchoolInfoStepProps) => {
  const handleInputChange = (field: keyof SchoolInfo, value: string) => {
    onUpdate({
      ...data,
      [field]: value
    });
  };

  return (
    <Card className="shadow-card bg-gradient-card border-0">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Building className="h-6 w-6 text-primary" />
          School Information
        </CardTitle>
        <p className="text-muted-foreground">Please provide your school details accurately</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* School Name */}
        <div className="space-y-2">
          <Label htmlFor="schoolName" className="text-sm font-medium text-foreground">
            Name of the School *
          </Label>
          <Input
            id="schoolName"
            type="text"
            value={data.schoolName}
            onChange={(e) => handleInputChange('schoolName', e.target.value)}
            placeholder="Enter your school name"
            className={`bg-background ${errors.schoolName ? 'border-destructive' : 'border-border'}`}
          />
          {errors.schoolName && <p className="text-sm text-destructive">{errors.schoolName}</p>}
        </div>

        {/* School Address */}
        <div className="space-y-2">
          <Label htmlFor="schoolAddress" className="text-sm font-medium text-foreground flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            School Address *
          </Label>
          <Input
            id="schoolAddress"
            type="text"
            value={data.schoolAddress}
            onChange={(e) => handleInputChange('schoolAddress', e.target.value)}
            placeholder="Enter complete school address"
            className={`bg-background ${errors.schoolAddress ? 'border-destructive' : 'border-border'}`}
          />
          {errors.schoolAddress && <p className="text-sm text-destructive">{errors.schoolAddress}</p>}
        </div>

        {/* School City, State, Postal Code */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="schoolCity" className="text-sm font-medium text-foreground">
              School City *
            </Label>
            <Input
              id="schoolCity"
              type="text"
              value={data.schoolCity}
              onChange={(e) => handleInputChange('schoolCity', e.target.value)}
              placeholder="City"
              className={`bg-background ${errors.schoolCity ? 'border-destructive' : 'border-border'}`}
            />
            {errors.schoolCity && <p className="text-sm text-destructive">{errors.schoolCity}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              School State *
            </Label>
            <Select value={data.schoolState} onValueChange={(value) => handleInputChange('schoolState', value)}>
              <SelectTrigger className={`bg-background ${errors.schoolState ? 'border-destructive' : 'border-border'}`}>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                {states.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.schoolState && <p className="text-sm text-destructive">{errors.schoolState}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="schoolPostalCode" className="text-sm font-medium text-foreground">
              School Postal Code *
            </Label>
            <Input
              id="schoolPostalCode"
              type="text"
              value={data.schoolPostalCode}
              onChange={(e) => handleInputChange('schoolPostalCode', e.target.value)}
              placeholder="PIN Code"
              className={`bg-background ${errors.schoolPostalCode ? 'border-destructive' : 'border-border'}`}
            />
            {errors.schoolPostalCode && <p className="text-sm text-destructive">{errors.schoolPostalCode}</p>}
          </div>
        </div>

        {/* Class and Roll Number */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-primary" />
              Class/Grade *
            </Label>
            <Select value={data.classGrade} onValueChange={(value) => handleInputChange('classGrade', value)}>
              <SelectTrigger className={`bg-background ${errors.classGrade ? 'border-destructive' : 'border-border'}`}>
                <SelectValue placeholder="Select your class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((className) => (
                  <SelectItem key={className} value={className}>
                    {className}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.classGrade && <p className="text-sm text-destructive">{errors.classGrade}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="rollNumber" className="text-sm font-medium text-foreground flex items-center gap-2">
              <Hash className="h-4 w-4 text-primary" />
              Roll Number (if applicable)
            </Label>
            <Input
              id="rollNumber"
              type="text"
              value={data.rollNumber || ''}
              onChange={(e) => handleInputChange('rollNumber', e.target.value)}
              placeholder="Enter your roll number (optional)"
              className="bg-background border-border"
            />
            <p className="text-xs text-muted-foreground">
              Leave blank if your school doesn't use roll numbers
            </p>
          </div>
        </div>

        {/* Information Note */}
        <div className="bg-muted/50 rounded-lg p-4 border-l-4 border-success">
          <h4 className="font-semibold text-foreground mb-2">Why do we need school information?</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• To verify your academic credentials</li>
            <li>• To send exam-related communications to your school</li>
            <li>• To maintain accurate records for certification</li>
            <li>• To coordinate with educational institutions</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default SchoolInfoStep;