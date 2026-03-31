import { z } from "zod/v4"

export const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm: z.string().min(1, "Please confirm your password"),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
})

export type RegisterState = { 
  errors?: { 
    name?: string; 
    email?: string; 
    password?: string; 
    confirm?: string 
  },
  redirectTo?: '/login'
} | null

export const loginSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

export type LoginState = { 
  errors?: { 
    email?: string; 
    password?: string 
  },
  redirectTo?: '/' 
} | null


export const resetPassordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm: z.string().min(1, "Please confirm your password"),
    token: z.string().min(1, "Reset link is invalid"),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  })

export type ResetPasswordState = { 
  errors?: { 
    password?: string; 
    confirm?: string;
    token?: string 
  }, 
  redirectTo?: '/login'
} | null