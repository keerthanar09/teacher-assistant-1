
import React from 'react'
import { useState } from 'react';


function parseQuizResponse(text) {
  const questions = text.trim().split(/Q:/).slice(1);
  return questions.map((qBlock) => {
    const lines = qBlock.trim().split("\n");
    const question = lines[0].trim();
    const options = lines.slice(1,5).map((line) => line.trim().slice(3));
    const answerLine = lines.find((line) => line.startsWith("Answer:"));
    const correctAnswer = answerLine ? answerLine.split("Answer:")[1].trim() : null;

      return {
        question,
        options,
        correctAnswer,
      };
  });
}

const QuizGen = () => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [quiz, setQuiz] = useState([]);
  const [formId, setFormId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    try{
    const res = await fetch("/api/gemini/route", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: input }),
    });

    const data = await res.json();
    const parsedQuiz = parseQuizResponse(data.text);
    console.log("Parsed quiz:", parsedQuiz);
    setQuiz(parsedQuiz);



    const res1 = await fetch("/api/form", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        formTitle: " Quiz",
        questions: parsedQuiz,
      }),
    });
    const data1 = await res1.json();
        if (res1.ok) {
          setFormId(data1.formId);
          setResponse(`Form created! Form ID: ${data1.formId}`);
        } else {
          setResponse(`Error: ${data1.error}`);
        }
    }
    catch(error){
      console.error(error);
      setResponse("An unexpected Error occurred!!!");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="create-quiz-box p-10">
      <h2 className="text-center text-5xl">Test Generator</h2>
      <p className=" ml-5 mt-10 ">Enter the topic for the test: </p>
      <div className=" h-15 w-full bg-blue-300 m-5 text-black ">
        <input
          value={input}
          className="w-full h-15 border p-7 w-full text-black"
          type="text"
          row={4}
          placeholder="12 Questions on Linear Algebra..."
          onChange={(e) => setInput(e.target.value)}
          rows={4}
        />
      </div>
      <div className="flex justify-center">
        <button onClick={handleSubmit} className="m-5 blue-button-with-hover ">
          {loading ? "Creating Quiz...":"Enter"}
        </button>
      </div>
      <div className='flex justify-center'>
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
      
    </div>
  );
}

export default QuizGen