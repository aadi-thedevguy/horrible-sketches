import { z } from "zod";

export const validateFile = z.object({
  filename: z.string().min(5).max(30).includes(".png"),
  file: z
    .string()
    .min(1, { message: "File is required" })
    .startsWith("data:image/png;base64,"),
  canvasPath: z.object({
    paths: z
      .array(
        z.object({
          x: z.number(),
          y: z.number(),
        })
      )
      .length(5),
    strokeWidth: z.number().min(1).max(10),
    strokeColor: z.string().default("#000000"),
    drawMode: z.boolean(),
    startTimestamp: z.number().optional(),
    endTimestamp: z.number().optional(),
  }),
  // edit: z.boolean().default(false),
  // id: z.string().min(10).optional(),
});

export const sketchformSchema = z.object({
  name: z
    .string()
    .min(5, { message: "Sketch Name must be 5 or more characters long" })
    .max(30, { message: "Sketch Name shouldn't exceed 30 characters" }),
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
