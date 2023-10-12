import { Outlet, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Home from "./pages/Home";
import Login from "./pages/Login.jsx";
import Profile from "./pages/Profile";
import Register from "./pages/Register.jsx";
import ResetPassword from "./pages/ResetPassword";
import ChangePassword from "./pages/ChangePassword";
import { useNavigate } from "react-router-dom";
function Layout() {
  const { user } = useSelector((state) => state.user);
  const nav=useNavigate()
  return user?.token ? (
    <Outlet />
  ) : (
    nav('/login')
  );
}
function App() {
  const { theme } = useSelector((state) => state.theme);

  return (
    <div data-theme={theme} className="w-full min-h-[100vh]">
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile/:id?" element={<Profile />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
