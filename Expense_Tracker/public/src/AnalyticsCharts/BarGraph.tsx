import { useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../Firebase";

interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
}

const BarGraph = () => {
  const [foodData, setFoodData] = useState<
    { Date: string; TotalAmount: number }[]
  >([]);
  const [clothesData, setClothesData] = useState<
    { Date: string; TotalAmount: number }[]
  >([]);
  const [othersData, setOthersData] = useState<
    { Date: string; TotalAmount: number }[]
  >([]);

  const [combinedData, setCombinedData] = useState<
    {
      id: string;
      Date: string;
      Food: number;
      Clothes: number;
      Others: number;
    }[]
  >([]);

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

      // Organize data by date and category
      const groupedData: Record<
        string,
        { Date: string; TotalAmount: number }[]
      > = {
        Food: [],
        Clothes: [],
        Others: [],
      };

      updatedExpenses.forEach((expense) => {
        const categoryData = groupedData[expense.category];
        const totalAmount =
          (categoryData?.[0]?.TotalAmount || 0) + expense.amount;

        groupedData[expense.category] = [
          ...categoryData,
          { Date: expense.date, TotalAmount: totalAmount },
        ];
      });

      // Set state for each category
      setFoodData(groupedData.Food);
      setClothesData(groupedData.Clothes);
      setOthersData(groupedData.Others);

      const combinedChartData: {
        id: string;
        Date: string;
        Food: number;
        Clothes: number;
        Others: number;
      }[] = [];

      updatedExpenses.forEach((expense) => {
        const existingData = combinedChartData.find(
          (data) => data.Date === expense.date
        );

        if (existingData) {
          existingData.Food +=
            groupedData.Food.find((data) => data.Date === expense.date)
              ?.TotalAmount || 0;
          existingData.Clothes +=
            groupedData.Clothes.find((data) => data.Date === expense.date)
              ?.TotalAmount || 0;
          existingData.Others +=
            groupedData.Others.find((data) => data.Date === expense.date)
              ?.TotalAmount || 0;
        } else {
          combinedChartData.push({
            id: expense.id,
            Date: expense.date,
            Food:
              groupedData.Food.find((data) => data.Date === expense.date)
                ?.TotalAmount || 0,
            Clothes:
              groupedData.Clothes.find((data) => data.Date === expense.date)
                ?.TotalAmount || 0,
            Others:
              groupedData.Others.find((data) => data.Date === expense.date)
                ?.TotalAmount || 0,
          });
        }
      });

      setCombinedData(combinedChartData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <div>
        {foodData.length > 0 ? (
          <BarChart
            dataset={foodData}
            xAxis={[{ scaleType: "band", dataKey: "Date" }]}
            series={[
              {
                dataKey: "TotalAmount" as const,
                label: "Total Spent on Food",
              },
            ]}
            width={600}
            height={300}
          />
        ) : (
          <div>
            <h3>No Food Data Found!</h3>
          </div>
        )}
      </div>
      <div>
        {clothesData.length > 0 ? (
          <BarChart
            dataset={clothesData}
            xAxis={[{ scaleType: "band", dataKey: "Date" }]}
            series={[
              {
                dataKey: "TotalAmount" as const,
                label: "Total Spent on Clothes",
              },
            ]}
            width={600}
            height={300}
          />
        ) : (
          <div>
            <h3>No Clothes Data Found!</h3>
          </div>
        )}
      </div>
      <div>
        {othersData.length > 0 ? (
          <BarChart
            dataset={othersData}
            xAxis={[{ scaleType: "band", dataKey: "Date" }]}
            series={[
              {
                dataKey: "TotalAmount" as const,
                label: "Total Spent on Others",
              },
            ]}
            width={600}
            height={300}
          />
        ) : (
          <div>
            <h3>No Others Data Found!</h3>
          </div>
        )}
      </div>
      <div>
        {combinedData.length > 0 ? (
          <BarChart
            dataset={combinedData}
            xAxis={[{ scaleType: "band", dataKey: "Date" }]}
            series={[
              {
                dataKey: "Food" as const,
                label: "Food",
              },
              {
                dataKey: "Clothes" as const,
                label: "Clothes",
              },
              {
                dataKey: "Others" as const,
                label: "Others",
              },
            ]}
            width={800}
            height={400}
          />
        ) : (
          <div>
            <h3>No Combined Data Found!</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default BarGraph;
