import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getServerSideProps(context) {
  const session = await getSession(context);
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
            className="bg-blueShade p-6 rounded-lg shadow-lg text-center cursor-pointer hover:bg-blue-700"
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
