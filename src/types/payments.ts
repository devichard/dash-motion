import type { Enterprise } from "./enterprise";
import type { PaymentLink } from "./payment-links";

export enum PaymentStatus {
  created = "CREATED",
  peding = "PENDING",
  cancelled = "CANCELLED",
  finished = "FINISHED",
  refunded = "REFUNDED",
}

export enum PaymentMethod {
  pix = "pix",
}

export enum PaymentCurrency {
  brl = "BRL",
}

export enum PaymentDocumentType {
  cpf = "CPF",
  cnpj = "CNPJ",
}

export enum PurchaserProvider {
  XDPAG = "xdpag",
  AMEII = "ameii",
  SPLITPAY = "splitpay",
}

export type Payment = {
  id: string;
  paymentLinkId: string | null;
  paymentLink: PaymentLink | null;
  externalId: string | null;
  customerId: string;
  purchaser: PurchaserProvider;
  method: PaymentMethod;
  amount: number;
  amountWithFeesGateway: number;
  amountWithAllFees: number;
  customerName: string | null;
  customerEmail: string | null;
  status: PaymentStatus;
  qrCode: string | null;
  createdAt: Date;
  expiresAt: Date;
  confirmedAt: Date | null;
};

export type AdminPaymentData = {
  id: string;
  paymentLinkId: string | null;
  paymentLink: PaymentLink | null;
  customer: Customer;
  externalId: string | null;
  customerId: string;
  purchaser: PurchaserProvider;
  method: PaymentMethod;
  amount: number;
  amountWithFeesGateway: number;
  amountWithAllFees: number;
  customerName: string | null;
  customerEmail: string | null;
  status: PaymentStatus;
  qrCode: string | null;
  createdAt: Date;
  expiresAt: Date;
  confirmedAt: Date | null;
};

type Customer = {
  id: string;
  email: string;
  companyName: string;
  enterprises: Omit<Enterprise, "documents">[];
};

export interface SplitPayCreatePixPaymentPayload {
  amount: number;
  currency: PaymentCurrency;
  paymentMethod: PaymentMethod;
  metadata?: string;
  customer: {
    name: string;
    email: string;
    document: {
      number: string;
      type: PaymentDocumentType;
    };
    phone: string;
    externalRef: string;
  };
  shipping: {
    fee: number;
    address: {
      street: string;
      streetNumber: string;
      complement: string;
      zipCode: string;
      neighborhood: string;
      city: string;
      state: string;
      country: string;
    };
  };
  pix: {
    expiresInDays: number;
  };
  postbackUrl: string;
  ip: string;
  traceable: boolean;
}

export type NewPaymentData = {
  paymentLinkId?: string;
  customerId: string;
  sellerId?: string;
  purchaser: PurchaserProvider;
  currency?: PaymentCurrency;
  paymentMethod: PaymentMethod;
  amount: number;
  customer?: {
    document?: {
      number?: string;
      type?: string;
    };
    name?: string;
    email?: string;
    phone?: string;
  };
};

export type PaymentResponse = {
  data: Payment[];
  totalPages: number;
  totalRecords: number;
  currentPage: number;
  perPage: number;
};

export type AdminPaymentResponse = {
  data: AdminPaymentData[];
  totalPages: number;
  totalRecords: number;
  currentPage: number;
  perPage: number;
};

export type TotalTransactionsData = {
  totalAmountWithAllFees: number;
  totalPayments: number;
  totalFinishedPayments: number;
  totalPendingPayments: number;
};

export type BillingData = {
  totalAmountWithFeesGateway: number;
  totalFinishedPayments: number;
  totalPendingPayments: number;
  totalAmountCancelled: number;
};

export type DailySalesCount = {
  date: string; // formato: YYYY-MM-DD
  count: number;
};

export type DailySalesValues = {
  date: string; // formato: YYYY-MM-DD
  finished: number;
  pending: number;
  cancelled: number;
};
