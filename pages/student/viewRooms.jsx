import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next";

const prisma = new PrismaClient();

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
    
      if (!session || session.user.role !== "STUDENT") {
        return { redirect: { destination: "/", permanent: false } };
      }

      const rooms = await prisma.room.findMany({
        where: {
          students: {
            some: {
              id: session.user.dbId,
            },
          },
        },
        select: {
          id: true,
          name: true,
          classCode: true,
        },
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
            onClick={() => router.push(`/student/room/${room.id}`)}
          >
            <h2 className="text-2xl mb-2">{room.name}</h2>
            <p className="text-lg">Class Code: {room.classCode}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
