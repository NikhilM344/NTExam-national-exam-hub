import { useState } from 'react';
import { Calendar, User, MapPin, Phone, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PersonalInfo, states } from '@/utils/registrationUtils';

interface PersonalInfoStepProps {
  data: PersonalInfo;
  onUpdate: (data: PersonalInfo) => void;
  errors: Record<string, string>;
}

const PersonalInfoStep = ({ data, onUpdate, errors }: PersonalInfoStepProps) => {
  const handleInputChange = (field: keyof PersonalInfo, value: string) => {
    onUpdate({
      ...data,
      [field]: value
    });
  };

  return (
    <Card className="shadow-card bg-gradient-card border-0">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
          <User className="h-6 w-6 text-primary" />
          Personal Information
        </CardTitle>
        <p className="text-muted-foreground">Please provide your personal details accurately</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-sm font-medium text-foreground">
            Full Name *
          </Label>
          <Input
            id="fullName"
            type="text"
            value={data.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            placeholder="Enter your full name as per school records"
            className={`bg-background ${errors.fullName ? 'border-destructive' : 'border-border'}`}
          />
          {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
        </div>

        {/* Date of Birth and Gender */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth" className="text-sm font-medium text-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Date of Birth *
            </Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={data.dateOfBirth}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              className={`bg-background ${errors.dateOfBirth ? 'border-destructive' : 'border-border'}`}
            />
            {errors.dateOfBirth && <p className="text-sm text-destructive">{errors.dateOfBirth}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              Gender *
            </Label>
            <Select value={data.gender} onValueChange={(value: 'male' | 'female' | 'other') => handleInputChange('gender', value)}>
              <SelectTrigger className={`bg-background ${errors.gender ? 'border-destructive' : 'border-border'}`}>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && <p className="text-sm text-destructive">{errors.gender}</p>}
          </div>
        </div>

        {/* Address */}
        <div className="space-y-2">
          <Label htmlFor="address" className="text-sm font-medium text-foreground flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            Address *
          </Label>
          <Input
            id="address"
            type="text"
            value={data.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            placeholder="Enter your complete address"
            className={`bg-background ${errors.address ? 'border-destructive' : 'border-border'}`}
          />
          {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
        </div>

        {/* City, State, Postal Code */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city" className="text-sm font-medium text-foreground">
              City *
            </Label>
            <Input
              id="city"
              type="text"
              value={data.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              placeholder="City"
              className={`bg-background ${errors.city ? 'border-destructive' : 'border-border'}`}
            />
            {errors.city && <p className="text-sm text-destructive">{errors.city}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              State *
            </Label>
            <Select value={data.state} onValueChange={(value) => handleInputChange('state', value)}>
              <SelectTrigger className={`bg-background ${errors.state ? 'border-destructive' : 'border-border'}`}>
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
            {errors.state && <p className="text-sm text-destructive">{errors.state}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="postalCode" className="text-sm font-medium text-foreground">
              Postal Code *
            </Label>
            <Input
              id="postalCode"
              type="text"
              value={data.postalCode}
              onChange={(e) => handleInputChange('postalCode', e.target.value)}
              placeholder="PIN Code"
              className={`bg-background ${errors.postalCode ? 'border-destructive' : 'border-border'}`}
            />
            {errors.postalCode && <p className="text-sm text-destructive">{errors.postalCode}</p>}
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="contactNumber" className="text-sm font-medium text-foreground flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              Contact Number *
            </Label>
            <Input
              id="contactNumber"
              type="tel"
              value={data.contactNumber}
              onChange={(e) => handleInputChange('contactNumber', e.target.value)}
              placeholder="Enter your mobile number"
              className={`bg-background ${errors.contactNumber ? 'border-destructive' : 'border-border'}`}
            />
            {errors.contactNumber && <p className="text-sm text-destructive">{errors.contactNumber}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-foreground flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter your email address"
              className={`bg-background ${errors.email ? 'border-destructive' : 'border-border'}`}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>
          {/* Password */}
<div className="grid gap-2">
  <label htmlFor="password" className="text-sm font-medium">Create Password</label>
  <input
    id="password"
    type="password"
    value={data.password}
    onChange={(e) => onUpdate({ ...data, password: e.target.value })}
    className="border rounded-md px-3 py-2"
    placeholder="Enter a strong password"
    required
  />
  {errors?.password && (
    <p className="text-xs text-red-500">{errors.password}</p>
  )}
  <p className="text-xs text-muted-foreground">
    Minimum 6 characters. You’ll use this to log in.
  </p>
</div>

        </div>

        {/* Important Note */}
        <div className="bg-muted/50 rounded-lg p-4 border-l-4 border-primary">
          <h4 className="font-semibold text-foreground mb-2">Important Note:</h4>
          <p className="text-sm text-muted-foreground">
            Please remember this for logging into your student dashboard after registration.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoStep;