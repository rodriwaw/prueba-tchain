"use client";
import { useRouter } from "next/navigation";
import React from "react";

const Dashboard: React.FC = () => {
  const router = useRouter();
  if (typeof window !== "undefined" && !localStorage.getItem("token")) {
    router.push("/login");
  }
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <nav className="bg-blue-600 p-4 shadow-md">
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
          onClick={handleLogout}
        >
          Logout
        </button>
      </nav>
      <main className="flex-grow p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Dashboard</h1>
        {/* Add dashboard content here */}
      </main>
    </div>
  );
};

export default Dashboard;
