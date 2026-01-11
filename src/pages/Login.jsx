import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    await signInWithEmailAndPassword(auth, email, password);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <form onSubmit={handleLogin} className="border p-6 w-80 space-y-4">
        <h1 className="text-xl font-bold">Login</h1>
        <input className="border p-2 w-full" placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <input className="border p-2 w-full" placeholder="Password" type="password" onChange={e => setPassword(e.target.value)} />
        <button className="bg-blue-600 text-white w-full p-2">Login</button>
        <Link to="/register">Go to Register</Link>
      </form>
    </div>
  );
}
