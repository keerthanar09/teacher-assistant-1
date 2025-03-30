import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session || session.user.role !== "TEACHER") {
    return { redirect: { destination: "/", permanent: false } };
  }

  return { props: { session } };
}

const Home = () => {
  return (
    <div className="space-x-6 pb-4">
      <div className="flex flex-wrap justify-evenly">
        <div className="card">
          <p>Generate a Test with Artificial Intelligence Now!</p>
          <a href="/teacher/quiz-generation">
            <button className="blue-button-with-hover rounded-lg px-4 py-2">Click Here</button>
          </a>
        </div>
        <div className="card">
          <p>Create your own Test!</p>
          <a href="/teacher/quiz-create">
            <button className="blue-button-with-hover px-4 py-2">Click Here</button>
          </a>
        </div>
        <div className="card">
          <p>View Your Student's Details</p>
          <a href="/teacher/student-details">
            <button className="blue-button-with-hover px-4 py-2">Click Here</button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;
