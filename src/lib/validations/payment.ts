import z from "zod";

export const NewPaymentSchema = z.object({
  purchaser: z.enum(["xdpag", "ameii"], {
    message: "O provider deve ser 'xdpag' ou 'ameii'!",
  }),
  method: z.enum(["pix"], {
    message: "O método de pagamento deve ser 'pix'!",
  }),
  amount: z.number().positive("O valor do pagamento NÃO pode ser zero."),
  paymentLinkId: z.string().min(1, "O ID do link de pagamento deve ser válido."),
  customerId: z.string().min(1, "O ID do cliente deve ser válido."),
  customer: z
    .object({
      document: z.object({
        number: z.string().min(11, "DocumentNumber deve ter no mínimo 11 caracteres").max(14),
        type: z.enum(["cpf", "cnpj"], {
          message: "O tipo do documento deve ser 'cpf' ou 'cnpj'!",
        }),
      }),
      name: z.string().min(3, "Name deve ter no mínimo 3 caracteres"),
      email: z.email({ message: "Email inválido" }),
      phone: z.string().min(11, "O formato de Phone deve ser: DDD+número. Ex: 11994123456"),
    })
    .optional(),
});

export const NewPaymentLinkSchema = z.object({
  description: z.string().min(3, "Descrição deve ter no mínimo 3 caracteres"),
  amount: z.number().positive("O valor NÃO pode ser menor ou igual a zero."),
});
