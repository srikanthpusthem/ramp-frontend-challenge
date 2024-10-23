import { useCallback, useState, useEffect } from "react";
import { useCustomFetch } from "src/hooks/useCustomFetch";
import { SetTransactionApprovalParams, Employee, Transaction } from "src/utils/types";
import { TransactionPane } from "./TransactionPane";
import { SetTransactionApprovalFunction, TransactionsComponent } from "./types";
import { InputSelect } from "../InputSelect"; // Import the InputSelect component

export const Transactions: TransactionsComponent = ({ transactions, employees }) => {
  const { fetchWithoutCache, loading } = useCustomFetch();
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null); // Handle selected employee state
  const [localTransactions, setLocalTransactions] = useState<Transaction[]>(transactions || []); // Manage local transaction state

  // Sync local transactions with the initial prop when the component mounts
  useEffect(() => {
    setLocalTransactions(transactions || []);
  }, [transactions]);

  // Function to set transaction approval status and update local state
  const setTransactionApproval = useCallback<SetTransactionApprovalFunction>(
    async ({ transactionId, newValue }) => {
      // Update the backend with the new approval status
      await fetchWithoutCache<void, SetTransactionApprovalParams>("setTransactionApproval", {
        transactionId,
        value: newValue,
      });

      // Update local transaction state with the new approval status
      setLocalTransactions((prevTransactions) =>
        prevTransactions.map((transaction) =>
          transaction.id === transactionId ? { ...transaction, approved: newValue } : transaction
        )
      );
    },
    [fetchWithoutCache]
  );

  // Filter transactions based on selected employee
  const filteredTransactions = selectedEmployee && localTransactions
    ? localTransactions.filter((transaction) => transaction.employee?.id === selectedEmployee?.id)
    : localTransactions; // Show all transactions when no employee is selected (i.e., "All Employees")

  if (localTransactions === null) {
    return <div className="RampLoading--container">Loading...</div>;
  }

  return (
    <div>
      {/* Employee select dropdown */}
      <InputSelect
        label="Filter by employee"
        defaultValue={null}
        onChange={setSelectedEmployee} // Handle employee selection
        items={employees || []} // Ensure employees is an array
        parseItem={(employee) => ({
          label: `${employee?.firstName ?? ''} ${employee?.lastName ?? ''}`, // Handle undefined fields
          value: employee?.id ?? '', // Handle undefined fields
        })}
        isLoading={loading} // Handle loading state for dropdown
        loadingLabel="Loading employees"
      />

      {/* Render the filtered transactions */}
      <div data-testid="transaction-container">
        {filteredTransactions?.map((transaction) => (
          <TransactionPane
            key={transaction.id}
            transaction={transaction}
            loading={loading}
            setTransactionApproval={setTransactionApproval}
          />
        ))}
      </div>
    </div>
  );
};
