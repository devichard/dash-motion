import z from "zod";

export const CreateWithdrawalSchema = z.object({
  amount: z
    .number()
    .positive("O valor do pagamento NÃO pode ser zero.")
    .min(100, "O valor deve ser maior que 100.")
    .max(5000, "O valor deve ser menor que 5000."),
  pixKey: z.string().min(1, "Chave Pix é obrigatória."),
});
