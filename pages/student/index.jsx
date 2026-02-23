import Layout from "@layouts/layout";
import useAuth from "@hooks/useAuth";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function StudentDashboard() {
  const { user, loading } = useAuth("STUDENT");
  const router = useRouter();
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const [code, setCode] = useState("");
  const [joining, setJoining] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [load, setLoad] = useState(true);

  useEffect(() => {
    if (!loading) fetchRooms();
  }, [loading]);

  async function fetchRooms() {
    setLoad(true);
    try {
      const res = await fetch(`${BASE_URL}/api/student/rooms`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setRooms(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoad(false);
    }
  }

  async function joinRoom(e) {
    e && e.preventDefault();
    if (!code.trim()) return;
    setJoining(true);
    try {
      const res = await fetch(`${BASE_URL}/api/room/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setRooms((prev) => {
          if (prev.find((r) => r.id === data.id)) return prev;
          return [data, ...prev];
        });
        setCode("");
      } else {
        alert(data.error || "Room not found");
      }
    } catch (e) {
      console.error(e);
      alert("Failed to join room");
    } finally {
      setJoining(false);
    }
  }

  if (loading) return null;

  return (
    <Layout isAuth={true} role="STUDENT">
      <h1 className="text-center font-mono text-5xl text-bold">
        Student Dashboard
      </h1>
      <div className="max-w-6xl mx-auto p-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 10% 10%, rgba(255,255,255,0.06) 0 2px, transparent 2px), radial-gradient(circle at 80% 40%, rgba(59,130,246,0.04) 0 2px, transparent 2px)" }} />
        <div className="mb-6">
          <h1 className="text-center font-mono p-5 text-2xl">Welcome, {user?.name || "Student"}</h1>
          <p className="text-center text-gray-300">Join classes using a class code and take quizzes.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="col-span-1 md:col-span-1 bg-linear-to-r from-sky-400 to-sky-600 p-6 rounded-xl shadow-xl shadow-blue-900">
            <h2 className="text-2xl font-semibold mb-4">Join a Class</h2>
            <form onSubmit={joinRoom} className="space-y-4">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter class code"
                className="input-text w-full"
              />
              <div className="flex gap-3">
                <button type="submit" className="blue-button-with-hover flex-1 py-2" disabled={joining}>
                  {joining ? "Joining..." : "Join"}
                </button>
              </div>
            </form>
          </div>

          <div className="md:col-span-2 bg-linear-to-r from-sky-400 to-sky-600 p-6 rounded-xl shadow-xl shadow-blue-900">
            <h2 className="text-2xl font-semibold mb-4">Joined Classes</h2>
            {load ? (
              <p className="text-gray-400 animate-pulse">Loading classes...</p>
            ) : rooms.length ? (
              <div className="space-y-4">
                {rooms.map((room) => (
                  <div key={room.id} className="bg-black p-4 rounded-lg flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium">{room.title}</h3>
                      <p className="text-sm text-gray-400">{room.description}</p>
                      <p className="text-xs text-gray-500">Class code: {room.classcode}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => router.push(`/student/room/${room.id}`)} className="blue-button-with-hover px-4 py-2">
                        Open
                      </button>
                      <button className="bg-red-600 px-4 py-2 rounded opacity-50 cursor-not-allowed" title="Leave not implemented">
                        Leave
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No classes joined yet.</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
