import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
  e.preventDefault();

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("User registered successfully!");
    navigate("/");
  } catch (error) {
    console.error("Firebase Error:", error);
    alert(error.message);
  }
};

  return (
    <div className="min-h-screen flex justify-center items-center">
      <form onSubmit={handleRegister} className="border p-6 w-80 space-y-4">
        <h1 className="text-xl font-bold">Register</h1>
        <input className="border p-2 w-full" placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <input className="border p-2 w-full" placeholder="Password" type="password" onChange={e => setPassword(e.target.value)} />
        <button className="bg-green-600 text-white w-full p-2">Register</button>
      </form>
    </div>
  );
}
