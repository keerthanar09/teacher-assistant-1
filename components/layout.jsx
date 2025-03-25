
import '@styles/globals.css';
import NavBar from '@components/TeacherNav';

 
export default function Layout({ children }) {
  return (
    <>
      <NavBar />
      <main>{children}</main>
    </>
  )
}