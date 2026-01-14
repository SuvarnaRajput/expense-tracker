import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../store/authStore";
import AppNavbar from "../components/AppNavbar";

const ProtectedRoute = () => {
  const { user, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Checking authentication...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <AppNavbar />
      <Outlet />
    </>
  );
};

export default ProtectedRoute;
