import Layout from "@layouts/layout";
import useAuth from "@hooks/useAuth";
import React from "react";

export default function StudentDashboard() {

  const {user, loading} = useAuth("STUDENT");

  if (loading) return null;

  return (
    <Layout isAuth={true} role="STUDENT">
      <h1>Student Dashboard {user.name}</h1>
    </Layout>
  );
}



// import { useRouter } from 'next/router';
// import { useState, useEffect } from 'react';
// import { useSession } from "next-auth/react";
// import { getServerSession } from "next-auth/next";
// import {Layout} from '@layouts/layout';


// export default function StudentDashboard() {
//   const router = useRouter();
//   const [classCode, setClassCode] = useState("");
//   const [error, setError] = useState("");
//   const { data: session, status } = useSession();
//   const [message, setMessage] = useState();
//   const [auth, setAuth] = useState(false);

//   useEffect(()=> {
//     (
//       async () => {
//         try{const response = await fetch('http://127.0.0.1:8000/api/user', {
//           credentials:'include',
//         });
//         const content = await response.json();

//         setMessage(`hi, ${content.name}`)
//         setAuth(true);
//       } catch (err){
//         setMessage(`You are not logged in!`)
//         setAuth(false);
//       }
        
//       }
//     )
//   })



//   return (
//     <Layout auth={auth}>
//     <div className="min-h-screen bg-dark text-white p-10">
//       <h1 className="text-4xl font-bold mb-6 text-center">Student Dashboard</h1>


//         {/* Join Class Section */}
//         <div className="w-full bg-linear-to-r from-background to-sky-900 p-6 rounded-lg shadow-xl shadow-sky-800 text-center">
//           <h2 className="text-2xl mb-4">Join a Class</h2>
//           <input
//             type="text"
//             placeholder="Enter Class Code"
//             className="p-2 bg-blue-400 text-black rounded-lg w-full mb-4"
//             value={classCode}
//           />
//           {error && <p className="text-red-500">{error}</p>}
//           <button
//             className="px-6 py-3 bg-sky-500 rounded-lg hover:bg-sky-700 transition-all transform hover:scale-105"
//           >
//             Join Class
//           </button>
//         </div>
//       </div>
// </Layout>
//   );
// }
