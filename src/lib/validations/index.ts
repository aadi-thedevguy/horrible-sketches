import { z } from "zod";

export const validateFile = z.object({
  filename: z.string().min(5).max(100).trim().toLowerCase(),
  originalName: z.string().min(5).max(100),
  file: z
    .string()
    .min(1, { message: "Sketch is required" })
    .startsWith("data:image/png;base64,"),
  // canvasBg: z
  //   .string()
  //   .includes("#")
  //   .min(4, { message: "Enter a Valid Hex Color Value" })
  //   .max(7, { message: "Enter a Valid Hex Color Value" }),
  // canvas: z.array(
  //   z.object({
  //     paths: z.array(
  //       z.object({
  //         x: z.number(),
  //         y: z.number(),
  //       })
  //     ),
  //     strokeWidth: z
  //       .number()
  //       .min(1)
  //       .max(5)
  //       .transform((val) => Number(val))
  //       .default(5),

  //     // strokeWidth: z
  //     //   .string()
  //     //   .regex(/^[0-5]+$/)
  //     //   .max(1)
  //     //   .default("5"),
  //     strokeColor: z.string().default("#000000"),
  //     drawMode: z.boolean(),
  //     startTimestamp: z.number().optional(),
  //     endTimestamp: z.number().optional(),
  //   })
  // ),
  // edit: z.boolean().default(false),
  // id: z.string().min(10).optional(),
});

export const sketchformSchema = z.object({
  name: z
    .string()
    .min(5, { message: "Sketch Name must be 5 or more characters long" })
    .max(100, { message: "Sketch Name shouldn't exceed 100 characters" }),
  canvasBg: z
    .string()
    .includes("#")
    .min(4, { message: "Enter a Valid Hex Color Value" })
    .max(7, { message: "Enter a Valid Hex Color Value" }),
  pencilColor: z
    .string()
    .includes("#")
    .min(4, { message: "Enter a Valid Hex Color Value" })
    .max(7, { message: "Enter a Valid Hex Color Value" }),
});

export const searchSchema = z.object({
  query: z.string().min(0).max(100).trim().toLowerCase(),
  page: z.number().min(1).max(100).default(1).optional(),
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

export type FileType = z.infer<typeof validateFile>;
export type SignUpType = z.infer<typeof signupSchema>;
export type SignInType = z.infer<typeof signinSchema>;
export type SketchType = z.infer<typeof sketchformSchema>;
export type SearchType = z.infer<typeof searchSchema>;
