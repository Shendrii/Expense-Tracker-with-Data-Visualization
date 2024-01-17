import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../Firebase";

interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
}

const ExpenseList: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    const expensesCollection = collection(db, "expense");

    // Subscribe to real-time updates using onSnapshot
    const unsubscribe = onSnapshot(expensesCollection, (querySnapshot) => {
      // ...

      const updatedExpenses: Expense[] = querySnapshot.docs.map((expense) => ({
        ...expense.data(),
        id: expense.id,
        amount: expense.data().amount,
        description: expense.data().description,
        category: expense.data().category,
        date: expense.data().date,
      }));

      // ...

      setExpenses(updatedExpenses);
      console.log(updatedExpenses);
    });

    // Cleanup the subscription when the component unmounts
    return () => unsubscribe();
  }, []); // Empty dependency array means this effect runs once on mount

  const handleDelete = async (id: string) => {
    const expenseDoc = doc(db, "expense", id);
    await deleteDoc(expenseDoc);
  };

  return (
    <div>
      {expenses.length > 0 ? (
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th scope="col">Description</th>
              <th scope="col">Amount</th>
              <th scope="col">Category</th>
              <th scope="col">Date</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id}>
                <td>{expense.description}</td>
                <td>{expense.amount}</td>

                <td>{expense.category}</td>
                <td>{expense.date}</td>
                <div>
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      if (window.confirm("are you sure you want to delete?")) {
                        handleDelete(expense.id);
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default ExpenseList;
