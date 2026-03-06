import { z } from "zod";

export const registrationSchema = z.object({
  parentName: z.string().min(2, "Parent name must be at least 2 characters"),
  nationalId: z
    .string()
    .min(16, "National ID must be exactly 16 digits")
    .max(16, "National ID must be exactly 16 digits")
    .regex(/^\d+$/, "National ID must contain only numbers"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^\+?[0-9]+$/, "Invalid phone number format"),
  visitorCount: z
    .number()
    .min(1, "At least 1 visitor is required")
    .max(10, "Maximum 10 visitors allowed"),
  relationship: z
    .string()
    .min(2, "Please specify your relationship to the student"),
  relationshipOther: z.string().optional(),
  studentNames: z
    .array(z.string().min(2, "Student name must be at least 2 characters"))
    .min(1, "At least one student must be specified"),
});

export type RegistrationFormData = z.infer<typeof registrationSchema>;
