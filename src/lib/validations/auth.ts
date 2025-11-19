import { z } from "zod";

export const registerSchema = z
  .object({
    companyName: z.string().min(1, "Nome da empresa é obrigatório"),
    email: z.string().email("Email inválido"),
    password: z
      .string()
      .min(8, "Senha deve ter no mínimo 8 caracteres")
      .max(50, "Senha deve ter no máximo 50 caracteres"),
    confirmPassword: z.string().min(8, "Confirmação de senha deve ter no mínimo 8 caracteres"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
