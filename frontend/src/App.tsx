import React, {useState, useEffect} from "react";
import Dashboard from "./components/User/Dashboard";
import Signup from "./components/User/Signup";
import Login from "./components/User/Login";
import ProductPage from "../src/components/Product/ProductPage";

export type Page = "dashboard" | "signup" | "login" | "product";

const App: React.FC = () => {
  const [page, setPage] = useState<Page>("dashboard");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if(token) setIsLoggedIn(true);
  }, []);

  useEffect(() => {
    const handler = (event: ErrorEvent) => {
      console.error("runtime error:", event.error);
      alert("unexpected error.check console for details.");
    };
    window.addEventListener("error", handler);
    return () => window.removeEventListener("error", handler);
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setPage("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setPage("dashboard");
  };

  return (
    <div style={{fontFamily: "sans-serif", maxWidth: 400, margin: "40px auto"}}>
      {page === "dashboard" && (
        <Dashboard 
          isLoggedIn = {isLoggedIn}
          goSignup={() => setPage("signup")}
          goLogin={() => setPage("login")}
          goProduct={() => setPage("product")}
          logout={handleLogout}
        />
      )}

      {page === "signup" && (
        <Signup 
          goDashboard={() => setPage("dashboard")}
          goLogin={() => setPage("login")}
        />
      )}

      {page === "login" && (
        <Login 
          goDashboard={() => setPage("dashboard")}
          goSignup={() => setPage("signup")}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {page === "product" && isLoggedIn && (
        <ProductPage goDashboard={() => setPage("dashboard")} />
      )}
    </div>
  );
};

export default App;