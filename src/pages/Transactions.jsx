import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../services/firebase";
import useAuthStore from "../store/authStore";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const categories = ["Food", "Travel", "Rent", "Shopping", "Bills", "Other"];

export default function Transactions() {
  const { user } = useAuthStore();
  const [transactions, setTransactions] = useState([]);

  const [form, setForm] = useState({
    amount: "",
    type: "expense",
    category: "Food",
    note: "",
    date: "",
  });

  const [editingId, setEditingId] = useState(null);

  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    if (!user) return;
    const ref = collection(db, "users", user.uid, "transactions");
    const unsub = onSnapshot(ref, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTransactions(data);
    });
    return () => unsub();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || !form.date) return alert("Amount & Date required");

    const ref = collection(db, "users", user.uid, "transactions");

    if (editingId) {
      await updateDoc(doc(ref, editingId), {
        ...form,
        amount: Number(form.amount),
      });
      setEditingId(null);
    } else {
      await addDoc(ref, {
        ...form,
        amount: Number(form.amount),
        createdAt: Timestamp.now(),
      });
    }

    setForm({
      amount: "",
      type: "expense",
      category: "Food",
      note: "",
      date: "",
    });
  };

  const handleDelete = async (id) =>
    await deleteDoc(doc(db, "users", user.uid, "transactions", id));

  const handleEdit = (t) => {
    setForm(t);
    setEditingId(t.id);
  };

  const filteredTransactions = transactions.filter((t) => {
    if (filterType !== "all" && t.type !== filterType) return false;
    if (filterCategory !== "all" && t.category !== filterCategory) return false;
    if (fromDate && new Date(t.date) < new Date(fromDate)) return false;
    if (toDate && new Date(t.date) > new Date(toDate)) return false;
    return true;
  });

  const exportCSV = () => {
    const headers = ["Date", "Type", "Category", "Amount", "Note"];
    const rows = filteredTransactions.map((t) => [
      t.date,
      t.type,
      t.category,
      t.amount,
      t.note || "",
    ]);
    const csv =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((r) => r.join(",")).join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = "transactions.csv";
    link.click();
  };

  const exportPDF = () => {
    const pdf = new jsPDF();
    pdf.text("Transactions Report", 14, 10);
    autoTable(pdf, {
      head: [["Date", "Type", "Category", "Amount", "Note"]],
      body: filteredTransactions.map((t) => [
        t.date,
        t.type,
        t.category,
        t.amount,
        t.note || "",
      ]),
      startY: 20,
    });
    pdf.save("transactions.pdf");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Transactions</h1>

        <div className="flex gap-4 mb-6">
          <button onClick={exportCSV} className="bg-green-600 text-white px-4 py-2 rounded">
            Export CSV
          </button>
          <button onClick={exportPDF} className="bg-red-600 text-white px-4 py-2 rounded">
            Export PDF
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-6">
          <input className="border p-2 bg-white dark:bg-gray-800" placeholder="Amount"
            value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          <select className="border p-2 bg-white dark:bg-gray-800"
            value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <select className="border p-2 bg-white dark:bg-gray-800"
            value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
          <input type="date" className="border p-2 bg-white dark:bg-gray-800"
            value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          <input className="border p-2 col-span-2 bg-white dark:bg-gray-800"
            placeholder="Note" value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })} />
          <button className="bg-blue-600 text-white p-2 col-span-2">
            {editingId ? "Update" : "Add"} Transaction
          </button>
        </form>

        <div className="space-y-3">
          {filteredTransactions.map((t) => (
            <div key={t.id}
              className="border p-3 flex justify-between items-center bg-white dark:bg-gray-900 rounded">
              <div>
                <p className="font-semibold">₹{t.amount} — {t.type}</p>
                <p className="text-sm text-gray-500">{t.category} | {t.date} | {t.note}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => handleEdit(t)} className="text-blue-500">Edit</button>
                <button onClick={() => handleDelete(t.id)} className="text-red-500">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
