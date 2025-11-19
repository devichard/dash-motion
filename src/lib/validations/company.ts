import { z } from "zod";

export const companySchema = z.object({
  cnpj: z.string().min(14, "CNPJ inválido"),
  companyName: z.string().min(1, "Campo obrigatório"),
  tradeName: z.string().min(1, "Campo obrigatório"),
  phone: z.string().min(10, "Telefone inválido"),
  email: z.email("E-mail inválido"),

  commercialName: z.string().min(1, "Campo obrigatório"),
  invoiceName: z.string().min(1, "Campo obrigatório"),
  averageRevenue: z.string().min(1, "Campo obrigatório"),
  averageTicket: z.string().min(1, "Campo obrigatório"),
  productsServices: z.string().min(1, "Campo obrigatório"),

  website: z.string().optional(),
  contactEmail: z.email("E-mail inválido"),
  contactPhone: z.string().min(10, "Telefone inválido"),

  addressZipCode: z.string().min(8, "CEP inválido"),
  addressStreet: z.string().min(1, "Campo obrigatório"),
  addressNumber: z.string().min(1, "Campo obrigatório"),
  addressComplement: z.string().optional(),
  addressNeighborhood: z.string().min(1, "Campo obrigatório"),
  addressCity: z.string().min(1, "Campo obrigatório"),
  addressState: z.string().length(2, "UF inválida"),

  responsavelNome: z.string().min(1, "Campo obrigatório"),
  responsavelCpf: z.string().min(11, "CPF inválido"),
  responsavelCargo: z.string().min(1, "Campo obrigatório"),
  responsavelEntrada: z.string().min(1, "Campo obrigatório"),
  responsavelTelefone: z.string().min(10, "Telefone inválido"),
  responsavelEmail: z.email("E-mail inválido"),

  sellsPhysicalProducts: z.boolean().optional(),
});
