export type NewPaymentLinkData = {
  description: string;
  amount: number;
};

enum PaymentLinkStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export type PaymentLink = {
  id: string;
  description: string;
  url: string;
  hash: string;
  sellerId: string;
  status: PaymentLinkStatus;
  qtdPayments: number;
  amount: number;
  createdAt: Date;
};
