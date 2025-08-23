import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SchoolInfo } from "@/utils/registrationUtils";

type Props = {
  data: SchoolInfo;
  onUpdate: (next: SchoolInfo) => void;
  errors?: Record<string, string>;
};

const CLASS_OPTIONS: { label: string; value: string }[] = [
  // 2–10 (Class 1 removed)
  { label: "Class 2", value: "2" },
  { label: "Class 3", value: "3" },
  { label: "Class 4", value: "4" },
  { label: "Class 5", value: "5" },
  { label: "Class 6", value: "6" },
  { label: "Class 7", value: "7" },
  { label: "Class 8", value: "8" },
  { label: "Class 9", value: "9" },
  { label: "Class 10", value: "10" },

  // 11th streams
  { label: "Class 11 – Arts", value: "11 arts" },
  { label: "Class 11 – Commerce", value: "11 commerce" },
  { label: "Class 11 – Science (PCB)", value: "11 science pcb" },
  { label: "Class 11 – Science (PCM)", value: "11 science pcm" },

  // 12th streams
  { label: "Class 12 – Arts", value: "12 arts" },
  { label: "Class 12 – Commerce", value: "12 commerce" },
  { label: "Class 12 – Science (PCB)", value: "12 science pcb" },
  { label: "Class 12 – Science (PCM)", value: "12 science pcm" },
];

export default function SchoolInfoStep({ data, onUpdate, errors = {} }: Props) {
  const handleChange =
    (field: keyof SchoolInfo) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      onUpdate({ ...data, [field]: e.target.value });
    };

  return (
    <div className="space-y-6">
      {/* School Name */}
      <div className="space-y-2">
        <Label htmlFor="schoolName">School Name</Label>
        <Input
          id="schoolName"
          placeholder="e.g., Navoday Public School"
          value={data.schoolName}
          onChange={handleChange("schoolName")}
        />
        {errors.schoolName && (
          <p className="text-sm text-red-600">{errors.schoolName}</p>
        )}
      </div>

      {/* School Address */}
      <div className="space-y-2">
        <Label htmlFor="schoolAddress">School Address</Label>
        <Input
          id="schoolAddress"
          placeholder="Street, Area"
          value={data.schoolAddress}
          onChange={handleChange("schoolAddress")}
        />
        {errors.schoolAddress && (
          <p className="text-sm text-red-600">{errors.schoolAddress}</p>
        )}
      </div>

      {/* City / State / Postal Code
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="schoolCity">City</Label>
          <Input
            id="schoolCity"
            value={data.schoolCity || ""}
            onChange={handleChange("schoolCity")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="schoolState">State</Label>
          <Input
            id="schoolState"
            value={data.schoolState || ""}
            onChange={handleChange("schoolState")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="schoolPostalCode">Postal Code</Label>
          <Input
            id="schoolPostalCode"
            value={data.schoolPostalCode || ""}
            onChange={handleChange("schoolPostalCode")}
          />
        </div>
      </div> */}

      {/* Class / Stream */}
      <div className="space-y-2">
        <Label htmlFor="classGrade">Class / Stream</Label>
        <select
          id="classGrade"
          className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
          value={(data.classGrade || "").toLowerCase()}
          onChange={(e) => onUpdate({ ...data, classGrade: e.target.value })}
        >
          <option value="">Select Class / Stream</option>
          {CLASS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {errors.classGrade && (
          <p className="text-sm text-red-600">{errors.classGrade}</p>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          Subjects will be set automatically based on your selection.
        </p>
      </div>

      {/* Roll Number (optional) */}
      <div className="space-y-2">
        <Label htmlFor="rollNumber">Roll Number (optional)</Label>
        <Input
          id="rollNumber"
          placeholder="Enter your roll number"
          value={data.rollNumber || ""}
          onChange={handleChange("rollNumber")}
        />
      </div>
    </div>
  );
}
