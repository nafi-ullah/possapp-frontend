// lib/types.ts
export type Role = "Admin" | "Cashier";

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  userId: number;
  username: string;
  role: Role;
  isActive: boolean;
}

export type BatchStatus = "Created" | "CheckedOut" | string;

export interface BatchItem {
  id: number;
  barcode: string;
  productName: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Batch {
  id: number;
  batchCode: string;
  customerId: string;
  status: BatchStatus;
  subtotal: number;
  discountAmount: number;
  discountPercent: number;
  payable: number;
  givenAmount: number;
  paymentMethod: string;
  returnedAmount: number;
  productId?: number;
  productName?: string;
  items: BatchItem[];
}

export interface CheckoutPayload {
  status: string;
  givenAmount: number;
  paymentMethod: string;
  discountAmount: number;
  discountPercent: number;
  returnedAmount: number;
}
