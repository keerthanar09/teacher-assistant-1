import React, { useEffect } from "react";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import TeacherNav from "@components/TeacherNav";
import StudentNav from "@/components/StudentNav";
import LoginNav from "@/components/LoginNav";
import "../styles/globals.css";

export default function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <AppContent Component={Component} pageProps={pageProps} />
    </SessionProvider>
  );
}

function AppContent({ Component, pageProps }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const role = session?.user?.role; // No need for extra state or API call

  useEffect(() => {
    if (status === "authenticated" && role) {
      if (router.pathname === "/" || router.pathname === "/login") {
        if (role === "TEACHER") router.push("/teacher");
        else if (role === "STUDENT") router.push("/student");
      }
    }
  }, [status, role, router]);

  let Navbar;
  if (role === "TEACHER") Navbar = <TeacherNav />;
  else if (role === "STUDENT") Navbar = <StudentNav />;
  else Navbar = <LoginNav />;

  return (
    <>
      {Navbar}
      <Component {...pageProps} />
    </>
  );
}
