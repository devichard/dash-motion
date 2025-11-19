export enum ReasonType {
  PAYMENT_RECEIVED = "PAYMENT_RECEIVED",
  SYSTEM_FEE = "SYSTEM_FEE",
  RETENTION = "RETENTION",
  WITHDRAWAL = "WITHDRAWAL",
  MANUAL_ADJUSTMENT = "MANUAL_ADJUSTMENT",
}

export type FinancialTransaction = {
  id: string;
  sellerId: string;
  paymentId: string | null;
  amount: number;
  reason: ReasonType;
  isVisibleToSeller: boolean;
  availableAt: Date;
  createdAt: Date;
};

export type FinancialTransactionsResponse = {
  data: FinancialTransaction[];
  totalPages: number;
  totalRecords: number;
  currentPage: number;
  perPage: number;
};
