//Navigation bar that appears for all teacher's pages

"use client";

import React from "react";
import { X } from "lucide-react"; //Go to the lucide-react icons page to view all the icons, it's a better option than bootstrap for next.js applications.
import Image from "next/image";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";

const TeacherNav = () => {
  const router = useRouter();
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const logout = async () => {
    await fetch(`${BASE_URL}/api/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    await router.push("/login");
  };

  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="flex flex-between justify-between mb-10 pt-3 ml-4 mt-3">
      <div>
        <button
          onClick={() => setIsOpen(true)}
          className=" p-2 text-white fixed top-4 left-4 z-50"
        >
          <Image
            src="/assets/icons/logo-black.jpg"
            alt="Teacher Assistant"
            width={30}
            height={30}
            className="object-contain"
          />
        </button>
        <span className="text-logo ml-10 p-5">LearnCom</span>

        {/*Translucent Overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-main opacity-75  mt-15"
            onClick={() => setIsOpen(false)}
          />
        )}

        <div
          className={`mt-15 fixed top-0 left-0 h-full w-71 bg-black shadow-xl z-50 transform transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center p-4 border-b bg-linear-65 from-sky-500 to-blue-600 ">
            <h2 className="text-xl font-bold">Menu</h2>
            <button onClick={() => setIsOpen(false)}>
              <X size={28} />
            </button>
          </div>
          <nav className="p-4 flex flex-col space-y-4">
            <a href="/teacher" className="hover:text-blue-600">
              Dashboard
            </a>
            <a href="/teacher/view-room" className="hover:text-blue-600">
              View Classes
            </a>
            <a href="/teacher/quiz-create" className="hover:text-blue-600">
              Create Quiz
            </a>
            <a href="/teacher/quiz-generation" className="hover:text-blue-600">
              Generate Quiz
            </a>
            <a href="/teacher/student-details" className="hover:text-blue-600">
              View Student Details
            </a>
            <a href="/teacher/submissions" className="hover:text-blue-600">
              View Submissions
            </a>
            <a href="/teacher/profile" className="hover:text-blue-600">
              Profile
            </a>
            <a href="/teacher/settings" className="hover:text-blue-600">
              Settings
            </a>
          </nav>
        </div>
      </div>

      <div className="flex flex-row justify-end">
        <button className="serious-button" onClick={logout}>
          Log out
        </button>
      </div>
    </nav>
  );
};

export default TeacherNav;
