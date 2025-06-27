import React from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LoginButtonOrUsername from "./components/loginButtonOrUsername";
import NavBar from "./components/NavBar";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="w-screen overflow-x-hidden bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white font-sans">

      
      <NavBar></NavBar>


      {/* Hero Section */}
      <section className="w-full py-24 px-4 sm:px-6 text-center">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl sm:text-6xl font-extrabold mb-6">A simple ERP system written by Erikas Bartkevicius</h2>
          <p className="text-lg sm:text-xl text-zinc-400 mb-10">
            Argo Mini-ERP gives you ________
          </p>
          <button 
            onClick={() => navigate('/signup')}
            className="px-6 py-3 bg-white text-black font-medium text-lg rounded-lg flex items-center gap-2 mx-auto hover:bg-zinc-200 transition"
          >
            Get Started <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-24 px-4 sm:px-6 bg-gradient-to-b from-zinc-800 via-black to-zinc-900">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-semibold text-white text-center mb-16">What You Get</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-zinc-900 border border-zinc-700 p-6 rounded-xl shadow-md hover:shadow-lg transition">
              <h4 className="text-xl font-bold mb-2">ERP:</h4>
              <p className="text-zinc-400">BLANK</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-700 p-6 rounded-xl shadow-md hover:shadow-lg transition">
              <h4 className="text-xl font-bold mb-2">ERP</h4>
              <p className="text-zinc-400">BLANK</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-700 p-6 rounded-xl shadow-md hover:shadow-lg transition">
              <h4 className="text-xl font-bold mb-2">ERP</h4>
              <p className="text-zinc-400">BLANK</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-8 px-4 sm:px-6 bg-black text-center text-zinc-500 text-sm">
        <p>© {new Date().getFullYear()} Argo Mini-ERP. All rights reserved.</p>
      </footer>
    </div>
  );
}