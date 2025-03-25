import { useState } from 'react';
import { useRouter } from 'next/router';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (response.ok) {
      router.push(data.role === 'teacher' ? '/teacher' : '/student');
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="h-screen bg-dark text-white flex items-center justify-center">
      <form className="bg-blueShade p-8 rounded-lg shadow-lg w-full max-w-md" onSubmit={handleLogin}>
        <h2 className="text-3xl mb-6 text-center">Login</h2>

        <input
          className="w-full mb-4 p-3 rounded-md bg-blue-300 text-black"
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="w-full mb-4 p-3 rounded-md bg-blue-300 text-black"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full p-3 bg-blue-500 rounded-md hover:bg-blue-700 transition-all"
        >
          Login
        </button>

        <p
          className="text-center mt-4 text-grey cursor-pointer hover:text-white"
          onClick={() => router.push('/forgot-password')}
        >
          Forgot Password?
        </p>
      </form>
    </div>
  );
}
