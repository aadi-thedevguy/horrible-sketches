import { z } from "zod";

export const sketchformSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Title must be 5 or more characters long" })
    .max(30, { message: "Title shouldn't exceed 30 characters" }),
  canvasBg: z
    .string()
    .min(4, { message: "Enter a Valid Hex Color Value" })
    .max(6, { message: "Enter a Valid Hex Color Value" })
    .optional(),
  pencilColor: z
    .string()
    .min(4, { message: "Enter a Valid Hex Color Value" })
    .max(6, { message: "Enter a Valid Hex Color Value" })
    .optional(),
});

export const signupSchema = z.object({
  email: z.string().trim().email().max(50),
  name: z
    .string()
    .trim()
    .min(5, { message: "Username must be 5 or more characters long" })
    .max(30, { message: "Username shouldn't exceed 30 characters" }),
});

export const signinSchema = z.object({
  email: z.string().trim().email().max(50),
});
