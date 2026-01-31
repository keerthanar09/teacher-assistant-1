import Layout from "@layouts/layout";
import useAuth from "@hooks/useAuth";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function RoomPage() {
  const { user, loading } = useAuth("TEACHER");
  const router = useRouter();
  const { id, name, classcode, capacity } = router.query;
  const [quizzes, setQuizzes] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [load, setLoad] = useState(true);

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const room = {
    id,
    name,
    classcode,
    capacity: parseInt(capacity),
  };

  useEffect(() => {
    if (id) {
      fetchQuizzes();
    }
  }, [id]);

  async function fetchQuizzes() {
    setLoad(true);
    try {
      const res = await fetch(`${BASE_URL}/api/quiz/${id}`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setQuizzes(data);
      }
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    } finally {
      setLoad(false);
    }
  }

  const createQuiz = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/quiz/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, subject }),
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setQuizzes((prev) => [...prev, data]);
        setTitle("");
        setDescription("");
        setSubject("");
        router.reload();
      } else {
        alert(data.error || "Error creating a quiz. try again");
      }
    } catch (e) {
      alert("Failed to create a quiz");
    }
  };

  const deleteQuiz = async (quizid) => {
    try{
      const res = await fetch(`${BASE_URL}/api/quizupdates/${quizid}`, {
        method: "DELETE",
        credentials: "include",
      });
      if(res.ok) {
        setQuizzes((prev) => prev.filter((quiz) => quiz.id != quizid));
      } else {
        const data = await res.json();
        alert(data.error || "Couldn't delete quiz");
      }
    } catch (e) {
      console.error("Error deleting quiz:", e);
      alert("Failed to delete quiz.");
    }
  };

  const openQuiz = (quiz) => {
    router.push({
      pathname:`/teacher/quiz/${quiz.id}`,
      query: {
        title:quiz.title,
        description:quiz.description,
        subject:quiz.subject,
      },
    });
  }

  if (loading || !router.isReady) return null;

  return (
    <Layout isAuth={true} role="TEACHER">
      <h1 className="text-center font-mono text-4xl font-bold">{room.name}</h1>
      <p className="text-center font-mono text-xl">
        Class Code: {room.classcode}
      </p>
      <p className="text-center font-mono">Capacity: {room.capacity}</p>
      <div className="space-x-6 pb-4">
        <div className="flex flex-col justify-center text-black">
          <div className="col-card">
            <p className="text-2xl font-mono">Create a Quiz</p>
            Enter Quiz Title
            <input
              type="text"
              value={title}
              className="input-text"
              placeholder="Title"
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <p>
              Enter Description:
              <input
                type="text"
                value={description}
                className="input-text"
                placeholder="description"
                required
                onChange={(e) => setDescription(e.target.value)}
              />{" "}
              <br />
              Enter Subject:
              <input
                type="text"
                value={subject}
                className="input-text"
                placeholder="subject"
                required
                onChange={(e) => setSubject(e.target.value)}
              />
            </p>
            <button className="m-3 blue-button-with-hover" onClick={createQuiz}>
              Create Quiz
            </button>{" "}
          </div>
        </div>{" "}
      </div>
      <div className="mt-8 bg-blue-900 m-10 p-5 w-auto h-auto rounded-xl">
        <div className="sticky top-0 mt-8 bg-blue-900 m-5">
          <h2 className="text-4xl font-mono mb-4 text-center">Quizzes</h2>
        </div>
        {load ? (
          <p className="text-gray-400 animate-pulse">Loading quizzes...</p>
        ) : (
          <>
            {quizzes.length > 0 ? (
              <div className="flex flex-col gap-3">
                {quizzes.map((q) => (
                  <div
                    key={q.id}
                    className="bg-gray-800 text-white p-4 rounded-lg shadow-lg cursor-pointer hover:bg-gray-700 transition-all flex items-center justify-between"
                    onClick={() => openQuiz(q)}
                  >
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold">{q.title}</h2>
                      <p className="text-gray-400 text-sm">{q.description}</p>
                      <p className="text-gray-400 text-sm">
                        Subject: {q.subject}
                      </p>
                    </div>
                    <button
                      className="black-border-button ml-4 px-4 py-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteQuiz(q.id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="bg-black shadow shadow-white w-auto text-gray-400">
                No quizzes found.
              </p>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
