import { BookOpen, Calendar, MapPin, CheckSquare } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ExamDetails, subjects, examCenters } from '@/utils/registrationUtils';

interface ExamDetailsStepProps {
  data: ExamDetails;
  onUpdate: (data: ExamDetails) => void;
  errors: Record<string, string>;
}

const ExamDetailsStep = ({ data, onUpdate, errors }: ExamDetailsStepProps) => {
  const handleSubjectToggle = (subject: string, checked: boolean) => {
    const newSubjects = checked 
      ? [...data.subjects, subject]
      : data.subjects.filter(s => s !== subject);
    
    onUpdate({
      ...data,
      subjects: newSubjects
    });
  };

  const handleInputChange = (field: keyof ExamDetails, value: string) => {
    onUpdate({
      ...data,
      [field]: value
    });
  };

  // Upcoming exam dates for different classes
  const examDates = [
    { date: '2024-03-25', label: 'March 25, 2024 - Class 6 Exam' },
    { date: '2024-03-28', label: 'March 28, 2024 - Class 7 Exam' },
    { date: '2024-03-30', label: 'March 30, 2024 - Class 8 Exam' },
    { date: '2024-04-02', label: 'April 2, 2024 - Class 9 Exam' },
    { date: '2024-04-05', label: 'April 5, 2024 - Class 10 Exam' },
    { date: '2024-04-08', label: 'April 8, 2024 - Class 12 Exam' },
  ];

  return (
    <Card className="shadow-card bg-gradient-card border-0">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          Exam Details
        </CardTitle>
        <p className="text-muted-foreground">Select your exam preferences and subjects</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Subject Selection */}
        <div className="space-y-4">
          <Label className="text-sm font-medium text-foreground flex items-center gap-2">
            <CheckSquare className="h-4 w-4 text-primary" />
            Subject(s) for Registration *
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {subjects.map((subject) => (
              <div key={subject} className="flex items-center space-x-2">
                <Checkbox
                  id={`subject-${subject}`}
                  checked={data.subjects.includes(subject)}
                  onCheckedChange={(checked) => handleSubjectToggle(subject, checked as boolean)}
                />
                <Label 
                  htmlFor={`subject-${subject}`} 
                  className="text-sm font-normal text-foreground cursor-pointer"
                >
                  {subject}
                </Label>
              </div>
            ))}
          </div>
          {errors.subjects && <p className="text-sm text-destructive">{errors.subjects}</p>}
          
          {/* Selected Subjects Display */}
          {data.subjects.length > 0 && (
            <div className="mt-3">
              <p className="text-sm font-medium text-foreground mb-2">Selected Subjects:</p>
              <div className="flex flex-wrap gap-2">
                {data.subjects.map((subject) => (
                  <Badge key={subject} variant="secondary" className="bg-primary/10 text-primary">
                    {subject}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Exam Center Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            Preferred Exam Center
          </Label>
          <Select 
            value={data.examCenter || ''} 
            onValueChange={(value) => handleInputChange('examCenter', value)}
          >
            <SelectTrigger className="bg-background border-border">
              <SelectValue placeholder="Select your preferred exam center" />
            </SelectTrigger>
            <SelectContent className="max-h-[200px]">
              {examCenters.map((center) => (
                <SelectItem key={center} value={center}>
                  {center}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Choose the exam center nearest to your location. Final allocation depends on availability.
          </p>
        </div>

        {/* Exam Date Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Exam Date
          </Label>
          <Select 
            value={data.examDate || ''} 
            onValueChange={(value) => handleInputChange('examDate', value)}
          >
            <SelectTrigger className="bg-background border-border">
              <SelectValue placeholder="Select exam date (if specified)" />
            </SelectTrigger>
            <SelectContent>
              {examDates.map((exam) => (
                <SelectItem key={exam.date} value={exam.date}>
                  {exam.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Select the exam date that corresponds to your class level.
          </p>
        </div>

        {/* Exam Information */}
        <div className="bg-muted/50 rounded-lg p-4 border-l-4 border-warning">
          <h4 className="font-semibold text-foreground mb-2">Exam Information:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Each exam is conducted in offline mode at selected centers</li>
            <li>• Exam duration varies by class (2-4 hours)</li>
            <li>• Hall tickets will be available 7 days before the exam</li>
            <li>• Results will be published within 15 days of exam completion</li>
            <li>• Certificates will be issued to all participants</li>
          </ul>
        </div>

        {/* Fee Structure Display */}
        <div className="bg-gradient-hero rounded-lg p-4 text-white">
          <h4 className="font-semibold mb-2">Registration Fees:</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="text-xl font-bold">₹350</div>
              <div className="text-white/80">Boys</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">₹250</div>
              <div className="text-white/80">Girls</div>
            </div>
          </div>
          <p className="text-xs text-white/80 mt-2 text-center">
            Payment will be processed after completing the registration form
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExamDetailsStep;