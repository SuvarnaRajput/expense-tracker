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
import { motion } from "framer-motion";

const COLORS = ["#6366F1", "#22C55E", "#F59E0B", "#EF4444", "#0EA5E9"];

/* 🔹 Animation Variants */
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

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
    <div className="min-h-screen bg-bgApp-light dark:bg-bgApp-dark text-textMain-light dark:text-textMain-dark">
      <div className="container py-8">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-2xl font-semibold mb-8"
        >
          Dashboard Overview
        </motion.h1>

        {/* Summary Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-6 md:grid-cols-3 mb-10"
        >
          {[
            { label: "Total Income", value: totalIncome, color: "text-success" },
            {
              label: "Total Expense",
              value: totalExpense,
              color: "text-danger",
            },
            { label: "Balance", value: balance, color: "" },
          ].map((card, i) => (
            <motion.div
              key={i}
              variants={item}
              whileHover={{ y: -4 }}
              className="bg-card-light dark:bg-card-dark border border-borderSubtle-light dark:border-borderSubtle-dark rounded-2xl p-6 shadow-soft"
            >
              <p className="text-textMuted-light dark:text-textMuted-dark">
                {card.label}
              </p>
              <p className={`text-3xl font-bold mt-2 ${card.color}`}>
                ₹{card.value}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Budget Card */}
        <motion.div
          variants={item}
          initial="hidden"
          animate="show"
          className="bg-card-light dark:bg-card-dark border border-borderSubtle-light dark:border-borderSubtle-dark rounded-2xl p-8 shadow-soft mb-10"
        >
          <h2 className="text-xl font-semibold mb-4">Monthly Budget</h2>

          {!savedBudget ? (
            <div className="flex gap-3 max-w-md">
              <input
                type="number"
                className="flex-1 rounded-md border border-borderSubtle-light dark:border-borderSubtle-dark px-3 py-2 bg-transparent"
                placeholder="Enter budget amount"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
              <button
                onClick={saveBudget}
                className="px-5 py-2 rounded-md bg-primary text-white hover:bg-primaryHover transition"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <p>
                Budget: <b>₹{savedBudget}</b>
              </p>
              <p>
                Used: <b>{budgetUsedPercent}%</b>
              </p>

              {budgetUsedPercent >= 100 && (
                <p className="text-danger font-semibold">
                  🚨 Budget exceeded
                </p>
              )}

              {budgetUsedPercent >= 80 && budgetUsedPercent < 100 && (
                <p className="text-warning font-semibold">
                  ⚠️ Approaching budget limit
                </p>
              )}
            </div>
          )}
        </motion.div>

        {/* Charts */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-8 md:grid-cols-2"
        >
          <motion.div
            variants={item}
            className="bg-card-light dark:bg-card-dark border border-borderSubtle-light dark:border-borderSubtle-dark rounded-2xl p-6 shadow-soft"
          >
            <h2 className="text-lg font-semibold mb-4">
              Expense by Category
            </h2>
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
          </motion.div>

          <motion.div
            variants={item}
            className="bg-card-light dark:bg-card-dark border border-borderSubtle-light dark:border-borderSubtle-dark rounded-2xl p-6 shadow-soft"
          >
            <h2 className="text-lg font-semibold mb-4">
              Monthly Expense Analytics
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#6366F1" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
