import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]"; // make sure you import authOptions
import { PrismaClient } from '@prisma/client';
import { useRouter } from "next/router";

const prisma = new PrismaClient();

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session || session.user.role !== "TEACHER") {
    return { redirect: { destination: "/", permanent: false } };
  }

  const rooms = await prisma.room.findMany({
    where: { createdById: session.user.id },
    select: { id: true, name: true, classCode: true },
  });

  return { props: { rooms } };
}

export default function TeacherRooms({ rooms }) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-dark text-white p-10">
      <h1 className="text-4xl font-bold mb-6 text-center">Your Rooms</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="room-card"
            onClick={() => router.push(`/teacher/room/${room.id}`)}
          >
            <h2 className="text-2xl mb-2">{room.name}</h2>
            <p className="text-lg">Class Code: {room.classCode}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
