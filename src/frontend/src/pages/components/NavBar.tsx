import React from "react";
import { useNavigate } from "react-router-dom";
import LoginButtonOrUsername from "./loginButtonOrUsername";

export default function NavBar() {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-gray-900 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between relative">
        {/* Left: Logo */}
        <h1
          className="text-2xl font-bold cursor-pointer"
          onClick={() => navigate("/")}
        >
          Argo Mini-ERP
        </h1>

        {/* Center: CRM link */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <nav className="flex gap-6 text-sm font-medium items-center">
            <a
              className="hover:text-white cursor-pointer"
              onClick={() => navigate("/crmland")}
            >
              CRM
            </a>
          </nav>
        </div>

        {/* Right: Login */}
        <LoginButtonOrUsername />
      </div>
    </div>
  );
}
