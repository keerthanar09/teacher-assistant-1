import { useState, useEffect } from "react";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import prisma from "../../lib/prisma";

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session || session.user.role !== "TEACHER") {
    return { redirect: { destination: "/", permanent: false } };
  }
  try {
    const quizzes = await prisma.quiz.findMany({
      where: { createdById: session.user.id },
      select: { formId: true, title: true },
    });

    const submissions = await prisma.quizTaken.findMany({
      include: {
        user: { select: { username: true } },
        quiz: { select: { title: true } },
      },
    });

    // Convert Decimal grades to Number since decimal cannot be serialized by JSON.
    const serializedSubmissions = submissions.map((submission) => ({
      ...submission,
      grades: submission.grades?.toNumber?.() || 0,
    }));

    return {
      props: {
        initialSubmissions: serializedSubmissions,
        initialQuizzes: quizzes || [],
      },
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    return {
      props: {
        initialSubmissions: [],
        initialQuizzes: [],
      },
    };
  }
}


export default function Submissions({ initialSubmissions, initialQuizzes }) {
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [quizzes, setQuizzes] = useState(initialQuizzes || []);
  const [selectedFormId, setSelectedFormId] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch updated submissions from the database
  async function fetchUpdatedSubmissions() {
    try {
      const res = await fetch("/api/get-submissions");
      const data = await res.json();
      setSubmissions(data);
    } catch (error) {
      console.error("Error fetching updated submissions:", error);
    }
  }

  async function fetchQuizResults() {
    if (!selectedFormId) {
      alert("Please select a quiz first!");
      return;
    }

    setLoading(true);
    try {
      console.log("Sending request to /api/evaluation with formId:", selectedFormId);

      const res = await fetch("/api/evaluation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formId: selectedFormId }),
      });

      const data = await res.json();
      console.log("Response from /api/evaluation:", data);
      alert(data.message || "Results updated!");

      await fetchUpdatedSubmissions();
    } catch (error) {
      console.error("Error fetching quiz results:", error);
      alert("Failed to fetch quiz results.");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-dark text-white p-10">
      <h1 className="text-4xl font-bold mb-6 text-center">Quiz Submissions</h1>

      {/* Dropdown to select a quiz */}
      <select
        value={selectedFormId}
        onChange={(e) => setSelectedFormId(e.target.value)}
        className="mb-4 px-4 py-2 bg-gray-700 text-white rounded"
      >
        <option value="">Select a Quiz</option>
        {quizzes.map((quiz) => (
          <option key={quiz.formId} value={quiz.formId}>
            {quiz.title}
          </option>
        ))}
      </select>

      <button
        onClick={fetchQuizResults}
        className="ml-4 px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded"
        disabled={loading}
      >
        {loading ? "Fetching..." : "Fetch Quiz Results"}
      </button>

      <table className="w-full bg-gray-800 text-white rounded-lg shadow-lg mt-6">
        <thead>
          <tr>
            <th className="p-4">Student</th>
            <th className="p-4">Quiz</th>
            <th className="p-4">Grade</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission) => (
            <tr key={submission.id} className="border-b border-gray-700">
              <td className="p-4">{submission.user.username}</td>
              <td className="p-4">{submission.quiz.title}</td>
              <td className="p-4">{submission.grades}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
