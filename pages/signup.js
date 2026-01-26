import { useState } from "react";
import { useRouter } from "next/router";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const[error, setError] = useState("");
  const[loading, setLoading] = useState(false);
  const router = useRouter();
  // const [verificationCode, setVerificationCode] = useState('');
  // const [codeSent, setCodeSent] = useState(false);
  // const [verified, setVerified] = useState(false);

  const { username, name, email, password, role } = formData;
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try{
      const res = await fetch("api/auth/signup", {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Signup failed");
      } else {
        router.push("/login");
      }
    }catch(err){
      setError("Something went wrong");
      console.log(err);
    } finally{
      setLoading(false);
    }

  };

  

  return (
    <div className="h-screen bg-dark text-white flex items-center justify-center">
      <form
        className="p-8 rounded-lg shadow shadow-blue-300 w-full max-w-md"
        onSubmit={onSubmit}
      >
        <h2 className="text-3xl mb-6 text-center">Signup</h2>

        <input
          className="w-full mb-4 p-3 rounded-md bg-blue-400 text-black"
          name="username"
          placeholder="Username"
          value={username}
          onChange={onChange}
          required
        />

        <input
          className="w-full mb-4 p-3 rounded-md bg-blue-400 text-black"
          name="name"
          placeholder="Name"
          value={name}
          onChange={onChange}
          required
        />

        <input
          className="w-full mb-4 p-3 rounded-md bg-blue-400 text-black"
          name="email"
          placeholder="Email"
          value={email}
          onChange={onChange}
          required
        />

        <input
          className="w-full mb-4 p-3 rounded-md bg-blue-400 text-black"
          type='password'
          name="password"
          placeholder="Password"
          value={password}
          onChange={onChange}
          required
        />
      <div className="bg-blue-400 text-black w-full mb-4 p-3 rounded-md">
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
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default Signup;

//PREV CODE FOR VERIFICATION CODE AND HANDLING SIGNUP. MIGHT ADD LATER

// const sendVerificationCode = async () => {
//   const response = await fetch('/api/auth/signup', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ email: formData.email, action: 'send-code' })
//   });

//   const data = await response.json();
//   if (response.ok) {
//     alert(data.message);
//     setCodeSent(true);
//   } else {
//     alert(data.error);
//   }
// };

// const verifyCode = async () => {
//   const response = await fetch('/api/auth/signup', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ email: formData.email, verificationCode, action: 'verify-code' })
//   });

//   const data = await response.json();
//   if (response.ok) {
//     alert(data.message);
//     setVerified(true);
//   } else {
//     alert(data.error);
//   }
// };

// const handleSignup = async (e) => {
//   e.preventDefault();
//   if (!verified) return alert('Please verify your email first.');

//   const response = await fetch('/api/auth/signup', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ ...formData, action: 'signup' })
//   });

//   const data = await response.json();
//   if (response.ok) {
//     alert(data.message);
//     router.push('/login');
//   } else {
//     alert(data.error);
//   }
// };
