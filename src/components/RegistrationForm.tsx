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
      email: "",
      password: "", // NEW
    },
    schoolInfo: {
      schoolName: "",
      schoolAddress: "",
      schoolCity: "",
      schoolState: "",
      schoolPostalCode: "",
      classGrade: "",
      rollNumber: "",
    },
    examDetails: {
      subjects: [],
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
    { number: 3, title: "Undertaking", description: "Policy" },
  ];

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.personalInfo.fullName.trim())
          newErrors.fullName = "Full name is required";
        if (!formData.personalInfo.dateOfBirth)
          newErrors.dateOfBirth = "Date of birth is required";
        if (!formData.personalInfo.gender)
          newErrors.gender = "Gender is required";
        if (!formData.personalInfo.address.trim())
          newErrors.address = "Address is required";
        if (!formData.personalInfo.city.trim())
          newErrors.city = "City is required";
        if (!formData.personalInfo.state) newErrors.state = "State is required";
        if (!formData.personalInfo.postalCode.trim())
          newErrors.postalCode = "Postal code is required";
        if (!formData.personalInfo.contactNumber.trim())
          newErrors.contactNumber = "Contact number is required";
        if (!formData.personalInfo.email.trim())
          newErrors.email = "Email is required";
        if (
          formData.personalInfo.email &&
          !/\S+@\S+\.\S+/.test(formData.personalInfo.email)
        ) {
          newErrors.email = "Invalid email format";
          if (!formData.personalInfo.password.trim())
            newErrors.password = "Password is required";
          if (
            formData.personalInfo.password &&
            formData.personalInfo.password.length < 6
          ) {
            newErrors.password = "Password must be at least 6 characters";
          }
        }
        break;

      case 2:
        if (!formData.schoolInfo.schoolName.trim())
          newErrors.schoolName = "School name is required";
        if (!formData.schoolInfo.schoolAddress.trim())
          newErrors.schoolAddress = "School address is required";
        // if (!formData.schoolInfo.schoolCity.trim())
        //   newErrors.schoolCity = "School city is required";
        // if (!formData.schoolInfo.schoolState)
        //   newErrors.schoolState = "School state is required";
        // if (!formData.schoolInfo.schoolPostalCode.trim())
        //   newErrors.schoolPostalCode = "School postal code is required";
        if (!formData.schoolInfo.classGrade)
          newErrors.classGrade = "Class/Grade is required";
        break;

      // case 3:
      //   if (formData.examDetails.subjects.length === 0)
      //     newErrors.subjects = "Please select at least one subject";
      //   break;

      case 3:
        if (!formData.parentInfo.parentName.trim())
          newErrors.parentName = "Parent/Guardian name is required";
        if (!formData.parentInfo.parentContactNumber.trim())
          newErrors.parentContactNumber = "Parent contact number is required";
        if (!formData.parentInfo.parentEmail.trim())
          newErrors.parentEmail = "Parent email is required";
        if (
          formData.parentInfo.parentEmail &&
          !/\S+@\S+\.\S+/.test(formData.parentInfo.parentEmail)
        ) {
          newErrors.parentEmail = "Invalid email format";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };


const handleSubmit = async () => {
  if (!formData.termsAccepted) { /* toast + return */ }

  try {
    setIsSubmitting(true);
    startLoading("Processing your registration...", "study");

    const email = formData.personalInfo.email.trim().toLowerCase();
    const rawPassword = formData.personalInfo.password;
    const password_hash = await bcrypt.hash(rawPassword, 10);
    const fees = calculateFees(formData.personalInfo.gender);
    const id = crypto.randomUUID();

    const row = {
      id,
      full_name: formData.personalInfo.fullName,
      date_of_birth: formData.personalInfo.dateOfBirth,
      gender: formData.personalInfo.gender,
      address: formData.personalInfo.address,
      city: formData.personalInfo.city,
      state: formData.personalInfo.state,
      postal_code: formData.personalInfo.postalCode,
      contact_number: formData.personalInfo.contactNumber,
      email, // lowercase
      school_name: formData.schoolInfo.schoolName,
      school_address: formData.schoolInfo.schoolAddress,
      // school_city: formData.schoolInfo.schoolCity,
      // school_state: formData.schoolInfo.schoolState,
      // school_postal_code: formData.schoolInfo.schoolPostalCode,
      class_grade: formData.schoolInfo.classGrade,
      roll_number: formData.schoolInfo.rollNumber,
      subjects: formData.examDetails.subjects,
      exam_center: formData.examDetails.examCenter,
      exam_date: formData.examDetails.examDate || null,
      parent_name: formData.parentInfo.parentName,
      parent_contact_number: formData.parentInfo.parentContactNumber,
      parent_email: formData.parentInfo.parentEmail,
      terms_accepted: formData.termsAccepted,
      fees,
      password_hash,     // only the hash
      // is_paid: false    // include if you still keep this column; otherwise omit
    };

    const { error } = await supabase.from("registrations").insert([row]);
    if (error) throw error;

    stopLoading();
    setIsSubmitting(false);

    localStorage.setItem("registrationId", id);
    localStorage.setItem("examFees", String(fees));
    localStorage.setItem(
      "registrationData",
      JSON.stringify({ ...formData, password: rawPassword })
    );

    toast({ title: "Registration Successful!", description: `Redirecting to payment (₹${fees})...` });
    setTimeout(() => {
      startLoading("Redirecting to payment...", "book");
      window.location.href = "/payment";
    }, 1200);
  } catch (err: any) {
    stopLoading();
    setIsSubmitting(false);
    toast({ title: "Registration failed", description: err?.message || "Please try again.", variant: "destructive" });
  }
};


  const updatePersonalInfo = (data: PersonalInfo) => {
    setFormData((prev) => ({ ...prev, personalInfo: data }));
  };

  const updateSchoolInfo = (data: SchoolInfo) => {
    setFormData((prev) => ({ ...prev, schoolInfo: data }));
  };

  const updateExamDetails = (data: ExamDetails) => {
    setFormData((prev) => ({ ...prev, examDetails: data }));
  };

  const updateParentInfo = (data: ParentInfo) => {
    setFormData((prev) => ({ ...prev, parentInfo: data }));
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
            onUpdate={updateSchoolInfo}
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
                    currentStep >= step.number
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {step.description}
                </p>
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
                  By registering, you agree to our terms of service, privacy
                  policy, and examination guidelines.
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
            <h4 className="font-semibold text-foreground mb-1">
              Important Information:
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">

              <li>• Registration fees: Boys ₹350, Girls ₹250</li>
              <li>• Payment must be completed to confirm your registration</li>
              <li>
                • You will receive login credentials via email after successful
                payment
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
