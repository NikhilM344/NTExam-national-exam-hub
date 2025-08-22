import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const raw = localStorage.getItem("adminSession");
    if (!raw) {
      navigate("/login");
      return;
    }
    try {
      const sess = JSON.parse(raw);
      setAllowed(!!sess?.email);
    } catch {
      setAllowed(false);
    } finally {
      setChecking(false);
    }
  }, [navigate]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Checking admin access…</div>
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="text-lg font-semibold">Not authorized</div>
        <Button onClick={() => navigate("/login")}>Go to Login</Button>
      </div>
    );
  }

  return <>{children}</>;
}
