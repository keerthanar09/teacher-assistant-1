import Layout from "@layouts/layout";
import useAuth from "@hooks/useAuth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function StudentRoomPage() {
  const { user, loading } = useAuth("STUDENT");
  const router = useRouter();
  const { id } = router.query;
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const [room, setRoom] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [load, setLoad] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchRoomAndQuizzes();
  }, [id]);

  async function fetchRoomAndQuizzes() {
    setLoad(true);
    try {
      const [rRes, qRes] = await Promise.all([
        fetch(`${BASE_URL}/api/room/${id}`, { credentials: "include" }),
        fetch(`${BASE_URL}/api/room/${id}/quizzes`, { credentials: "include" }),
      ]);
      if (rRes.ok) setRoom(await rRes.json());
      if (qRes.ok) setQuizzes(await qRes.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoad(false);
    }
  }

  if (loading || !router.isReady) return null;

  return (
    <Layout isAuth={true} role="STUDENT">
      <div className="max-w-6xl mx-auto p-6">
        <div className="p-6 rounded-xl mb-6 bg-blue-900/20">
          <h1 className="text-4xl font-mono font-bold mb-1">{room?.title || "Class"}</h1>
          <p className="text-gray-300">{room?.description}</p>
          <p className="text-gray-400">Class Code: {room?.classcode}</p>
        </div>

        <div className="bg-linear-to-r from-blue-900 to-sky-700 shadow-lg shadow-blue-300 p-6 rounded-xl">
          <h2 className="text-2xl font-mono mb-4">Quizzes</h2>

          {load ? (
            <p className="text-gray-400 animate-pulse">Loading quizzes...</p>
          ) : quizzes.length ? (
            <div className="space-y-4">
              {quizzes.map((quiz) => (
                <div key={quiz.id} className="bg-black p-4 rounded-lg flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium">{quiz.title}</h3>
                    <p className="text-sm text-gray-400">{quiz.description}</p>
                  </div>
                  <div>
                    {quiz.attempted ? (
                      <button className="px-4 py-2 rounded bg-gray-600 cursor-not-allowed">Quiz Taken</button>
                    ) : (
                      <button onClick={() => router.push(`/student/quiz/${quiz.id}?roomId=${id}`)} className="blue-button-with-hover px-4 py-2">
                        Take Quiz
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No quizzes in this class.</p>
          )}
        </div>
      </div>
    </Layout>
  );
}