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
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-filetype-csv" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M14 4.5V14a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zM3.517 14.841a1.13 1.13 0 0 0 .401.823q.195.162.478.252.284.091.665.091.507 0 .859-.158.354-.158.539-.44.187-.284.187-.656 0-.336-.134-.56a1 1 0 0 0-.375-.357 2 2 0 0 0-.566-.21l-.621-.144a1 1 0 0 1-.404-.176.37.37 0 0 1-.144-.299q0-.234.185-.384.188-.152.512-.152.214 0 .37.068a.6.6 0 0 1 .246.181.56.56 0 0 1 .12.258h.75a1.1 1.1 0 0 0-.2-.566 1.2 1.2 0 0 0-.5-.41 1.8 1.8 0 0 0-.78-.152q-.439 0-.776.15-.337.149-.527.421-.19.273-.19.639 0 .302.122.524.124.223.352.367.228.143.539.213l.618.144q.31.073.463.193a.39.39 0 0 1 .152.326.5.5 0 0 1-.085.29.56.56 0 0 1-.255.193q-.167.07-.413.07-.175 0-.32-.04a.8.8 0 0 1-.248-.115.58.58 0 0 1-.255-.384zM.806 13.693q0-.373.102-.633a.87.87 0 0 1 .302-.399.8.8 0 0 1 .475-.137q.225 0 .398.097a.7.7 0 0 1 .272.26.85.85 0 0 1 .12.381h.765v-.072a1.33 1.33 0 0 0-.466-.964 1.4 1.4 0 0 0-.489-.272 1.8 1.8 0 0 0-.606-.097q-.534 0-.911.223-.375.222-.572.632-.195.41-.196.979v.498q0 .568.193.976.197.407.572.626.375.217.914.217.439 0 .785-.164t.55-.454a1.27 1.27 0 0 0 .226-.674v-.076h-.764a.8.8 0 0 1-.118.363.7.7 0 0 1-.272.25.9.9 0 0 1-.401.087.85.85 0 0 1-.478-.132.83.83 0 0 1-.299-.392 1.7 1.7 0 0 1-.102-.627zm8.239 2.238h-.953l-1.338-3.999h.917l.896 3.138h.038l.888-3.138h.879z"/>
</svg>
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
