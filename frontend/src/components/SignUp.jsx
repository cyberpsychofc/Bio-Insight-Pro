import React from 'react';

export default function SignUp() {
  return (
    <div className="grid justify-center py-56 h-screen ">
      <div className="grid items-center text-white text-left w-[390px] p-5 bg-transparent rounded backdrop-blur-md border-gray-400 border-4">
        <p>Username</p>
        <input 
          type="text" 
          name="username" 
          id="username" 
          className="p-1 rounded my-4 border border-gray-700 border-4 focus:outline-none bg-transparent text-white"/>
        <p>Email</p>
        <input type="email" name="email" id="email" className="p-1 rounded my-4 border border-gray-700 border-4 focus:outline-none bg-transparent text-white"/>
        <p>Password</p>
        <input type="password" name="password1" id="password1" className="p-1 rounded my-4 border border-gray-700 border-4 focus:outline-none bg-transparent text-white"/>
        <p>Confirm Password</p>
        <input type="password" name="password2" id="password2" className="p-1 rounded my-4 border border-gray-700 border-4 focus:outline-none bg-transparent text-white"/>
        <button className="bg-cyan-300 rounded p-3 mr-2 text-black font-semibold text-base shadow-[0_0_10px_#22d3ee] transition-all duration-300 hover:bg-transparent hover:text-cyan-300 hover:shadow-[0_0_10px_#000000] focus:ring focus:outline-none focus:text-[#1e417b]">Submit</button>
      </div>
    </div>
  );
}
