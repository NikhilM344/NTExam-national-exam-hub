import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useLoadingContext } from "@/context/LoadingContext";

import PersonalInfoStep from "./registration/PersonalInfo";
import SchoolInfoStep from "./registration/SchoolInfo";
// import ExamDetailsStep from "./registration/ExamDetails";
import ParentInfoStep from "./registration/ParentInfo";

import {
  RegistrationData,
  PersonalInfo,
  SchoolInfo,
  ExamDetails,
  ParentInfo,
  calculateFees,
} from "@/utils/registrationUtils";

import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

/**
 * Subject auto-mapper
 * --------------------------------------------------
 * - Grades 2–10 → ["Maths","Science","Hindi","English"]
 * - 11/12 Arts → ["History","Economics","Geography","Psychology","Sociology","Hindi","English"]
 * - 11/12 Commerce → ["Accountancy","Business Studies","Economics","English"]
 * - 11/12 Science PCB → ["Physics","Chemistry","Biology","Hindi","English"]
 * - 11/12 Science PCM → ["Physics","Chemistry","Mathematics","Hindi","English"]
 */
function parseGrade(raw: string | undefined) {
  const s = (raw || "").toLowerCase().replace(/\s+/g, " ").trim();

  // Extract numeric grade if present
  const numMatch = s.match(/\b(2|3|4|5|6|7|8|9|10|11|12)\b/);
  const gradeNum = numMatch ? parseInt(numMatch[1], 10) : undefined;

  const isArts = /\barts?\b/.test(s);
  const isCommerce = /\bcommerce\b/.test(s);
  const isScience = /\bscience\b/.test(s);
  const isPCB = /\bpcb\b/.test(s) || /\bbiology\b/.test(s);
  const isPCM = /\bpcm\b/.test(s) || /\b(mathematics|maths)\b/.test(s);

  return { gradeNum, isArts, isCommerce, isScience, isPCB, isPCM, raw: s };
}

function subjectsForClass(classGrade: string | undefined): string[] {
  const { gradeNum, isArts, isCommerce, isScience, isPCB, isPCM } = parseGrade(classGrade);

  // 2–10
  if (gradeNum && gradeNum >= 2 && gradeNum <= 10) {
    return ["Maths", "Science", "Hindi", "English"];
  }

  // 11/12 streams
  if (gradeNum && (gradeNum === 11 || gradeNum === 12)) {
    if (isArts) {
      return [
        "History",
        "Economics",
        "Geography",
        "Psychology",
        "Sociology",
        "Hindi",
        "English",
      ];
    }
    if (isCommerce) {
      return ["Accountancy", "Business Studies", "Economics", "English"];
    }
    if (isScience && isPCB) {
      return ["Physics", "Chemistry", "Biology", "Hindi", "English"];
    }
    if (isScience && isPCM) {
      return ["Physics", "Chemistry", "Mathematics", "Hindi", "English"];
    }
    // If 'science' but not specified, leave empty or choose a default.
    if (isScience) return [];
  }

  // Unknown → empty list
  return [];
}

const RegistrationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { startLoading, stopLoading } = useLoadingContext();

  const [formData, setFormData] = useState<RegistrationData>({
    personalInfo: {
      fullName: "",
      dateOfBirth: "",
      gender: "male",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      contactNumber: "",
      email: "",        // OPTIONAL
      password: "",     // REQUIRED (min 6)
    },
    schoolInfo: {
      schoolName: "",
      schoolAddress: "",
      schoolCity: "",
      schoolState: "",
      schoolPostalCode: "",
      classGrade: "",   // ← auto-subjects depend on this
      rollNumber: "",
    },
    examDetails: {
      subjects: [],     // ← will be auto-filled
      examCenter: "",
      examDate: "",
    },
    parentInfo: {
      parentName: "",
      parentContactNumber: "",
      parentEmail: "",
    },
    termsAccepted: false,
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps = [
    { number: 1, title: "Personal Info", description: "Basic information" },
    { number: 2, title: "School Info", description: "School details" },
    // { number: 3, title: "Exam Details", description: "Subject selection" },
    { number: 3, title: "Undertaking", description: "Parent/Guardian & Policy" },
  ];

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1: {
        const p = formData.personalInfo;
        if (!p.fullName.trim()) newErrors.fullName = "Full name is required";
        if (!p.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
        if (!p.gender) newErrors.gender = "Gender is required";
        if (!p.address.trim()) newErrors.address = "Address is required";
        if (!p.city.trim()) newErrors.city = "City is required";
        if (!p.state) newErrors.state = "State is required";
        if (!p.postalCode.trim()) newErrors.postalCode = "Postal code is required";

        if (!p.contactNumber.trim()) {
          newErrors.contactNumber = "Mobile number is required";
        } else {
          const digits = p.contactNumber.replace(/\D/g, "");
          if (digits.length < 10) newErrors.contactNumber = "Enter a valid mobile number";
        }

        if (p.email.trim().length > 0) {
          const ok = /\S+@\S+\.\S+/.test(p.email);
          if (!ok) newErrors.email = "Invalid email format";
        }

        if (!p.password.trim()) newErrors.password = "Password is required";
        else if (p.password.length < 6)
          newErrors.password = "Password must be at least 6 characters";
        break;
      }

      case 2: {
        const s = formData.schoolInfo;
        if (!s.schoolName.trim()) newErrors.schoolName = "School name is required";
        if (!s.schoolAddress.trim()) newErrors.schoolAddress = "School address is required";
        if (!s.classGrade) newErrors.classGrade = "Class/Grade is required";
        break;
      }

      case 3: {
        const g = formData.parentInfo;
        if (!g.parentName.trim()) newErrors.parentName = "Parent/Guardian name is required";
        if (!g.parentContactNumber.trim())
          newErrors.parentContactNumber = "Parent contact number is required";
        if (!g.parentEmail.trim()) newErrors.parentEmail = "Parent email is required";
        else if (!/\S+@\S+\.\S+/.test(g.parentEmail))
          newErrors.parentEmail = "Invalid email format";
        break;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) setCurrentStep((prev) => prev + 1);
  };

  const handlePrevious = () => setCurrentStep((prev) => prev - 1);

  // 🔁 When School Info is updated, recompute subjects based on classGrade
  const updateSchoolInfo = (data: SchoolInfo) => {
    setFormData((prev) => {
      const newSubjects = subjectsForClass(data.classGrade);
      return {
        ...prev,
        schoolInfo: data,
        examDetails: {
          ...prev.examDetails,
          subjects: newSubjects, // auto-set
        },
      };
    });
  };

  const updatePersonalInfo = (data: PersonalInfo) => {
    setFormData((prev) => ({ ...prev, personalInfo: data }));
  };

  const updateExamDetails = (data: ExamDetails) => {
    setFormData((prev) => ({ ...prev, examDetails: data }));
  };

  const updateParentInfo = (data: ParentInfo) => {
    setFormData((prev) => ({ ...prev, parentInfo: data }));
  };

  const handleSubmit = async () => {
    if (!formData.termsAccepted) {
      toast({
        title: "Please accept terms",
        description: "You must accept the Terms & Conditions to continue.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      startLoading("Processing your registration...");

      const p = formData.personalInfo;
      const s = formData.schoolInfo;
      const g = formData.parentInfo;

      const phone = (p.contactNumber || "").trim();
      const email = p.email?.trim() ? p.email.trim().toLowerCase() : null;
      const password_hash = await bcrypt.hash(p.password, 10);
      const fees = calculateFees(p.gender);
      const id = crypto.randomUUID();

      const subjects = Array.isArray(formData.examDetails.subjects)
        ? formData.examDetails.subjects
        : [];

      const payload = {
        id,
        full_name: p.fullName,
        date_of_birth: p.dateOfBirth,
        gender: p.gender,
        address: p.address,
        city: p.city,
        state: p.state,
        postal_code: p.postalCode,
        contact_number: phone,
        email,
        school_name: s.schoolName,
        school_address: s.schoolAddress,
        class_grade: s.classGrade,
        roll_number: s.rollNumber || null,

        subjects,                 // ← auto-filled list
        exam_center: null,
        exam_date: null,

        parent_name: g.parentName,
        parent_contact_number: g.parentContactNumber,
        parent_email: g.parentEmail,

        terms_accepted: formData.termsAccepted,
        fees,
        is_paid: false,

        password_hash,
      };

      const { data, error } = await supabase
        .from("registrations")
        .insert([payload])
        .select("id")
        .single();

      if (error) {
        if ((error as any).code === "23505") {
          throw new Error("This mobile number is already registered.");
        }
        throw error;
      }

      const registrationId = data.id;

      localStorage.setItem("registrationId", registrationId);
      localStorage.setItem("examFees", String(fees));
      localStorage.setItem("registrationData", JSON.stringify(formData));

      stopLoading();
      setIsSubmitting(false);

      toast({ title: "Registration Successful!", description: "Redirecting to payment..." });

      window.location.href = "/payment";
    } catch (err: any) {
      stopLoading();
      setIsSubmitting(false);
      toast({
        title: "Registration failed",
        description: err?.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoStep
            data={formData.personalInfo}
            onUpdate={updatePersonalInfo}
            errors={errors}
          />
        );
      case 2:
        return (
          <SchoolInfoStep
            data={formData.schoolInfo}
            onUpdate={updateSchoolInfo} // auto-sets subjects when class changes
            errors={errors}
          />
        );
      // case 3:
      //   return (
      //     <ExamDetailsStep
      //       data={formData.examDetails}
      //       onUpdate={updateExamDetails}
      //       errors={errors}
      //     />
      //   );
      case 3:
        return (
          <ParentInfoStep
            data={formData.parentInfo}
            onUpdate={updateParentInfo}
            errors={errors}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.number
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-muted-foreground text-muted-foreground"
                }`}
              >
                {currentStep > step.number ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  step.number
                )}
              </div>
              <div className="ml-3 text-left">
                <p
                  className={`text-sm font-medium ${
                    currentStep >= step.number ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {step.title}
                </p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-4 ${
                    currentStep > step.number ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="mb-8">{renderStep()}</div>

      {/* Terms & Conditions (Final Step) */}
      {currentStep === 3 && (
        <Card className="mb-6 shadow-card bg-gradient-card border-0">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="terms"
                checked={formData.termsAccepted}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    termsAccepted: checked as boolean,
                  }))
                }
              />
              <div className="space-y-2">
                <label
                  htmlFor="terms"
                  className="text-sm font-medium text-foreground cursor-pointer"
                >
                  I accept the Terms & Conditions *
                </label>
                <p className="text-xs text-muted-foreground">
                  By registering, you agree to our terms of service, privacy policy, and
                  examination guidelines.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        <div className="flex gap-3">
          {currentStep < 3 ? (
            <Button
              onClick={handleNext}
              className="bg-gradient-primary hover:opacity-90 text-primary-foreground flex items-center gap-2"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.termsAccepted}
              className="bg-gradient-success hover:opacity-90 text-success-foreground flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Complete Registration
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Important Information */}
      <div className="mt-8 bg-muted/50 rounded-lg p-4 border-l-4 border-warning">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-foreground mb-1">Important Information:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Registration fees: Boys ₹350, Girls ₹250</li>
              <li>• Payment must be completed to confirm your registration</li>
              <li>• You will be redirected to the secure payment page after submission</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
