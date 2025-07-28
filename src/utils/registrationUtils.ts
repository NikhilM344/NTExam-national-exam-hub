export interface PersonalInfo {
  fullName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  city: string;
  state: string;
  postalCode: string;
  contactNumber: string;
  email: string;
}

export interface SchoolInfo {
  schoolName: string;
  schoolAddress: string;
  schoolCity: string;
  schoolState: string;
  schoolPostalCode: string;
  classGrade: string;
  rollNumber?: string;
}

export interface ExamDetails {
  subjects: string[];
  examCenter?: string;
  examDate?: string;
}

export interface ParentInfo {
  parentName: string;
  parentContactNumber: string;
  parentEmail: string;
}

export interface RegistrationData {
  personalInfo: PersonalInfo;
  schoolInfo: SchoolInfo;
  examDetails: ExamDetails;
  parentInfo: ParentInfo;
  termsAccepted: boolean;
  password: string;
}

export const generatePassword = (dateOfBirth: string): string => {
  // Remove all slashes and dashes from date
  return dateOfBirth.replace(/[\/\-]/g, '');
};

export const calculateFees = (gender: 'male' | 'female' | 'other'): number => {
  return gender === 'female' ? 250 : 350;
};

export const states = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Chandigarh', 'Jammu and Kashmir', 'Ladakh'
];

export const classes = [
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
  'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
  'Class 11', 'Class 12'
];

export const subjects = [
  'Mathematics', 'Science', 'English', 'Hindi', 'Social Studies',
  'Physics', 'Chemistry', 'Biology', 'Computer Science', 'General Knowledge'
];

export const examCenters = [
  'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad',
  'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur',
  'Indore', 'Bhopal', 'Visakhapatnam', 'Patna', 'Vadodara', 'Ghaziabad'
];