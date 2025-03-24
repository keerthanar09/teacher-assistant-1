import React from 'react';
import Link from 'next/link';



const Home = () => {
  return (
    <div className="space-x-6  pb-4 ">
      <div className="flex flex-wrap justify-evenly  ">
        <div className="card">
          Generate a Test with Artificial Intelligence Now!<br/>
          <a href = "/teacher/quiz-generation">
          <button className="blue-button-with-hover rounded-lg">
            Click Here
          </button>
          </a>
        </div>
        <div className="card">
          Create your own Test!<br/>
          <a href = "/teacher/quiz-create">
          <button className="blue-button-with-hover">Click Here</button>
          </a>
        </div>

        <div className="card">
          View Your student's details<br/>
          <a href = "/teacher/student-details">
          <button className="blue-button-with-hover">Click Here</button>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Home


