import React from "react";
import { ArrowRight, Users, StickyNote, Workflow } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LoginButtonOrUsername from "./components/loginButtonOrUsername";
import NavBar from "./components/NavBar";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="w-screen overflow-x-hidden bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white font-sans">
      <NavBar />

      {/* Hero Section */}
      <section className="w-full py-24 px-4 sm:px-6 text-center">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl sm:text-6xl font-extrabold mb-6">
            Simple Employee CRM Page
          </h2>
          <p className="text-lg sm:text-xl text-zinc-400 mb-10">
            Track leads, manage meetings, and streamline your customer
            interactions.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="w-full py-24 px-4 sm:px-6 bg-gradient-to-b from-zinc-800 via-black to-zinc-900"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="bg-zinc-900 border border-zinc-700 p-6 rounded-xl shadow-md hover:shadow-xl transition">
              <div className="flex flex-col items-center justify-center mb-4 text-indigo-400">
                <Users className="w-6 h-6 mb-2" />
                <h4 className="text-xl font-bold text-center">
                  View Current Leads
                </h4>
              </div>
              <p className="text-zinc-300 text-center">
                Instantly check which customers are marked as "cold" or "warm"
                leads, with real-time updates.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-zinc-900 border border-zinc-700 p-6 rounded-xl shadow-md hover:shadow-xl transition">
              <div className="flex flex-col items-center justify-center mb-4 text-emerald-400">
                <StickyNote className="w-6 h-6 mb-2" />
                <h4 className="text-xl font-bold text-center">Meeting Notes</h4>
              </div>
              <p className="text-zinc-300 text-center">
                Record critical information from client meetings to track
                follow-ups and next steps.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-zinc-900 border border-zinc-700 p-6 rounded-xl shadow-md hover:shadow-xl transition">
              <div className="flex flex-col items-center justify-center mb-4 text-yellow-400">
                <Workflow className="w-6 h-6 mb-2" />
                <h4 className="text-xl font-bold text-center">
                  Sales Pipeline
                </h4>
              </div>
              <p className="text-zinc-300 text-center">
                Understand where each lead is in the pipeline, from first
                contact to closing the deal.
              </p>
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
