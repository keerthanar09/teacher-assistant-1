import { useRouter } from 'next/router';
import { getServerSession } from "next-auth/next";
import { useEffect, useState } from "react";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getServerSideProps(context) {
   const session = await getServerSession(context.req, context.res, authOptions);
  
    if (!session || session.user.role !== "TEACHER") {
      return { redirect: { destination: "/", permanent: false } };
    }

  const { id } = context.params;
  const room = await prisma.room.findUnique({
    where: { id: parseInt(id) },
    include: { students: true }
  });

  const quizzes = await prisma.quiz.findMany({
    where: { createdById: session.user.id }
  });

  // Convert createdAt field to a string
  const serializedQuizzes = quizzes.map(quiz => ({
    ...quiz,
    createdAt: quiz.createdAt.toISOString(),
  }));

  return { props: { session, room, quizzes: serializedQuizzes } };
}

export default function RoomDetails({ room, quizzes }) {
  const router = useRouter();
  const [selectedQuiz, setSelectedQuiz] = useState("");

  const postQuiz = async () => {
    if (!selectedQuiz) return;
    await fetch("/api/quizzes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ formId: selectedQuiz, classId: room.id })
    });
    alert("Quiz posted successfully!");
  };

  return (
    <div className="min-h-screen bg-dark text-white p-10">
      <h1 className="text-4xl font-bold mb-6 text-center animate-fade-in">{room.name}</h1>
      <h2 className="text-2xl mb-4">Students in this room:</h2>
      <ul>
        {room.students.map(student => (
          <li key={student.id}>{student.username} ({student.email})</li>
        ))}
      </ul>
      <h2 className="text-2xl mt-6 mb-4">Post a Quiz</h2>
      <select
        className="p-2 rounded bg-gray-800 text-white"
        value={selectedQuiz}
        onChange={(e) => setSelectedQuiz(e.target.value)}
      >
        <option value="">Select a Quiz</option>
        {quizzes.map(quiz => (
          <option key={quiz.formId} value={quiz.formId}>{quiz.title}</option>
        ))}
      </select>
      <button
        className="ml-4 px-6 py-3 bg-blue-500 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105"
        onClick={postQuiz}
      >
        Post Quiz
      </button>
    </div>
  );
}
