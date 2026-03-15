import { Button } from "@/components/ui/button";
import { LogIn, LogOut, Menu, Shield, X } from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useIsAdmin } from "../hooks/useQueries";

interface HeaderProps {
  onAdminClick: () => void;
  showAdmin: boolean;
}

export default function Header({ onAdminClick, showAdmin }: HeaderProps) {
  const { login, clear, identity, isLoggingIn } = useInternetIdentity();
  const { data: isAdmin } = useIsAdmin();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLoggedIn = !!identity;

  return (
    <header className="sticky top-0 z-50 shadow-gov">
      <div className="saffron-stripe h-1.5" />

      <div className="gov-header-bg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <button
              type="button"
              data-ocid="nav.link"
              onClick={() => {
                if (showAdmin) onAdminClick();
              }}
              className="flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-full bg-saffron-500 flex items-center justify-center flex-shrink-0">
                <span className="text-navy-900 font-display font-bold text-sm">
                  GJ
                </span>
              </div>
              <div>
                <h1 className="text-white font-display font-bold text-xl leading-none">
                  GovJobsNews
                </h1>
                <p className="text-navy-200 text-xs">
                  Government Jobs & Exam Results Portal
                </p>
              </div>
            </button>

            <nav className="hidden md:flex items-center gap-2">
              {isAdmin && (
                <Button
                  data-ocid="nav.admin.button"
                  variant="ghost"
                  size="sm"
                  onClick={onAdminClick}
                  className="text-saffron-300 hover:text-saffron-100 hover:bg-navy-600 gap-1.5"
                >
                  <Shield className="w-4 h-4" />
                  {showAdmin ? "View Site" : "Admin Panel"}
                </Button>
              )}
              {isLoggedIn ? (
                <Button
                  data-ocid="nav.logout.button"
                  variant="ghost"
                  size="sm"
                  onClick={clear}
                  className="text-white hover:text-white hover:bg-navy-600 gap-1.5"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              ) : (
                <Button
                  data-ocid="nav.login.button"
                  size="sm"
                  onClick={login}
                  disabled={isLoggingIn}
                  className="bg-saffron-500 hover:bg-saffron-400 text-navy-900 font-semibold gap-1.5"
                >
                  <LogIn className="w-4 h-4" />
                  {isLoggingIn ? "Logging in..." : "Login"}
                </Button>
              )}
            </nav>

            <button
              type="button"
              data-ocid="nav.toggle"
              className="md:hidden text-white p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden pb-4 flex flex-col gap-2">
              {isAdmin && (
                <Button
                  data-ocid="nav.admin.button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onAdminClick();
                    setMobileMenuOpen(false);
                  }}
                  className="text-saffron-300 hover:text-saffron-100 hover:bg-navy-600 gap-1.5 justify-start"
                >
                  <Shield className="w-4 h-4" />
                  {showAdmin ? "View Site" : "Admin Panel"}
                </Button>
              )}
              {isLoggedIn ? (
                <Button
                  data-ocid="nav.logout.button"
                  variant="ghost"
                  size="sm"
                  onClick={clear}
                  className="text-white hover:bg-navy-600 gap-1.5 justify-start"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              ) : (
                <Button
                  data-ocid="nav.login.button"
                  size="sm"
                  onClick={login}
                  disabled={isLoggingIn}
                  className="bg-saffron-500 hover:bg-saffron-400 text-navy-900 font-semibold gap-1.5 justify-start"
                >
                  <LogIn className="w-4 h-4" />
                  {isLoggingIn ? "Logging in..." : "Login"}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="bg-navy-800 border-t border-navy-700">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto py-1.5 text-sm">
            {[
              { label: "Latest Jobs", id: "jobs" },
              { label: "Results", id: "results" },
              { label: "Admit Cards", id: "admit-cards" },
              { label: "Notifications", id: "notifications" },
            ].map((item) => (
              <a
                key={item.id}
                data-ocid={`nav.${item.id}.link`}
                href={`#${item.id}`}
                className="text-navy-200 hover:text-saffron-400 px-3 py-1 rounded whitespace-nowrap transition-colors text-xs font-medium"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
