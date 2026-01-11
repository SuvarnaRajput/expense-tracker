// import { useEffect, useState } from "react";
// import {
//   collection,
//   onSnapshot,
//   doc,
//   setDoc,
//   getDoc,
//   Timestamp,
// } from "firebase/firestore";
// import { db } from "../services/firebase";
// import useAuthStore from "../store/authStore";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
// } from "recharts";

// const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

// export default function Dashboard() {
//   const { user } = useAuthStore();
//   const [transactions, setTransactions] = useState([]);

//   const [budget, setBudget] = useState("");
//   const [savedBudget, setSavedBudget] = useState(null);

//   const currentMonthKey = new Date().toISOString().slice(0, 7); // YYYY-MM

//   // 🔥 Fetch transactions
//   useEffect(() => {
//     if (!user) return;

//     const ref = collection(db, "users", user.uid, "transactions");
//     const unsub = onSnapshot(ref, (snapshot) => {
//       const data = snapshot.docs.map((doc) => doc.data());
//       setTransactions(data);
//     });

//     return () => unsub();
//   }, [user]);

//   // 🔥 Fetch budget
//   useEffect(() => {
//     if (!user) return;

//     const fetchBudget = async () => {
//       const ref = doc(db, "users", user.uid, "budgets", currentMonthKey);
//       const snap = await getDoc(ref);
//       if (snap.exists()) {
//         setSavedBudget(snap.data().limit);
//       }
//     };

//     fetchBudget();
//   }, [user, currentMonthKey]);

//   // 💾 Save budget
//   const saveBudget = async () => {
//     if (!budget) return;

//     const ref = doc(db, "users", user.uid, "budgets", currentMonthKey);
//     await setDoc(ref, {
//       limit: Number(budget),
//       createdAt: Timestamp.now(),
//     });

//     setSavedBudget(Number(budget));
//     setBudget("");
//   };

//   // 🔢 Calculations
//   const totalIncome = transactions
//     .filter((t) => t.type === "income")
//     .reduce((sum, t) => sum + t.amount, 0);

//   const totalExpense = transactions
//     .filter((t) => t.type === "expense")
//     .reduce((sum, t) => sum + t.amount, 0);

//   const balance = totalIncome - totalExpense;

//   // 📊 Category Pie
//   const categoryData = transactions
//     .filter((t) => t.type === "expense")
//     .reduce((acc, curr) => {
//       const found = acc.find((a) => a.name === curr.category);
//       if (found) found.value += curr.amount;
//       else acc.push({ name: curr.category, value: curr.amount });
//       return acc;
//     }, []);

//   // 📊 Monthly Expense
//   const monthlyData = transactions
//     .filter((t) => t.type === "expense")
//     .reduce((acc, curr) => {
//       const month = new Date(curr.date).toLocaleString("default", {
//         month: "short",
//         year: "numeric",
//       });

//       const found = acc.find((a) => a.month === month);
//       if (found) found.amount += curr.amount;
//       else acc.push({ month, amount: curr.amount });

//       return acc;
//     }, []);

//   // 🚨 Budget logic
//   const budgetUsedPercent =
//     savedBudget ? Math.round((totalExpense / savedBudget) * 100) : 0;

//   return (
//     <div className="p-6 max-w-5xl mx-auto">
//       <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

//       {/* SUMMARY */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//         <div className="bg-green-100 p-4 rounded">
//           <p>Total Income</p>
//           <p className="text-2xl font-bold text-green-700">₹{totalIncome}</p>
//         </div>

//         <div className="bg-red-100 p-4 rounded">
//           <p>Total Expense</p>
//           <p className="text-2xl font-bold text-red-700">₹{totalExpense}</p>
//         </div>

//         <div className="bg-blue-100 p-4 rounded">
//           <p>Balance</p>
//           <p className="text-2xl font-bold text-blue-700">₹{balance}</p>
//         </div>
//       </div>

//       {/* 💸 BUDGET SYSTEM */}
//       <div className="bg-white p-6 rounded shadow mb-8">
//         <h2 className="text-xl font-semibold mb-4">Monthly Budget</h2>

//         {!savedBudget ? (
//           <div className="flex gap-3">
//             <input
//               type="number"
//               className="border p-2"
//               placeholder="Enter budget"
//               value={budget}
//               onChange={(e) => setBudget(e.target.value)}
//             />
//             <button
//               onClick={saveBudget}
//               className="bg-blue-600 text-white px-4"
//             >
//               Save
//             </button>
//           </div>
//         ) : (
//           <>
//             <p>
//               Budget: <b>₹{savedBudget}</b>
//             </p>
//             <p>
//               Used: <b>{budgetUsedPercent}%</b>
//             </p>

//             {budgetUsedPercent >= 100 && (
//               <p className="text-red-600 font-semibold">
//                 🚨 Budget exceeded!
//               </p>
//             )}

//             {budgetUsedPercent >= 80 && budgetUsedPercent < 100 && (
//               <p className="text-orange-600 font-semibold">
//                 ⚠️ Approaching budget limit
//               </p>
//             )}
//           </>
//         )}
//       </div>

//       {/* PIE */}
//       <div className="bg-white p-6 rounded shadow mb-10">
//         <h2 className="text-xl font-semibold mb-4">Expense by Category</h2>
//         <ResponsiveContainer width="100%" height={300}>
//           <PieChart>
//             <Pie data={categoryData} dataKey="value" nameKey="name" label>
//               {categoryData.map((_, i) => (
//                 <Cell key={i} fill={COLORS[i % COLORS.length]} />
//               ))}
//             </Pie>
//             <Tooltip />
//           </PieChart>
//         </ResponsiveContainer>
//       </div>

//       {/* BAR */}
//       <div className="bg-white p-6 rounded shadow">
//         <h2 className="text-xl font-semibold mb-4">
//           Monthly Expense Analytics
//         </h2>
//         <ResponsiveContainer width="100%" height={300}>
//           <BarChart data={monthlyData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="month" />
//             <YAxis />
//             <Tooltip />
//             <Bar dataKey="amount" fill="#FF8042" />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../services/firebase";
import useAuthStore from "../store/authStore";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function Dashboard() {
  const { user } = useAuthStore();
  const [transactions, setTransactions] = useState([]);

  const [budget, setBudget] = useState("");
  const [savedBudget, setSavedBudget] = useState(null);

  const currentMonthKey = new Date().toISOString().slice(0, 7);

  useEffect(() => {
    if (!user) return;

    const ref = collection(db, "users", user.uid, "transactions");
    const unsub = onSnapshot(ref, (snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data());
      setTransactions(data);
    });

    return () => unsub();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const fetchBudget = async () => {
      const ref = doc(db, "users", user.uid, "budgets", currentMonthKey);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setSavedBudget(snap.data().limit);
      }
    };

    fetchBudget();
  }, [user, currentMonthKey]);

  const saveBudget = async () => {
    if (!budget) return;

    const ref = doc(db, "users", user.uid, "budgets", currentMonthKey);
    await setDoc(ref, {
      limit: Number(budget),
      createdAt: Timestamp.now(),
    });

    setSavedBudget(Number(budget));
    setBudget("");
  };

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const categoryData = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, curr) => {
      const found = acc.find((a) => a.name === curr.category);
      if (found) found.value += curr.amount;
      else acc.push({ name: curr.category, value: curr.amount });
      return acc;
    }, []);

  const monthlyData = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, curr) => {
      const month = new Date(curr.date).toLocaleString("default", {
        month: "short",
        year: "numeric",
      });

      const found = acc.find((a) => a.month === month);
      if (found) found.amount += curr.amount;
      else acc.push({ month, amount: curr.amount });

      return acc;
    }, []);

  const budgetUsedPercent =
    savedBudget ? Math.round((totalExpense / savedBudget) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        {/* SUMMARY */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-green-100 dark:bg-green-900 p-4 rounded">
            <p>Total Income</p>
            <p className="text-2xl font-bold">₹{totalIncome}</p>
          </div>

          <div className="bg-red-100 dark:bg-red-900 p-4 rounded">
            <p>Total Expense</p>
            <p className="text-2xl font-bold">₹{totalExpense}</p>
          </div>

          <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded">
            <p>Balance</p>
            <p className="text-2xl font-bold">₹{balance}</p>
          </div>
        </div>

        {/* BUDGET */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Monthly Budget</h2>

          {!savedBudget ? (
            <div className="flex gap-3">
              <input
                type="number"
                className="border p-2 bg-white dark:bg-gray-800"
                placeholder="Enter budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
              <button
                onClick={saveBudget}
                className="bg-blue-600 text-white px-4"
              >
                Save
              </button>
            </div>
          ) : (
            <>
              <p>
                Budget: <b>₹{savedBudget}</b>
              </p>
              <p>
                Used: <b>{budgetUsedPercent}%</b>
              </p>

              {budgetUsedPercent >= 100 && (
                <p className="text-red-500 font-semibold">
                  🚨 Budget exceeded!
                </p>
              )}

              {budgetUsedPercent >= 80 && budgetUsedPercent < 100 && (
                <p className="text-orange-500 font-semibold">
                  ⚠️ Approaching budget limit
                </p>
              )}
            </>
          )}
        </div>

        {/* PIE */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded shadow mb-10">
          <h2 className="text-xl font-semibold mb-4">Expense by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name" label>
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* BAR */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">
            Monthly Expense Analytics
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#FF8042" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
