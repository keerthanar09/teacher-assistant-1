import Layout from "@layouts/layout";
import useAuth from "@hooks/useAuth";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function TeacherDashboard() {
  const { user, loading } = useAuth("TEACHER");

  const [rooms, setRooms] = useState([]);
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState(10);
  const [classcode, setClasscode] = useState("");
  const [load, setLoad] = useState(true);
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  useEffect(() => {
    fetchClasses();
  }, []);

  async function fetchClasses() {
    setLoad(true);
    try {
      const res = await fetch(`${BASE_URL}/api/listrooms`, {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch rooms");
      const data = await res.json();
      setRooms(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching Rooms:", error);
    } finally {
      setLoad(false);
    }
  }
  const createClass = async () => {
    if (classcode.length > 20) {
      alert("Class Code must be under 20 characters.");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/createroom`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, capacity, classcode }),
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok) {
        setRooms((prev) => [...prev, data]);
        setName("");
        setClasscode("");
        router.reload();
      } else {
        alert(data.error || "Error creating class. Try again.");
      }
    } catch (error) {
      console.error("Error creating class:", error);
      alert("Failed to create class. Please try again.");
    }
  };

  const deleteClass = async (roomid) => {
    try {
      const res = await fetch(`${BASE_URL}/api/deleteroom/${roomid}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setRooms((prev) => prev.filter((room) => room.id != roomid));
      } else {
        const data = await res.json();
        alert(data.error || "Couldn't delete class");
      }
    } catch (e) {
      console.error("Error deleting class:", e);
      alert("Failed to delete class.");
    }
  };

  const openRoom = (room) => {
    router.push({
      pathname: `/teacher/room/${room.id}`,
      query: {
        name: room.name,
        classcode: room.classcode,
        capacity: room.capacity,
      },
    });
  };

  if (loading) return null;
  return (
    <Layout isAuth={true} role="TEACHER">
      <h1 className="text-center font-mono text-5xl text-bold">
        Teacher Dashboard
      </h1>
      <p className="text-center font-mono p-5 text-2xl">Welcome, {user.name}</p>
      <div className="space-x-6 pb-4">
        <div className="flex flex-col justify-center text-black">
          <div className="col-card">
            <p className="text-2xl font-mono">Create a Class</p>
            Enter Class Name:
            <input
              type="text"
              value={name}
              className="input-text"
              placeholder="Science Class"
              onChange={(e) => setName(e.target.value)}
              required
            />
            <p>
              Enter Class Code:
              <input
                type="text"
                value={classcode}
                className="input-text"
                placeholder="Code"
                required
                onChange={(e) => setClasscode(e.target.value)}
              />{" "}
              <br />
              Enter Capacity:
              <input
                type="number"
                value={capacity}
                className="input-text"
                placeholder="capacity"
                required
                onChange={(e) => setCapacity(e.target.value)}
              />
            </p>
            <button
              className="m-3 blue-button-with-hover"
              onClick={createClass}
            >
              Create
            </button>
            {load ? (
              <p className="text-gray-400 animate-pulse">Loading Rooms...</p>
            ) : (
              <>
                {rooms.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center mx-auto">
                    {rooms.map((cls) => (
                      <div
                        key={cls.id}
                        className="bg-gray-800 text-white p-4 rounded-lg shadow-lg cursor-pointer hover:bg-gray-700 transition-all transform hover:scale-105 animate-fade-in items-center"
                      >
                        <h2 className="text-lg font-semibold">{cls.name}</h2>
                        <p className="text-gray-400">
                          Class Code: {cls.classcode}
                        </p>
                        <button
                          className="black-border-button m-3 pl-3 pr-3"
                          onClick={() => openRoom(cls)}
                        >
                          Open
                        </button>
                        <button
                          className="black-border-button m-3"
                          onClick={() => deleteClass(cls.id)}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="bg-black shadow shadow-white w-auto text-gray-400">
                    No rooms found.
                  </p>
                )}{" "}
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

// import React, { useState, useEffect } from "react";
// import { getServerSession } from "next-auth/next";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/router";

// export default function TeacherDashboard() {

//   return (

//   );
// }
