import Layout from "@layouts/layout";
import useAuth from "@hooks/useAuth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function StudentQuizPage() {
  const { user, loading } = useAuth("STUDENT");
  const router = useRouter();
  const { id, roomId } = router.query;
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({}); // questionId -> answer (text or optionId)
  const [submitting, setSubmitting] = useState(false);
  const [load, setLoad] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchQuiz();
  }, [id]);

  async function fetchQuiz() {
    setLoad(true);
    try {
      const [qRes, qsRes] = await Promise.all([
        fetch(`${BASE_URL}/api/quiz/${id}/details`, { credentials: "include" }),
        fetch(`${BASE_URL}/api/quiz/${id}/questions`, { credentials: "include" }),
      ]);
      if (qRes.ok) setQuiz(await qRes.json());
      if (qsRes.ok) {
        const qs = await qsRes.json();
        setQuestions(qs);
        const initial = {};
        qs.forEach((q) => {
          initial[q.id] = q.questionType === "MCQ" ? null : "";
        });
        setAnswers(initial);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoad(false);
    }
  }

  function handleChange(qId, value) {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  }

  async function submitAttempt(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        answers: questions.map((q) => {
          const a = answers[q.id];
          return {
            question: q.id,
            answer: a === null ? "" : a,
          };
        }),
      };
      const res = await fetch(`${BASE_URL}/api/quiz/${id}/attempts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        router.push(`/student/room/${roomId}`);
      } else {
        alert(data.error || "Failed to submit attempt");
      }
    } catch (e) {
      console.error(e);
      alert("Failed to submit attempt");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading || !router.isReady) return null;

  return (
    <Layout isAuth={true} role="STUDENT">
      <div className="max-w-4xl mx-auto p-6">
        <div className="p-4 rounded-xl mb-6 bg-blue-900/20">
          <h1 className="text-3xl font-bold">{quiz?.title || "Quiz"}</h1>
          <p className="text-gray-400">{quiz?.description}</p>
        </div>

        {load ? (
          <p className="text-gray-400 animate-pulse">Loading questions...</p>
        ) : (
          <form onSubmit={submitAttempt} className="space-y-6">
            {questions.map((q, idx) => (
              <div key={q.id} className="bg-black p-4 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-sm text-gray-400">Q{q.order} · {q.marks} {q.marks === 1 ? "mark" : "marks"}</div>
                    <div className="text-lg font-medium mt-2">{q.question}</div>
                  </div>
                </div>

                {q.questionType === "MCQ" ? (
                  <div className="mt-4 space-y-2">
                    {q.options?.map((opt) => (
                      <label key={opt.id} className="flex items-center gap-3 p-2 rounded bg-gray-800">
                        <input
                          type="radio"
                          name={`q-${q.id}`}
                          checked={answers[q.id] === opt.id}
                          onChange={() => handleChange(q.id, opt.id)}
                        />
                        <span>{opt.option}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="mt-4">
                    <textarea
                      value={answers[q.id] || ""}
                      onChange={(e) => handleChange(q.id, e.target.value)}
                      className="input-text w-full min-h-[120px]"
                      placeholder="Type your answer..."
                      required
                    />
                  </div>
                )}
              </div>
            ))}

            <div className="flex gap-3">
              <button type="button" onClick={() => router.push(`/student/room/${roomId}`)} className="bg-gray-700 px-4 py-2 rounded">Cancel</button>
              <button type="submit" className="blue-button-with-hover px-4 py-2" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Quiz"}
              </button>
            </div>
          </form>
        )}
      </div>
    </Layout>
  );
}
