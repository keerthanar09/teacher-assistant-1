import { getSession } from "next-auth/react";
import prisma from "../../lib/prisma";

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session || session.user.role !== "STUDENT") {
    return { redirect: { destination: "/", permanent: false } };
  }

  const quizHistory = await prisma.quizTaken.findMany({
    where: { userId: session.user.dbId },
    include: { quiz: { select: { title: true } } },
  });

  return { props: { quizHistory } };
}

export default function QuizHistory({ quizHistory }) {
  return (
    <div className="min-h-screen bg-dark text-white p-10">
      <h1 className="text-4xl font-bold mb-6 text-center">Your Quiz History</h1>
      <table className="w-full bg-gray-800 text-white rounded-lg shadow-lg">
        <thead>
          <tr>
            <th className="p-4">Quiz</th>
            <th className="p-4">Grade</th>
          </tr>
        </thead>
        <tbody>
          {quizHistory.map((quiz) => (
            <tr key={quiz.id} className="border-b border-gray-700">
              <td className="p-4">{quiz.quiz.title}</td>
              <td className="p-4">{quiz.grades}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
