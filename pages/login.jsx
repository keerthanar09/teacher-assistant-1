// import { signIn } from 'next-auth/react';
import {useState} from 'react';
import {useRouter} from 'next/navigation';

const Login = () => {
  const [formData, setFormData] = useState({
    email:"",
    password: "", 
    role:""
  });
  const [error, setError] = useState("");
  const[loading, setLoading] = useState(false);
  const router = useRouter();
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;


  const {email, password, role} = formData;

  const onChange = (e) => 
    setFormData({...formData, [e.target.name]: e.target.value});

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try{
      const res = await fetch(`${BASE_URL}/api/login`, {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
        credentials:'include',
        body:JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok){
        setError(data.error ||"Login Failed");

      } else if(role == "STUDENT") {
        router.push("/student");
      } else if(role == "TEACHER") {
        router.push("/teacher");
      }
    }catch(err){
      setError("Something went wrong");
    }
    finally{
      setLoading(false);
    }
  };
  
  return (
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
        <label className="m-2" for="STUDENT">STUDENT</label><br></br>
        <input type="radio" name="role" value="TEACHER" onChange={onChange}/>
        <label className="m-2" for="TEACHER">TEACHER</label><br></br>
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
  );
};

export default Login;