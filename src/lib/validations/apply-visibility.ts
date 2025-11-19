import z from "zod";

export const ApplyVisibilitySchema = z.object({
  seller_id: z.uuid({ message: "seller_id deve ser um UUID válido" }),
  percentage_hidden: z
    .number()
    .int({ message: "percentage_hidden deve ser um número inteiro" })
    .min(0, { message: "percentage_hidden deve ser no mínimo 0" })
    .max(100, { message: "percentage_hidden deve ser no máximo 100" }),
});
