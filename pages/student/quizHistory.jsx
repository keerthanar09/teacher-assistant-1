import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
    
  if (!session || session.user.role !== "STUDENT") {
    return { redirect: { destination: "/", permanent: false } };
  }

  const quizHistoryRaw = await prisma.quizTaken.findMany({
    where: { userId: session.user.dbId },
    include: { quiz: { select: { title: true } } },
  });

    // Convert Decimal grades to Number since decimal cannot be serialized by JSON.
    const quizHistory = quizHistoryRaw.map((quiz) => ({
    ...quiz,
    grades: quiz.grades.toNumber(),  
  }));

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
