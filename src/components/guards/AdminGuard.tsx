import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export default function AdminGuard({ children }: { children: ReactNode }) {
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    (async () => {
      // Quick client flag (set on admin login)
      const localFlag = localStorage.getItem("adminLoggedIn") === "true";
      if (localFlag) {
        setIsAdmin(true);
        setChecking(false);
        return;
      }

      // Robust check: if a session exists, try to read the admin row by auth uid
      const { data: { user } = {} } = await supabase.auth.getUser();
      if (!user) {
        setChecking(false);
        setIsAdmin(false);
        return;
      }

      const { data: row } = await supabase
        .from("admin_users")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();

      if (row && (row.role === "admin" || row.role === "super_admin")) {
        localStorage.setItem("adminLoggedIn", "true");
        setIsAdmin(true);
      }
      setChecking(false);
    })();
  }, []);

  if (checking) return null; // or a spinner
  if (!isAdmin) return <Navigate to="/login" replace state={{ msg: "This account is not an admin." }} />;

  return <>{children}</>;
}
