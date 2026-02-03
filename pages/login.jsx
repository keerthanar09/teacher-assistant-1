// import { signIn } from 'next-auth/react';
import {useState} from 'react';
import {useRouter} from 'next/router';
import Layout from '@layouts/layout';

const Login = () => {
  const [formData, setFormData] = useState({
    email:"",
    password: "", 
    role:""
  });
  const [error, setError] = useState("");
  const[loading, setLoading] = useState(false);
  const router = useRouter();
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';


  const {email, password, role} = formData;

  const onChange = (e) => 
    setFormData({...formData, [e.target.name]: e.target.value});

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${BASE_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Login failed");
      }

      // Wait for cookie to be set properly
      await new Promise(resolve => setTimeout(resolve, 100));

      const userRes = await fetch(`${BASE_URL}/api/user`, {
        credentials: "include",
      });

      if (!userRes.ok) throw new Error("Auth verification failed");

      const user = await userRes.json();

      // Use window.location for full page reload to ensure cookie is included
      if (user.role === "TEACHER") {
        window.location.href = "/teacher";
      } else if (user.role === "STUDENT") {
        window.location.href = "/student";
      }
    } catch (err) {
      setError(err.message);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <Layout isAuth={false}>
      <div className="h-screen bg-dark text-white flex items-center justify-center">
      <form
        className="p-8 rounded-lg shadow shadow-blue-300 w-full max-w-md"
        onSubmit={onSubmit}
      >
        <h2 className="text-3xl mb-6 text-center">Login</h2>

        <input
          className="auth-input-field"
          name="email"
          placeholder="Email"
          value={email}
          onChange={onChange}
          required
        />

        <input
          className="auth-input-field"
          type='password'
          name="password"
          placeholder="Password"
          value={password}
          onChange={onChange}
          required
        />
      <div className="auth-input-field">
        <p className="text-center text-blue-800 font-mono">Select your role </p>
        <input type="radio" name="role" value="STUDENT" onChange={onChange}/>
        <label className="m-2" htmlFor="STUDENT">STUDENT</label><br></br>
        <input type="radio" name="role" value="TEACHER" onChange={onChange}/>
        <label className="m-2" htmlFor="TEACHER">TEACHER</label><br></br>
      </div>
        

        <button
          type="submit"
          disabled = {loading}
          className="w-full p-3 bg-blue-500 rounded-md hover:bg-blue-700"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
    </Layout>
    
  );
};

export default Login;