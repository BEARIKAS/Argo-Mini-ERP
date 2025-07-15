import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import SignUpPage from "./pages/users/SignUp";
import LoginPage from "./pages/users/Login";
import LogoutPage from "./pages/users/Logout";
import CRMPage from "./pages/CRMPage";

import "./App.css";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen w-full">
        <Routes>
          <Route path="/" element={<LandingPage />}></Route>
          <Route path="/signup" element={<SignUpPage />}></Route>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/logout" element={<LogoutPage />}></Route>
          <Route path="/crmland" element={<CRMPage />}></Route>
        </Routes>
      </div>
    </Router>
  );
}
