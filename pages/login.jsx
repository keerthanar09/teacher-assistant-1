import { signIn } from 'next-auth/react';

export default function Login() {
  return (
    <div className="h-screen bg-dark text-white flex items-center justify-center">
      <div className="bg-blueShade p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl mb-6 text-center">Login</h2>
        <button
          onClick={() => signIn('google')}
          className="w-full p-3 bg-blue-500 rounded-md hover:bg-blue-700 transition-all"
        >
          Login with Google
        </button>
      </div>
    </div>
  );
}
