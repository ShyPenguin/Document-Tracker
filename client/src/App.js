import { useSelector } from "react-redux";
import { BrowserRouter, Routes, Navigate, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage/Index";
import PageNotFound from "./components/PageNotFound";
import AdminView from "./scenes/AdminView";
import DeptView from "./scenes/DeptView";

function App() {
  const user = useSelector((state) => state.auth.user);
  const isAuth = useSelector((state) => state.auth.token);

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/admin/*"
            element={
              isAuth && user && user.role === "admin" ? (
                <AdminView />
              ) : (
                <Navigate to="/" />
              )
            }
          />

          <Route
            path="/department/*"
            element={
              isAuth && user && user.role === "user" ? (
                <DeptView />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
