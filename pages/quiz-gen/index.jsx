import React from 'react'

const QuizGen = () => {
  return (
    <div>
      <h2 className='text-center text-5xl'>Test Generator</h2>
      <p className="ml-10 mt-10">Enter the topic for the test: </p>
      <div className="ml-10 mt-2 flex flex-col">
        <div className="h-15 w-300 bg-blue-300 mb-5 text-black rounded-2xl">
          <input className = 'w-300 h-15' type='text' placeholder='Question'/>
        </div>
        <p>Result: </p>
        <div className="h-200 w-300 bg-blue-300 mt-5 rounded-2xl">02</div>
      </div>
    </div>

  )
}

export default QuizGen