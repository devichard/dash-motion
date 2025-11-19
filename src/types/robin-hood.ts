export type NewVisibilityToSellerData = {
  seller_id: string;
  percentage_hidden: number;
};

export type SellerVisibilityRule = {
  id: string;
  sellerId: string;
  percentageHidden: number;
  createdAt: Date;
  updatedAt: Date;
};

export type ApplyVisibilityResponse =
  | {
      message: string;
      percentage_hidden: number;
    }
  | {
      message: string;
      rule: SellerVisibilityRule;
    };

export type RobinHoodKPIs = {
  totalVolume: number;
  totalTransactions: number;
  topSeller: {
    name: string;
    value: number;
  };
  averageTicket: number;
};

export type RobinHoodRankingItem = {
  position: number;
  sellerId: string;
  companyName: string;
  cnpj: string;
  email: string;
  transactions: number;
  totalValue: number;
  paidPercentage: number;
  lastPayment: Date | null;
  currentVisibilityRule?: {
    percentageHidden: number;
  };
};

export type RobinHoodResponse = {
  kpis: RobinHoodKPIs;
  ranking: RobinHoodRankingItem[];
};

export type VisibilityLog = {
  id: string;
  sellerId: string;
  percentageHidden: number;
  appliedBy: string;
  createdAt: Date;
};

export type VisibilityLogData = VisibilityLog & {
  seller?: {
    id: string;
    companyName: string;
    email: string;
  };
  appliedByUser?: {
    id: string;
    email: string;
    companyName: string;
  };
};

export interface VisibilityLogsResponse {
  data: VisibilityLogData[];
  totalPages: number;
  totalRecords: number;
  currentPage: number;
  perPage: number;
}
