import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@layouts/layout";

export default function AttemptsPage() {
  const router = useRouter();
  const { id } = router.query;

  const [attempts, setAttempts] = useState([]);
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (id) fetchAttempts();
  }, [id]);

  async function fetchAttempts() {
    const res = await fetch(`${BASE_URL}/api/teacher/quiz/${id}/attempts`, {
      credentials: "include",
    });
    const data = await res.json();
    setAttempts(data);
  }
  const exportCSV = () => {
    window.open(`${BASE_URL}/api/teacher/quiz/${id}/export`, "_blank");
  };

  return (
    <Layout isAuth={true} role="TEACHER">
      <div className="p-6">
        <h1 className="text-5xl mb-6 text-center font-mono font-bold">
          Quiz Attempts
        </h1>
        <button
          onClick={exportCSV}
          className="mb-4 bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
        >
          Export as CSV
        </button>

        {attempts.map((a) => (
          <div
            key={a.id}
            className="p-4 bg-sky-900 mb-3 rounded cursor-pointer hover:bg-gray-700 w-200 mx-auto"
            onClick={() => router.push(`/teacher/attempt/${a.id}`)}
          >
            <div className="flex flex-row justify-around">
              <div className="flex flex-col">
                <p className="font-bold">Student Name: {a.student}</p>
                <p
                  className={
                    a.status === "Evaluated"
                      ? "text-green-400"
                      : "text-yellow-400"
                  }
                >
                  {a.status}
                </p>
              </div>
              <div className="flex flex-col ml-50">
                <p>
                  Grades: {a.grades} / {a.maxGrades}
                </p>
                <p>Taken At: {new Date(a.takenAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
