import TeacherNav from "@components/TeacherNav";
import StudentNav from "@components/StudentNav";
import LoginNav from "@components/LoginNav";

const Layout = ({ isAuth, role, children }) => {
  let Navbar = <LoginNav />;

  if (isAuth && role === "STUDENT") Navbar = <StudentNav />;
  if (isAuth && role === "TEACHER") Navbar = <TeacherNav />;

  return (
    <>
      {Navbar}
      <main>{children}</main>
    </>
  );
};

export default Layout;
