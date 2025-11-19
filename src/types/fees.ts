export type FeeType = "PERCENTAGE" | "FIXED";

export type SystemFees = {
  id: string;
  sellerId?: string | null;
  feeType: FeeType;
  feeValue: number;
  description?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type NewFee = {
  sellerId?: string;
  feeType: FeeType;
  feeValue: number;
  description?: string;
};

export type UpdateFee = Partial<Omit<SystemFees, "id" | "createdAt" | "updatedAt">>;
