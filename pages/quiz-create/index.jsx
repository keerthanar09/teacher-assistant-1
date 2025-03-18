"use client";
import { useState } from "react";

export default function CreateQuiz() {
  const [questions, setQuestions] = useState([
    { question: "", type: "mcq", options: ["", "", "", ""], correct: "" },
  ]);

  // Function for the Add Question Button
  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", type: "mcq", options: ["", "", "", ""], correct: "" },
    ]);
  };

  // Function for the Save quiz button. More changes needed, clicking this should 
  // cause the quiz to be saved in the database, and published for the students.
  const saveQuiz = () => {
    console.log("Quiz Data:", questions);
    alert("Quiz saved!");
  };


  //Following functions make it so that once a value is entered, the questions array is updated.
  const updateQuestion = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].question = value;
    setQuestions(newQuestions);
  };

  const updateType = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].type = value;
    newQuestions[index].options = ["", "", "", ""];
    setQuestions(newQuestions);
  };

  const updateOption = (qIndex, optIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[optIndex] = value;
    setQuestions(newQuestions);
  };

  const updateCorrect = (index, value) => {
    const newQuestions =[...questions];
    newQuestions[index].correct = value;
    setQuestions(newQuestions);
  }



  return (
    <div className="create-quiz-box">
      <h1 className="text-3xl font-bold mb-4 text-white text-center">CREATE A TEST</h1>

      {questions.map((q, qIndex) => (
        <div key={qIndex} className="mb-6 p-4 border rounded-lg">
          <input
            type="text"
            placeholder="Enter question"
            value={q.question}
            onChange={(e) => updateQuestion(qIndex, e.target.value)}
            className="w-full p-2 border rounded-md mb-2"
          />

          <select
            value={q.type}
            onChange={(e) => updateType(qIndex, e.target.value)}
            className="p-2 border rounded-md mb-2 w-full text-black "
          >
            <option value="mcq">Multiple Choice</option>
            <option value="truefalse">True/False</option>
          </select>

          {q.type === "mcq" &&
            q.options.map((opt, optIndex) => (
              <input
                key={optIndex}
                type="text"
                placeholder={`Option ${optIndex + 1}`}
                value={opt}
                onChange={(e) => updateOption(qIndex, optIndex, e.target.value)}
                className="w-full p-2 border rounded-md mb-1"
              />
            ))}

          {q.type !== "short" && (
            <input
              type="text"
              placeholder="Correct answer"
              value={q.correct}
              onChange={(e) => updateCorrect(qIndex, e.target.value)}
              className="w-full p-2 border rounded-md mt-2"
            />
          )}
        </div>
      ))}

      <button
        onClick={addQuestion}
        className="black-border-button"
      >
        + Add Question
      </button>
      <button
        onClick={saveQuiz}
        className="ml-4 black-border-button"
      >
        Save Quiz
      </button>
    </div>
  );
}
