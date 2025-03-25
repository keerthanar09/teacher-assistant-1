import Link from 'next/link';


export default function Home() {
  return (
    <div className="h-screen bg-dark text-white flex flex-col items-center justify-center">
      <div className="text-center space-y-6 mt-10">
        <h1 className="text-5xl font-bold animate-fade-in">
          Welcome to Teacher's Assistant
        </h1>
        <p className="text-lg text-grey">
          Empowering teachers to create quizzes with AI and students to enhance learning.
        </p>
        <div className="flex space-x-4 justify-center">
          <div className="px-6 py-3 bg-blue-500 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105">
            <Link href="/signup">Signup</Link>
          </div>
          <div className="px-6 py-3 bg-blue-500 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105">
            <Link href="/login">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
