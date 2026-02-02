import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function useAuth(requiredRole = null) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    let ismounted = true;
    const checkAuth = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/user`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Not Authenticated!");

        const data = await res.json();
        console.log(data);

        if (requiredRole) {
          if (!data.role) {
            console.error("Role missing from /api/user response", data);
            router.replace("/login");
            return;
          }

          if (data.role !== requiredRole) {
            router.replace("/login");
            return;
          }
        }

        if (ismounted) {
          setUser(data);
          setLoading(false);
        }
      } catch {
        if (ismounted) {
          setLoading(false);
          router.replace("/login");
        }
      }
    };

    checkAuth();
  }, [router, requiredRole]);
  return { user, loading };
}
