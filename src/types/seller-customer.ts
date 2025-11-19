export enum SellerCustomerDocumentType {
  CPF = "CPF",
  CNPJ = "CNPJ",
}

export type SellerCustomer = {
  id: string;
  sellerId: string;
  name: string;
  email: string;
  phone: string | null;
  documentType: SellerCustomerDocumentType;
  documentNumber: string;
  createdAt: Date;
  updatedAt: Date;
};

export interface SellerCustomerResponse {
  data: SellerCustomer[];
  totalPages: number;
  totalRecords: number;
  currentPage: number;
  perPage: number;
}
