import React from 'react'

const Navbar = () => {
  return (
    <>
        <nav class="text-white flex p-7 text-2xl justify-between bg-transparent fixed top-0 left-0 right-0 z-10 backdrop-blur-md">
        <div class="font-semibold mt-4">Bio Insight Pro</div>
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
        <div className="">
          <button class="bg-cyan-300 rounded p-3 mr-2 text-black font-semibold text-base shadow-[0_0_10px_#22d3ee] transition-all duration-300 hover:bg-transparent hover:text-cyan-300 hover:shadow-[0_0_10px_#000000]">Sign up</button>
        <button class="bg-cyan-300 rounded p-3 text-black font-semibold text-base shadow-[0_0_10px_#22d3ee] transition-all duration-300 hover:bg-transparent hover:text-cyan-300 hover:shadow-[0_0_10px_#000000]">Log In</button>
        </div>
        
      </nav>
    </>
  )
}

export default Navbar
