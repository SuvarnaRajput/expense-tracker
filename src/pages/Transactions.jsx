import { useEffect, useState, Fragment } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db } from "../services/firebase";
import useAuthStore from "../store/authStore";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/20/solid";

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

  /* 🔹 REAL‑TIME FETCH */
  useEffect(() => {
    if (!user) return;

    const ref = collection(db, "users", user.uid, "transactions");
    const unsub = onSnapshot(ref, (snapshot) => {
      const data = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setTransactions(data);
    });

    return () => unsub();
  }, [user]);

  /* 🔹 ADD TRANSACTION */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || !form.date) {
      alert("Amount & Date required");
      return;
    }

    await addDoc(collection(db, "users", user.uid, "transactions"), {
      ...form,
      amount: Number(form.amount),
      createdAt: Timestamp.now(),
    });

    setForm({
      amount: "",
      type: "expense",
      category: "Food",
      note: "",
      date: "",
    });
  };

  return (
    <div className="min-h-screen bg-bgApp-light dark:bg-bgApp-dark text-textMain-light dark:text-textMain-dark">
      <div className="max-w-5xl mx-auto py-8 space-y-10">

        {/* ADD TRANSACTION */}
        <div className="bg-card-light dark:bg-card-dark rounded-2xl p-6 shadow-soft">
          <h2 className="text-lg font-semibold mb-4">Add Transaction</h2>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <input
              className="border rounded-md px-3 py-2 bg-transparent"
              placeholder="Amount"
              value={form.amount}
              onChange={(e) =>
                setForm({ ...form, amount: e.target.value })
              }
            />

            <select
              className="border rounded-md px-3 py-2 bg-transparent"
              value={form.type}
              onChange={(e) =>
                setForm({ ...form, type: e.target.value })
              }
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>

            {/* HEADLESS UI CATEGORY */}
            <Listbox
              value={form.category}
              onChange={(value) =>
                setForm({ ...form, category: value })
              }
            >
              <div className="relative">
                <Listbox.Button className="w-full border rounded-md px-3 py-2 flex justify-between items-center">
                  <span>{form.category}</span>
                  <ChevronUpDownIcon className="h-5 w-5 opacity-60" />
                </Listbox.Button>

                <Transition as={Fragment}>
                  <Listbox.Options className="absolute z-10 mt-2 w-full rounded-md bg-card-light dark:bg-card-dark border shadow">
                    {categories.map((cat) => (
                      <Listbox.Option
                        key={cat}
                        value={cat}
                        className="cursor-pointer px-4 py-2 hover:bg-primary hover:text-white"
                      >
                        {({ selected }) => (
                          <div className="flex justify-between">
                            <span>{cat}</span>
                            {selected && <CheckIcon className="h-4 w-4" />}
                          </div>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>

            <input
              type="date"
              className="border rounded-md px-3 py-2 bg-transparent"
              value={form.date}
              onChange={(e) =>
                setForm({ ...form, date: e.target.value })
              }
            />

            <input
              className="border rounded-md px-3 py-2 bg-transparent md:col-span-2"
              placeholder="Note"
              value={form.note}
              onChange={(e) =>
                setForm({ ...form, note: e.target.value })
              }
            />

            <button className="md:col-span-2 bg-primary text-white py-2 rounded-md">
              Add Transaction
            </button>
          </form>
        </div>

        {/* TRANSACTIONS LIST */}
        <div className="space-y-4">
          {transactions.map((t) => (
            <div
              key={t.id}
              className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-soft flex justify-between"
            >
              <div>
                <p className="font-medium">
                  ₹{t.amount}{" "}
                  <span className={t.type === "income" ? "text-success" : "text-danger"}>
                    ({t.type})
                  </span>
                </p>
                <p className="text-sm opacity-70">
                  {t.category} • {t.date} {t.note && `• ${t.note}`}
                </p>
              </div>
            </div>
          ))}

          {transactions.length === 0 && (
            <p className="text-center opacity-60">
              No transactions yet
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
