import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function SignIn() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      if (session.user.role === "TEACHER") {
        router.push("/teacher");
      } else if (session.user.role === "STUDENT") {
        router.push("/student");
      }
    }
  }, [session]);

  return (
    <div>
      <h1>Sign in</h1>
      <button onClick={() => signIn("google")}>Sign in with Google</button>
    </div>
  );
}
