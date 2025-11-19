export enum RoleType {
  seller = "seller",
  admin = "admin",
  manager = "manager",
  super_admin = "super_admin",
}

export type AdminMember = {
  id: string;
  email: string;
  role: RoleType;
  companyName: string;
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export type NewAdminMemberData = {
  companyName: string;
  email: string;
  password: string;
  role: RoleType;
};

export interface AdminMembersResponse {
  data: AdminMember[];
  totalPages: number;
  totalRecords: number;
  currentPage: number;
  perPage: number;
}
