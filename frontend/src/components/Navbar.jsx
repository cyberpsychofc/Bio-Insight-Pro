import React from 'react'
import '../App.css'

const Navbar = () => {
  return (
    <>
      <nav class="text-white flex p-7 text-2xl justify-between bg-transparent fixed top-0 left-0 right-0 z-10 backdrop-blur-md">
        <a href="https://bioinsght.pro/">
          <svg class="w-[42px] h-[42px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="none" viewBox="0 0 24 24">
            <path stroke="cyan" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="M15.041 13.862A4.999 4.999 0 0 1 17 17.831V21M7 3v3.169a5 5 0 0 0 1.891 3.916M17 3v3.169a5 5 0 0 1-2.428 4.288l-5.144 3.086A5 5 0 0 0 7 17.831V21M7 5h10M7.399 8h9.252M8 16h8.652M7 19h10" />
          </svg>
        </a>


        <div class="text-xl text-gray-500 flex gap-9 mt-4">
          <a href="#" class="relative group hover:text-white">
            <span class="after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-cyan-300 after:transition-all after:duration-300 group-hover:after:w-full">
              Home
            </span>
          </a>
          <a href="#" class="relative group hover:text-white">
            <span class="after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-cyan-300 after:transition-all after:duration-300 group-hover:after:w-full">
              Similarity
            </span>
          </a>
          <a href="#" class="relative group hover:text-white">
            <span class="after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-cyan-300 after:transition-all after:duration-300 group-hover:after:w-full">
              About
            </span>
          </a>

        </div>
        <div>
          <button class="bg-cyan-300 rounded p-3 mr-2 text-black font-semibold text-base shadow-[0_0_10px_#22d3ee] transition-all duration-300 hover:bg-transparent hover:text-cyan-300 hover:shadow-[0_0_10px_#000000]">Sign Up</button>
          <button class="bg-cyan-300 rounded p-3 text-black font-semibold text-base shadow-[0_0_10px_#22d3ee] transition-all duration-300 hover:bg-transparent hover:text-cyan-300 hover:shadow-[0_0_10px_#000000]">Log In</button>
        </div>

      </nav>
    </>
  )
}

export default Navbar
