"use client";
import { useState } from "react";
import { getServerSession } from "next-auth/next";


export default function CreateQuiz() {
  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], correctAnswer: "" },
  ]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);
  const [formId, setFormId] = useState("");

  // Function for the Add Question Button
  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], correctAnswer: "" },
    ]);
  };

  // Function for the Save quiz button. More changes needed, clicking this should 
  // cause the quiz to be saved in the database, and published for the students.
  const saveQuiz = async () => {
    const payload = {
      title, 
      description,
      subject,
      questions,
    };

    try {
      setLoading(true);
      const res = await fetch("/api/form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      const data = await res.json();
      if (res.ok) {
        setFormId(data.formId);
        alert("Quiz created and form published!");
        console.log(data);
      } else {
        alert("Something went wrong!");
        console.error(data);
      }
    } catch (err) {
      console.error(err);
      alert("Error creating quiz.");
    }
    finally{
    setLoading(false);
    }
    
  };


  //Following functions make it so that once a value is entered, the questions array is updated.
  const updateQuestion = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].question = value;
    setQuestions(newQuestions);
  };

  // const updateType = (index, value) => {
  //   const newQuestions = [...questions];
  //   newQuestions[index].type = value;
  //   newQuestions[index].options = ["", "", "", ""];
  //   setQuestions(newQuestions);
  // };

  const updateOption = (qIndex, optIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[optIndex] = value;
    setQuestions(newQuestions);
  };

  const updateCorrect = (index, value) => {
    const newQuestions =[...questions];
    newQuestions[index].correctAnswer = value;
    setQuestions(newQuestions);
  }



  return (
    <div className="create-quiz-box">
      <h1 className="text-3xl font-bold mb-4 text-white text-center">
        CREATE A TEST
      </h1>

      <input
        type="text"
        placeholder="Quiz Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border rounded-md mb-2"
      />
      <input
        type="text"
        placeholder="Quiz Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 border rounded-md mb-2"
      />
      <input
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="w-full p-2 border rounded-md mb-4"
      />

      {questions.map((q, qIndex) => (
        <div key={qIndex} className="mb-6 p-4 border rounded-lg">
          <input
            type="text"
            placeholder="Enter question"
            value={q.question}
            onChange={(e) => updateQuestion(qIndex, e.target.value)}
            className="w-full p-2 border rounded-md mb-2"
          />

          {/* <select
            value={q.type}
            onChange={(e) => updateType(qIndex, e.target.value)}
            className="p-2 border rounded-md mb-2 w-full text-black "
          >
            <option value="mcq">Multiple Choice</option>
            <option value="truefalse">True/False</option>
          </select> */}


            {q.options.map((opt, optIndex) => (
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
              value={q.correctAnswer}
              onChange={(e) => updateCorrect(qIndex, e.target.value)}
              className="w-full p-2 border rounded-md mt-2"
            />
          )}
        </div>
      ))}

      <button onClick={addQuestion} className="black-border-button">
        + Add Question
      </button>
      <button onClick={saveQuiz} className="ml-4 black-border-button">
        Save Quiz
      </button>

      <div className=" h-13 w-60 bg-blue-300 mt-5 rounded-2xl text-center content-center">
        <a
          href={`https://docs.google.com/forms/d/${formId}/viewform`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {loading?"":"Open Quiz Form"}
        </a>
      </div>
    </div>
  );
}
