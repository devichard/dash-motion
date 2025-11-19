export interface DataCnpjResponse {
  success: true;
  companyName: string;
  tradeName: string;
  cnpj: string;
  address: {
    zip: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
  };
  phone: string;
  email: string;
}

export interface FailureSearchCnpjData {
  success: false;
  message: string;
}
