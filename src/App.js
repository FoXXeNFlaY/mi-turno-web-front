import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useLocation, useNavigate } from "react-router";
import PromotionalMessage from "./commons/promotional-message";
import Login from "./components/Login";
import RecoverPassword from "./components/RecoverPassword";
import AdminRoutes from "./navigation/AdminRoutes";
import ClientRoutes from "./navigation/ClientRoutes";
import OperatorRoutes from "./navigation/OperatorRoutes";
import { login } from "./state/user";
import Navbar from "./commons/Navbar/Navbar";
import Register from "./components/Register";

function App() {
  const location = useLocation();
  const { pathname } = location;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  useEffect(() => {
    axios
      .get("http://localhost:3001/api/users/me", { withCredentials: true })
      .then((res) => {
        if (res.data) {
          const userData = {
            fullname: res.data.fullname,
            email: res.data.email,
            dni: res.data.DNI,
            isAdmin: res.data.isAdmin,
            isOperator: res.data.isOperator,
          };
          dispatch(login(userData));
        }
      })
      .catch(
        () => pathname !== ("/register" || "/recoverPassword") && navigate("/")
      );
  }, []);
  useEffect(() => {
    if (user.email) {
      if (pathname.includes("/admin/") && !user.isAdmin) navigate("/");
      if (pathname.includes("/operator/") && !user.isOperator) navigate("/");
      if (pathname.includes("/client/") && (user.isAdmin || user.isOperator))
        navigate("/");
      if (pathname === "/" && user.isAdmin) navigate("/admin/allBranches");
      if (pathname === "/" && user.isOperator)
        navigate("/operator/reservationsList");
      if (pathname === "/" && !user.isOperator && !user.isAdmin && user.email)
        navigate("/client/newReservation");
    } else if (pathname.includes("/login") || pathname.includes("/register")) {
      user.isAdmin && navigate("/admin/allBranches");
      user.isOperator && navigate("/operator/reservationsList");
      user.email && navigate("/client/newReservation");
    }
  }, [pathname, user, user.isAdmin, user.isOperator]);
  return (
    <div className="App">
      <PromotionalMessage />
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {user.email && !user.isAdmin && !user.isOperator && (
          <Route path="/client/*" element={<ClientRoutes />} />
        )}
        {user.isOperator && (
          <Route path="/operator/*" element={<OperatorRoutes />} />
        )}

        {user.isAdmin && <Route path="/admin/*" element={<AdminRoutes />} />}
        <Route
          path="/recoverPassword/:userEmail"
          element={<RecoverPassword />}
        />
      </Routes>
    </div>
  );
}

export default App;
