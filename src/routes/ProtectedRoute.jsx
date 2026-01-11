import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../store/authStore";

const ProtectedRoute = () => {
  const { user, loading } = useAuthStore();

  if (loading) return <p>Loading...</p>;

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
