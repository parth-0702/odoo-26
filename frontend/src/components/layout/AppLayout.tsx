import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { GlobalSearch } from "@/components/search/GlobalSearch";

export function AppLayout() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="min-h-screen bg-background text-on-surface bg-grid-pattern">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile sidebar */}
      {mobileNav && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-30 bg-background/70 backdrop-blur-sm" onClick={() => setMobileNav(false)} />
          <Sidebar onNavigate={() => setMobileNav(false)} />
        </div>
      )}

      <div className="lg:pl-[280px] min-h-screen flex flex-col">
        <TopBar onOpenSearch={() => setSearchOpen(true)} onOpenMenu={() => setMobileNav(true)} />
        <main className="flex-1 p-md sm:p-lg max-w-[1600px] w-full mx-auto">
          <Outlet />
        </main>
      </div>

      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}