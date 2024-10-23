import { FunctionComponent } from "react";

// Assuming Transaction and Employee are defined correctly in utils/types.ts
export type Transaction = {
  id: string;
  amount: number;
  employee: Employee; // Ensure that each transaction has an employee
  merchant: string;
  date: string;
  approved: boolean;
};

export type Employee = {
  id: string;
  firstName: string;
  lastName: string;
};

// SetTransactionApprovalFunction: Type for approving/rejecting transactions
export type SetTransactionApprovalFunction = (params: {
  transactionId: string;
  newValue: boolean;
}) => Promise<void>;

// TransactionsProps now includes employees, which is always an array (not nullable)
type TransactionsProps = {
  transactions: Transaction[] | null; // Transactions can be null
  employees: Employee[]; // Employees should always be an array, fallback to empty array when no employees
};

// Props for TransactionPane component
type TransactionPaneProps = {
  transaction: Transaction;
  loading: boolean;
  approved?: boolean;
  setTransactionApproval: SetTransactionApprovalFunction;
};

// Define the component types
export type TransactionsComponent = FunctionComponent<TransactionsProps>;
export type TransactionPaneComponent = FunctionComponent<TransactionPaneProps>;
