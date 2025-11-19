export enum WithdrawalStatus {
  REQUESTED = "REQUESTED",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
  REJECTED = "REJECTED",
}

export type Withdrawal = {
  id: string;
  sellerId: string;
  amount: number;
  pixKey: string;
  status: WithdrawalStatus;
  requestedAt: Date;
  completedAt: Date | null;
};

export type WithdrawalListResponse = {
  id: string;
  sellerId: string;
  amount: number;
  pixKey: string;
  status: WithdrawalStatus;
  requestedAt: Date;
  completedAt: Date | null;
  seller: {
    id: string;
    companyName: string;
    enterprises: {
      id: string;
      cnpj: string;
    }[];
  };
};

export interface WithdrawalRequestResponse {
  data: WithdrawalListResponse[];
  totalPages: number;
  totalRecords: number;
  currentPage: number;
  perPage: number;
}

export type CreateWithdrawalData = {
  amount: number;
  pixKey: string;
};

export type WithdrawalDashboardData = {
  totalAmountApproved: number;
  qtdWithdrawalsApproved: number;
  qtdWithdrawalsPending: number;
  totalAmountPending: number;
};
