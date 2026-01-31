import Layout from "@layouts/layout";
import useAuth from "@hooks/useAuth";
import { useState, useEffect } from 'react';
import { useRouter } from "next/router";

export default function RoomPage() {
  const { user, loading } = useAuth("TEACHER");
  const router = useRouter();
  const { id, name, classcode, capacity } = router.query;
  const [quizzes, setQuizzes] = useState([]);
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const room = {
    id, name, classcode, capacity:parseInt(capacity)
  };

  useEffect(() => {
    if (id) {
      fetchQuizzes();
    }
  }, [id]);



  async function fetchQuizzes() {
    try {
      const res = await fetch(`${BASE_URL}/api/quiz/${roomid}`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setQuizzes(data);
      }
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    }
  }

  if (loading || !router.isReady) return null;

  return (
    <Layout isAuth={true} role="TEACHER">
      <h1 className="text-center font-mono text-4xl font-bold">{room.name}</h1>
      <p className="text-center font-mono text-xl">Class Code: {room.classcode}</p>
      <p className="text-center font-mono">Capacity: {room.capacity}</p>
      
      <div className="mt-8">
        <h2 className="text-2xl font-mono mb-4">Quizzes</h2>
        {/* Display quizzes and allow creating new ones */}
      </div>
    </Layout>
  );
}