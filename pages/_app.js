import TeacherNav from "@components/TeacherNav";
import StudentNav from "@/components/StudentNav";
import { useRouter } from "next/router";
import "../styles/globals.css";
import LoginNav from "@/components/LoginNav";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const path = router.pathname;

  let Navbar;
  if (path.startsWith("/teacher")) {
    Navbar = <TeacherNav />;
  } else if (path.startsWith("/student")) {
    Navbar = <StudentNav />;
  } else {
    Navbar = <LoginNav />;
  }

  return (
    <>
      {Navbar}
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
