"use client";

import React from 'react'
import { X } from "lucide-react";
import Image from 'next/image';
import {useState, useEffect} from 'react';
// import {signIn, signOut, useSession, getProviders} from 'next-auth/react';

const StudentNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className='flex flex-between justify-between mb-10 pt-3 ml-4 mt-3'>
         <div>
      <button
        onClick={() => setIsOpen(true)}
        className=" p-2 text-white fixed top-4 left-4 z-50"
      >
        <Image src="/assets/icons/logo-black.jpg"
            alt="Teacher Assistant"
            width={30}
            height = {30}
            className ="object-contain" />
            
      </button>
      <span className="text-logo ml-10 p-5">Teacher's Assistant</span>

      {/* Overlay */}
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
          <a href="/student" className="hover:text-blue-600">Student Dashboard</a>
          <a href="/student/joinRoom" className="hover:text-blue-600">Join a Roomn</a>
          <a href="/student/viewRooms" className="hover:text-blue-600">View Rooms</a>
          <a href="/student/quizHistory" className="hover:text-blue-600">View Quiz History</a>
          <a href="/student/profile" className="hover:text-blue-600">Profile</a>
          <a href="/student/settings" className="hover:text-blue-600">Settings</a>
          <a href="#" className="hover:text-blue-600">Logout</a>
        </nav>
      </div>
    </div>
        
        <div className="flex flex-row justify-end">
          <button className = "serious-button">Log out</button>
        </div>
        
    </nav>
  )
}

export default StudentNav