import { useRouter } from 'next/router';
import { getServerSession } from "next-auth/next";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
    
      if (!session || session.user.role !== "STUDENT") {
        return { redirect: { destination: "/", permanent: false } };
      }

  const { id } = context.params;
  const room = await prisma.room.findUnique({
    where: { id: parseInt(id) },
    include: { students: true }
  });

  const quizzes = await prisma.quiz.findMany({
    where: { roomId: room.id },
  });

  const serializedQuizzes = quizzes.map(quiz => ({
    ...quiz,
    createdAt: quiz.createdAt.toISOString(),
  }));

  return { props: { session, room, quizzes: serializedQuizzes } };
}

export default function RoomDetails({ room, quizzes }) {
  return (
    <div className="min-h-screen bg-dark text-white p-10">
      <h1 className="text-4xl font-bold mb-6 text-center animate-fade-in">{room.name}</h1>
      <h2 className="text-2xl mb-4">Students in this room:</h2>
      <ul>
        {room.students.map(student => (
          <li key={student.id}>{student.username} ({student.email})</li>
        ))}
      </ul>
      <h2 className="text-2xl mt-6 mb-4">Available Quizzes</h2>
      <ul>
        {quizzes.length > 0 ? (
          quizzes.map(quiz => (
            <li key={quiz.formId} className="mb-2">
              <span className="font-bold">{quiz.title}</span> - {new Date(quiz.createdAt).toLocaleDateString("en-GB")}
              <a href={`https://docs.google.com/forms/d/${quiz.formId}/viewform`}>
              <button
                className="ml-4 px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105"
              >
                Take Quiz 

              </button> </a>
            </li>
          ))
        ) : (
          <p>No quizzes available yet.</p>
        )}
      </ul>
    </div>
  );
}
