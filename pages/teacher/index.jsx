import React, { useState, useEffect } from "react";
import { getServerSession } from "next-auth/next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";


export default function TeacherDashboard() {
  const router = useRouter();
  const [classes, setClasses] = useState([]);
  const [name, setName] = useState("");
  const [classCode, setClassCode] = useState("");
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();

  // useEffect(() => {
  //   if (status === "unauthenticated") {
  //     router.push("/login");
  //     return;
  //   }

    async function fetchClasses() {
      // if (!session?.user?.dbId) return;
      try {
        const res = await fetch(`/api/classes?teacherId=${session.user.dbId}`);
        if (!res.ok) throw new Error("Failed to fetch classes");
        const data = await res.json();
        setClasses(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching classes:", error);
      } finally {
        setLoading(false);
      }
    }

  //   if (status === "authenticated" && session?.user?.dbId) fetchClasses();
  // }, [status, session]);



  const createClass = async () => {

    const teacherId = session.user.dbId;
    console.log("teacher id: ", teacherId);
    if (!session) {
      alert("User not authenticated. Please log in again.");
      return;
    }

    if (classCode.length !== 6) {
      alert("Class Code must be 6 characters long.");
      return;
    }

    try {
      const res = await fetch("/api/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, classCode, teacherId }),
      });

      const data = await res.json();
      if (res.ok) {
        setClasses((prev) => [...prev, data]);
        setName("");
        setClassCode("");
      } else {
        alert(data.error || "Error creating class. Try again.");
      }
    } catch (error) {
      console.error("Error creating class:", error);
      alert("Failed to create class. Please try again.");
    }
  };

  return (
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
          />
          <p>
            Enter Class Code:
            <input
              type="text"
              value={classCode}
              className="input-text"
              placeholder="Code"
              onChange={(e) => setClassCode(e.target.value)}
            />
          </p>
          <button className="m-3 blue-button-with-hover" onClick={createClass}>
            Create
          </button>
          {loading ? (
            <p className="text-gray-400 animate-pulse">Loading classes...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* {classes.length > 0 ? (
                classes.map((cls) => (
                  <div
                    key={cls.id}
                    className="bg-gray-800 text-white p-4 rounded-lg shadow-lg cursor-pointer hover:bg-gray-700 transition-all transform hover:scale-105 animate-fade-in"
                  >
                    <h2 className="text-lg font-semibold">{cls.name}</h2>
                    <p className="text-gray-400">Class Code: {cls.classCode}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No classes found.</p>
              )} */}
            </div>
          )}
          <p>
            <button className="blue-button-with-hover" onClick={() => router.push('/teacher/view-room')}>
              View Your Classes
            </button>
          </p>
        </div>
        {/* <div className="flex flex-wrap justify-center">
          <div className="card">
            The quiz results are here!
            <button className="blue-button-with-hover">View Quiz</button>
          </div>
          <div className="card">02</div>
          <div className="card">02</div>
        </div>
        <div className="col-card">01</div> */}
      </div>
    </div>
  );
}
