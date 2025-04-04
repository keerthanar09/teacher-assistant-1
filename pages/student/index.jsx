import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { getSession, useSession } from "next-auth/react";

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session || session.user.role !== "STUDENT") {
    return { redirect: { destination: "/", permanent: false } };
  }
  return { props: { session } };
}

export default function StudentDashboard() {
  const router = useRouter();
  const [classCode, setClassCode] = useState("");
  const [error, setError] = useState("");
  const { data: session, status } = useSession();

  useEffect(() => {
      if (status === "unauthenticated") {
        router.push("/login");
        return;
      }
    }, [status, session]);

  const handleJoinClass = async () => {
    setError("");
    const studentId = session.user.dbId;
    const res = await fetch("/api/joinClass", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, classCode }),
    });
    const data = await res.json();
    if (res.ok) {
      alert("Successfully joined the class!");
      setClassCode("");
    } else {
      setError(data.error || "Failed to join class.");
    }
  };

  return (
    <div className="min-h-screen bg-dark text-white p-10">
      <h1 className="text-4xl font-bold mb-6 text-center animate-fade-in">Student Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Search Quiz Section */}
        <div className="bg-blueShade p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl mb-4">Search for Quizzes</h2>
          <button
            className="px-6 py-3 bg-blue-500 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105"
            onClick={() => router.push('/quiz/search')}
          >
            Search Quizzes
          </button>
        </div>
        {/* View Results Section */}
        <div className="bg-blueShade p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl mb-4">View Results</h2>
          <button
            className="px-6 py-3 bg-blue-500 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105"
            onClick={() => router.push('/quiz/results')}
          >
            View Results
          </button>
        </div>
        {/* Join Class Section */}
        <div className="bg-blue-700 p-6 rounded-lg shadow-lg text-center justify-center">
          <h2 className="text-2xl mb-4">Join a Class</h2>
          <input
            type="text"
            placeholder="Enter Class Code"
            className="p-2 text-black rounded-lg w-full mb-4"
            value={classCode}
            onChange={(e) => setClassCode(e.target.value)}
          />
          {error && <p className="text-red-500">{error}</p>}
          <button
            className="px-6 py-3 bg-sky-500 rounded-lg hover:bg-sky-700 transition-all transform hover:scale-105"
            onClick={handleJoinClass}
          >
            Join Class
          </button>
        </div>
      </div>
    </div>
  );
}
