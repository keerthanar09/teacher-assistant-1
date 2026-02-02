import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function useAuth(requiredRole = null) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/user`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Unauthenticated");

        const data = await res.json();

        if (requiredRole && data.role !== requiredRole) {
          router.replace("/login");
          return;
        }

        setUser(data);
      } catch {
        console.log("AUTH FAIL", { requiredRole, data });
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []); 

  return { user, loading };
}
