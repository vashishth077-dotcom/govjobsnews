import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { useIsAdmin } from "./hooks/useQueries";
import AdminPanel from "./pages/AdminPanel";
import HomePage from "./pages/HomePage";

export default function App() {
  const [showAdmin, setShowAdmin] = useState(false);
  const { data: isAdmin } = useIsAdmin();

  function toggleAdmin() {
    setShowAdmin((prev) => !prev);
  }

  return (
    <div className="min-h-screen flex flex-col bg-background font-body">
      <Header onAdminClick={toggleAdmin} showAdmin={showAdmin && !!isAdmin} />
      <div className="flex-1">
        {showAdmin && isAdmin ? <AdminPanel /> : <HomePage />}
      </div>
      <Footer />
      <Toaster />
    </div>
  );
}
