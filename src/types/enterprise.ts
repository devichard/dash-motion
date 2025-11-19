export type Enterprise = {
  id: string;
  commercialName: string;
  invoiceName: string;
  averageRevenue: number;
  averageTicket: number;
  productsServices: string;
  website: string | null;
  contactEmail: string;
  contactPhone: string;
  sellsPhysicalProducts: boolean;
  cnpj: string;
  companyName: string;
  tradeName: string;
  phone: string;
  email: string;
  addressZipCode: string;
  addressStreet: string;
  addressNumber: string;
  addressComplement: string | null;
  addressNeighborhood: string;
  addressCity: string;
  addressState: string;
  legalRepName: string;
  legalRepCpf: string;
  legalRepRole: string;
  legalRepStartDate: Date;
  legalRepPhone: string;
  legalRepEmail: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  documents: EnterpriseDocument[];
};

export type NewEnterpriseData = {
  commercialName: string;
  invoiceName: string;
  averageRevenue: number;
  averageTicket: number;
  productsServices: string;
  website?: string | null;
  contactEmail: string;
  contactPhone: string;
  sellsPhysicalProducts: boolean;
  cnpj: string;
  companyName: string;
  tradeName: string;
  phone: string;
  email: string;
  addressZipCode: string;
  addressStreet: string;
  addressNumber: string;
  addressComplement?: string | null;
  addressNeighborhood: string;
  addressCity: string;
  addressState: string;
  legalRepName: string;
  legalRepCpf: string;
  legalRepRole: string;
  legalRepStartDate: Date;
  legalRepPhone: string;
  legalRepEmail: string;
};

export type UpdateEnterpriseData = Partial<Omit<NewEnterpriseData, "userId" | "documents">>;

export enum DocumentType {
  SOCIAL_CONTRACT = "SOCIAL_CONTRACT",
  RG_FRONT = "RG_FRONT",
  RG_BACK = "RG_BACK",
  SELFIE_WITH_RG = "SELFIE_WITH_RG",
}

export type EnterpriseDocument = {
  id: string;
  enterpriseId: string;
  type: DocumentType;
  url: string;
  uploadedAt: Date;
  createdAt: Date;
};

export type NewEnterpriseDocumentData = {
  enterpriseId: string;
  type: DocumentType;
  url: string;
  uploadedAt: Date;
};

export type UpdateEnterpriseDocumentData = {
  url?: string;
  uploadedAt?: Date;
};

export interface DocumentRequirements {
  type: DocumentType;
  allowedMimeTypes: string[];
  displayName: string;
}

export const DOCUMENT_REQUIREMENTS: Record<DocumentType, DocumentRequirements> = {
  [DocumentType.SOCIAL_CONTRACT]: {
    type: DocumentType.SOCIAL_CONTRACT,
    allowedMimeTypes: ["application/pdf", "image/jpeg", "image/jpg", "image/png"],
    displayName: "Contrato Social",
  },
  [DocumentType.RG_FRONT]: {
    type: DocumentType.RG_FRONT,
    allowedMimeTypes: ["image/jpeg", "image/jpg", "image/png"],
    displayName: "RG Frente",
  },
  [DocumentType.RG_BACK]: {
    type: DocumentType.RG_BACK,
    allowedMimeTypes: ["image/jpeg", "image/jpg", "image/png"],
    displayName: "RG Verso",
  },
  [DocumentType.SELFIE_WITH_RG]: {
    type: DocumentType.SELFIE_WITH_RG,
    allowedMimeTypes: ["image/jpeg", "image/jpg", "image/png"],
    displayName: "Selfie com RG",
  },
};

export type EnterpriseRevenueData = {
  companyName: string;
  cnpj: string;
  totalRevenue: number;
  transactionCount: number;
};

export type EnterpriseRevenueResponse = {
  data: EnterpriseRevenueData[];
  totalPages: number;
  totalRecords: number;
  currentPage: number;
  perPage: number;
};
