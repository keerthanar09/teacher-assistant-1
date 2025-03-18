import "../styles/globals.css";
import NavBar from "@components/NavBar";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <NavBar/>
      <main className="p-6">
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default MyApp;
