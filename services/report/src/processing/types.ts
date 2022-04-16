import { TransactionType } from '@propine/prisma';

export interface CsvTransactionRow {
  timestamp: string;
  transaction_type: string;
  token: string;
  amount: string;
}

export interface TransformedTransactionRow {
  timestamp: Date;
  transactionType: TransactionType;
  token: string;
  amount: number;
}

export interface Portfolio {
  token: string;
  amount: number;
}
