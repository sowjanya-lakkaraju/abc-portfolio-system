export interface TransactionHistoryFilter {
  orderRefNo?: string;
  securityName?: string;
  transactionType?: 'Buy' | 'Sell' | '';
  orderStatus?: 'Submitted' | 'Cancelled' | 'Executed' | 'Completed' | 'Failed' | '';
  fromDate?: string;
  toDate?: string;
}

export interface TransactionHistoryRecord {
  id: string;
  orderRefNo: string;
  securityName: string;
  transactionType: string;
  orderStatus: string;
  orderDate: string;
  quantity: number;
  orderValue: string;
}

export interface TransactionHistoryResponse {
  data: TransactionHistoryRecord[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{ field: string; message: string }>;
}