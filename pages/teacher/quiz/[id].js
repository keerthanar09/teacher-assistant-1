// pages/teacher/quiz/[id].js

import Layout from "@layouts/layout";
import useAuth from "@hooks/useAuth";
import Modal from "@components/Modal";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function QuizPage() {
  const { user, loading } = useAuth("TEACHER");
  const router = useRouter();
  const { id, title, description, subject } = router.query;

  const [questions, setQuestions] = useState([]);
  const [load, setLoad] = useState(true);

  // Question Modal State
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [question, setQuestion] = useState("");
  const [questionType, setQuestionType] = useState("DESC");
  const [order, setOrder] = useState(1);
  const [marks, setMarks] = useState(1);
  const [createdQuestionId, setCreatedQuestionId] = useState(null);

  // Options Modal State
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [option, setOption] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [optionsList, setOptionsList] = useState([]);

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const quiz = {
    id,
    title,
    description,
    subject,
  };

  useEffect(() => {
    if (id) {
      fetchQuestions();
    }
  }, [id]);

  async function fetchQuestions() {
    setLoad(true);
    try {
      const res = await fetch(`${BASE_URL}/api/question/${id}`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        const sortedQuestions = data.sort((a, b) => a.order - b.order);
        setQuestions(sortedQuestions);
      }
    } catch (error) {
      console.error("Error fetching questions: ", error);
    } finally {
      setLoad(false);
    }
  }

  const createQuestion = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/api/question/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          questionType,
          order,
          marks,
        }),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        // Close question modal
        setShowQuestionModal(false);
        if (questionType === "MCQ" || questionType === "Multiple Choice") {
          setCreatedQuestionId(data.question_id); // Assuming backend returns question_id
          setShowOptionsModal(true);
          setOptionsList([]);
        } else {
          // For non-MCQ questions, just refresh the list
          fetchQuestions();
          resetQuestionForm();
        }
      } else {
        alert(data.error || "Error creating question");
      }
    } catch (e) {
      console.error("Error creating question:", e);
      alert("Failed to create question");
    }
  };

  const addOption = async (e) => {
    e.preventDefault();

    if (!option.trim()) {
      alert("Please enter an option");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/option/${createdQuestionId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          option,
          isCorrect,
        }),
        credentials: "include",
      });

      if (res.ok) {
        // Add to local list for display
        setOptionsList((prev) => [...prev, { option, isCorrect }]);

        // Reset option form
        setOption("");
        setIsCorrect(false);
      } else {
        const data = await res.json();
        alert(data.error || "Error adding option");
      }
    } catch (e) {
      console.error("Error adding option:", e);
      alert("Failed to add option");
    }
  };

  const finishAddingOptions = () => {
    setShowOptionsModal(false);
    setOptionsList([]);
    setCreatedQuestionId(null);
    resetQuestionForm();
    fetchQuestions();
  };

  const resetQuestionForm = () => {
    setQuestion("");
    setQuestionType("DESC");
    setOrder(questions.length + 1);
    setMarks(1);
  };

  const openQuestionModal = () => {
    setOrder(questions.length + 1);
    setShowQuestionModal(true);
  };

  const closeQuestionModal = () => {
    setShowQuestionModal(false);
    resetQuestionForm();
  };

  const deleteQuestion = (questionId) => {
    // Dummy function - not implemented yet
    alert("Delete functionality coming soon!");
  };

  const openQuizHistory = () => {
    router.push(`/teacher/quiz/${id}/attempts`);
  }

  if (loading || !router.isReady) return null;

  return (
    <Layout isAuth={true} role="TEACHER">
      <div className="max-w-6xl mx-auto p-6">
        <div className=" p-6 rounded-xl mb-6">
          <h1 className="text-center font-mono text-6xl font-bold mb-2">
            {quiz.title}
          </h1>
          <p className="text-center text-gray-300 text-lg">
            {quiz.description}
          </p>
          <p className="text-center text-gray-400">Subject: {quiz.subject}</p>
        </div>

        <div className="flex flex-row mb-6 justify-center">
          <button
            onClick={openQuestionModal}
            className=" blue-button-with-hover px-6 py-3 text-lg ml-5 mr-5"
          >
            + Create Question
          </button>
          <button
            onClick={openQuizHistory}
            className="flex items-center gap-2 blue-button-with-hover px-6 py-3 text-lg ml-5 mr-5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-card-checklist"
              viewBox="0 0 16 16"
            >
              <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2z" />
              <path d="M7 5.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m-1.496-.854a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0M7 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m-1.496-.854a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 0 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0" />
            </svg> <span>View Quiz Attempts</span>
          </button>
        </div>

        {/* Questions List */}
        <div className="bg-blue-900 p-10 rounded-xl ">
          <h2 className="text-3xl font-mono mb-6 text-center">Questions</h2>

          {load ? (
            <p className="text-gray-400 animate-pulse text-center">
              Loading questions...
            </p>
          ) : (
            <>
              {questions.length > 0 ? (
                <div className="space-y-8">
                  {questions.map((q, index) => (
                    <div key={index} className="bg-black p-5 rounded-lg ">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="bg-blue-600 px-3 py-1 rounded text-sm font-semibold">
                              Q{q.order}
                            </span>
                            <span className="bg-purple-600 px-3 py-1 rounded text-sm">
                              {q.questionType}
                            </span>
                            <span className="bg-green-600 px-3 py-1 rounded text-sm">
                              {q.marks} {q.marks === 1 ? "mark" : "marks"}
                            </span>
                          </div>
                          <p className="text-lg font-medium text-white mb-3">
                            {q.question}
                          </p>

                          {/* Display options if MCQ */}
                          {(q.questionType === "MCQ" ||
                            q.questionType === "Multiple Choice") &&
                            q.options && (
                              <div className="mt-4 space-y-2">
                                <p className="text-sm text-gray-400 mb-2">
                                  Options:
                                </p>
                                {q.options.map((opt, optIndex) => (
                                  <div
                                    key={optIndex}
                                    className={`flex items-center gap-2 p-3 rounded ${
                                      opt.isCorrect
                                        ? "bg-green-900 border-2 border-green-500"
                                        : "bg-gray-700"
                                    }`}
                                  >
                                    <span className="font-mono text-gray-300">
                                      {String.fromCharCode(65 + optIndex)}.
                                    </span>
                                    <span className="flex-1">{opt.option}</span>
                                    {opt.isCorrect && (
                                      <span className="bg-green-500 px-2 py-1 rounded text-xs font-semibold">
                                        ✓ Correct
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                        </div>

                        <button
                          onClick={() => deleteQuestion(q.id)}
                          className="ml-4 bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center bg-gray-800 p-6 rounded-lg">
                  No questions created yet. Click "Create Question" to add your
                  first question.
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Question Creation Modal */}
      <Modal
        isOpen={showQuestionModal}
        onClose={closeQuestionModal}
        title="Create Question"
        size="md"
      >
        <form onSubmit={createQuestion}>
          <div className="space-y-4">
            {/* Question Text */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Question Text *
              </label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="input-text w-full min-h-[100px]"
                placeholder="Enter your question here..."
                required
              />
            </div>

            {/* Question Type */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Question Type *
              </label>
              <select
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value)}
                className="input-text w-full"
                required
              >
                <option value="DESC">Descriptive</option>
                <option value="MCQ">Multiple Choice (MCQ)</option>
                <option value="Multiple Choice">Multiple Choice</option>
              </select>
            </div>

            {/* Order and Marks */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Order *
                </label>
                <input
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(parseInt(e.target.value))}
                  className="input-text w-full"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Marks *
                </label>
                <input
                  type="number"
                  value={marks}
                  onChange={(e) => setMarks(parseInt(e.target.value))}
                  className="input-text w-full"
                  min="1"
                  required
                />
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={closeQuestionModal}
              className="flex-1 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 blue-button-with-hover px-4 py-2"
            >
              Create Question
            </button>
          </div>
        </form>
      </Modal>

      {/* Options Creation Modal */}
      <Modal
        isOpen={showOptionsModal}
        onClose={() => {}}
        title="Add Options for MCQ"
        size="md"
      >
        <p className="text-gray-400 text-center mb-6">
          Add at least 2 options. Mark the correct answer(s).
        </p>

        {/* Display added options */}
        {optionsList.length > 0 && (
          <div className="mb-6 space-y-2">
            <p className="text-sm text-gray-400 mb-2">Added Options:</p>
            {optionsList.map((opt, index) => (
              <div
                key={index}
                className={`p-3 rounded flex items-center justify-between ${
                  opt.isCorrect ? "bg-green-900" : "bg-gray-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-gray-300">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <span>{opt.option}</span>
                </div>
                {opt.isCorrect && (
                  <span className="bg-green-500 px-2 py-1 rounded text-xs">
                    Correct
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        <form onSubmit={addOption}>
          <div className="space-y-4">
            {/* Option Text */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Option Text *
              </label>
              <input
                type="text"
                value={option}
                onChange={(e) => setOption(e.target.value)}
                className="input-text w-full"
                placeholder="Enter option text..."
                required
              />
            </div>

            {/* Is Correct Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isCorrect"
                checked={isCorrect}
                onChange={(e) => setIsCorrect(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="isCorrect" className="text-sm">
                This is the correct answer
              </label>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700 px-4 py-2 rounded transition-colors"
            >
              Add Option
            </button>
            <button
              type="button"
              onClick={finishAddingOptions}
              className="flex-1 blue-button-with-hover px-4 py-2"
              disabled={optionsList.length < 2}
            >
              {optionsList.length < 2
                ? `Add ${2 - optionsList.length} more option(s)`
                : "Finish & Save"}
            </button>
          </div>
        </form>

        {optionsList.length >= 2 && (
          <p className="text-sm text-gray-400 text-center mt-4">
            You can add more options or click "Finish & Save" to complete.
          </p>
        )}
      </Modal>
    </Layout>
  );
}
