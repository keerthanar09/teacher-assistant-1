import React from 'react';
import Link from 'next/link';



const Home = () => {
  return (
    <div className="space-x-6 pt-4 pb-4 m-5 rounded-lg font-mono">
      <p className="text-5xl text-center text-white">Teacher's Assistant</p>
      <div className="flex flex-wrap justify-evenly  ">
        <div className="card">
          Generate a Test with Artificial Intelligence Now!<br/>
          <a href = "/quiz-generation">
          <button className="blue-button-with-hover rounded-lg">
            Click Here
          </button>
          </a>
        </div>
        <div className="card">
          Create your own Test!<br/>
          <a href = "/quiz-create">
          <button className="blue-button-with-hover">Click Here</button>
          </a>
        </div>

        <div className="card">
          View Your student's details<br/>
          <a href = "/student-details">
          <button className="blue-button-with-hover">Click Here</button>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Home


