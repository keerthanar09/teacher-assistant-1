import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@layouts/layout";


export default function AttemptDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [data, setData] = useState(null);
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (id) fetchDetail();
  }, [id]);

  async function fetchDetail() {
    const res = await fetch(`${BASE_URL}/api/teacher/attempt/${id}`, {
      credentials: "include",
    });
    const d = await res.json();
    setData(d);
  }

  async function evaluate(answerId, marks) {
    await fetch(`${BASE_URL}/api/teacher/evaluate/${answerId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ marks }),
    });

    fetchDetail(); // refresh
  }

  if (!data) return <p>Loading...</p>;

  return (
    <Layout isAuth={true} role="TEACHER">
    <div className="p-6">
      <h1 className="text-2xl font-bold">{data.student}</h1>
      <p className="mb-6">{data.grades} / {data.maxGrades}</p>

      {data.answers.map((q, i) => (
        <div key={i} className="mt-4 p-4 bg-gray-800 rounded">
          <p className="font-semibold">{q.question}</p>

          {/* MCQ */}
          {q.type === "MCQ" &&
            q.options.map((opt, idx) => (
              <div
                key={idx}
                className={`p-2 mt-2 rounded ${
                  opt.isCorrect
                    ? "bg-green-600"
                    : opt.isSelected
                    ? "bg-red-600"
                    : "bg-gray-700"
                }`}
              >
                {opt.option}
              </div>
            ))}

          {/* DESC */}
          {q.type === "DESC" && (
            <div className="mt-3">
              <p>Answer: {q.descAnswer}</p>

              {q.marksObtained === null ? (
                <div className="mt-2">
                  <input
                    type="number"
                    placeholder="Enter marks"
                    className="p-2 text-black"
                    onBlur={(e) =>
                      evaluate(q.answerId, e.target.value)
                    }
                  />
                </div>
              ) : (
                <p className="text-green-400">
                  Marks: {q.marksObtained}
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
    </Layout>
  );
}