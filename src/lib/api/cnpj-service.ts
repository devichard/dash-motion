import type { DataCnpjResponse, FailureSearchCnpjData } from "@/types/cnpj";

export class PublicaCnpjService {
  private API_URL = "https://publica.cnpj.ws/cnpj/";

  async fetchDataByCnpj(cnpj: string): Promise<DataCnpjResponse | FailureSearchCnpjData> {
    cnpj = cnpj.replace(/\D/g, "");

    if (cnpj.length !== 14) {
      return { success: false, message: "CNPJ inválido" };
    }

    try {
      const response = await fetch(`${this.API_URL}${cnpj}`);

      if (!response.ok) {
        return { success: false, message: "Não foi possível buscar os dados do CNPJ" };
      }

      const data = await response.json();

      return {
        success: true,
        companyName: data.razao_social,
        tradeName: data.estabelecimento?.nome_fantasia || data.razao_social,
        cnpj: data.cnpj,
        phone: data.estabelecimento?.telefone1 || "",
        email: data.estabelecimento?.email || "",
        address: {
          zip: data.estabelecimento?.cep || "",
          street: data.estabelecimento?.logradouro || "",
          number: data.estabelecimento?.numero || "",
          complement: data.estabelecimento?.complemento || "",
          neighborhood: data.estabelecimento?.bairro || "",
          city: data.estabelecimento?.cidade?.nome || "",
          state: data.estabelecimento?.estado?.sigla || "",
        },
      };
    } catch (error) {
      console.error(error);
      return { success: false, message: "Erro ao buscar os dados do CNPJ" };
    }
  }
}
