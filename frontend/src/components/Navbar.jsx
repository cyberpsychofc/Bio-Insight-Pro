import { useState } from "react"
import "../App.css"
import { useLocation, Link } from "react-router"
import alignIcon from "/align.svg"
import graphIcon from "/graph.svg"
import { isAnalysed, relFound } from "../pages/Similarity"
import { Menu, X } from "lucide-react"

export default function Navbar() {
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  function handleSimilarityClick(e) {
    if (!isAnalysed) {
      e.preventDefault() // Prevent navigation
      alert("Please analyze documents first.")
    }
  }

  function handleBioMapClick(e) {
    if (!relFound) {
      e.preventDefault() // Prevent navigation
      alert("Please analyze documents first.")
    }
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const navItems = [
    { name: "Home", path: "/", handler: null },
    { name: "About", path: "/about", handler: null },
    { name: "Similarity", path: "/similarity", handler: handleSimilarityClick },
    { name: "BioMap", path: "/biomap", handler: handleBioMapClick, icon: graphIcon },
    { name: "BioAlign", path: "/align", handler: null, icon: alignIcon },
    { name: "IntelliOnco", path: "/intellionco", handler: null },
  ]

  return (
    <nav
      className="text-white flex flex-wrap p-4 md:p-7 text-2xl justify-between bg-transparent sticky z-40 top-0 left-0 right-0 backdrop-blur-md"
      role="navigation"
    >
      <div className="flex justify-between w-full lg:w-auto">
        <Link
          to="/"
          aria-label="Home"
          className="flex transform transition-all duration-300 hover:scale-110 hover:drop-shadow-lg"
        >
          <svg
            className="w-[38px] h-[38px] md:w-[42px] md:h-[42px] text-gray-800 dark:text-white transition-all duration-300 hover:text-cyan-400 hover:drop-shadow-[0_0_15px_rgba(0,255,255,0.7)]"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="cyan"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.6"
              d="M15.041 13.862A4.999 4.999 0 0 1 17 17.831V21M7 3v3.169a5 5 0 0 0 1.891 3.916M17 3v3.169a5 5 0 0 1-2.428 4.288l-5.144 3.086A5 5 0 0 0 7 17.831V21M7 5h10M7.399 8h9.252M8 16h8.652M7 19h10"
            />
          </svg>

        </Link>

        <svg viewBox="0 0 700 70" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="cyan">
                <animate attributeName="offset" values="-1;1" dur="3s" repeatCount="indefinite" />
              </stop>
              <stop offset="50%" stop-color="white">
                <animate attributeName="offset" values="0;2" dur="3s" repeatCount="indefinite" />
              </stop>
              <stop offset="100%" stop-color="cyan">
                <animate attributeName="offset" values="1;3" dur="3s" repeatCount="indefinite" />
              </stop>
            </linearGradient>
          </defs>

          <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
            font-size="50"
            fill="transparent"
            stroke="url(#glowGradient)"
            stroke-width="1">
            Bio Insight Pro
          </text>
        </svg>








        {/* Mobile menu button */}
        <button
          onClick={toggleMenu}
          className="lg:hidden flex items-center"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X className="w-6 h-6 text-cyan-300" /> : <Menu className="w-6 h-6 text-cyan-300" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`${isMenuOpen ? "flex" : "hidden"
          } lg:hidden flex-col w-full mt-4 space-y-4 transition-all text-xl duration-300 ease-in-out`}
      >
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path

          return (
            <div className="flex items-center gap-2 justify-center" key={index}>
              <Link
                to={item.path}
                onClick={(e) => {
                  if (item.handler) item.handler(e)
                  if (!e.defaultPrevented) setIsMenuOpen(false)
                }}
                className={`relative group ${isActive ? "text-white" : "text-gray-500 hover:text-white"}`}
                aria-label={item.name}
              >
                <span
                  className={`after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 ${isActive
                    ? "after:bg-cyan-300 after:duration-300 after:w-full"
                    : "after:bg-cyan-300 after:transition-all after:duration-300 group-hover:after:w-full"
                    }`}
                >
                  {item.name}
                </span>
              </Link>
              {item.icon && (
                <img
                  src={item.icon || "/placeholder.svg"}
                  alt={`${item.name} Icon`}
                  className="w-5 h-5 md:w-6 md:h-6"
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Desktop menu */}
      <div className="hidden lg:flex text-xl text-gray-500 gap-6 lg:gap-9 mt-4">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path

          return (
            <div className="flex items-center gap-2" key={index}>
              <Link
                to={item.path}
                onClick={item.handler}
                className={`relative group ${isActive ? "text-white" : "hover:text-white"}`}
                aria-label={item.name}
              >
                <span
                  className={`after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 ${isActive
                    ? "after:bg-cyan-300 after:duration-300 after:w-full"
                    : "after:bg-cyan-300 after:transition-all after:duration-300 group-hover:after:w-full"
                    }`}
                >
                  {item.name}
                </span>
              </Link>
              {item.icon && <img src={item.icon || "/placeholder.svg"} alt={`${item.name} Icon`} className="w-6 h-6" />}
            </div>
          )
        })}
      </div>

      <div className="hidden lg:block">
        <button className="hidden bg-cyan-300 rounded p-3 mr-2 text-black font-semibold text-base shadow-[0_0_10px_#22d3ee] transition-all duration-300 hover:bg-transparent hover:text-cyan-300 hover:shadow-[0_0_10px_#000000] focus:ring focus:outline-none">
          Sign Up
        </button>
        <button className="hidden bg-cyan-300 rounded p-3 text-black font-semibold text-base shadow-[0_0_10px_#22d3ee] transition-all duration-300 hover:bg-transparent hover:text-cyan-300 hover:shadow-[0_0_10px_#000000] focus:ring focus:outline-none">
          Log In
        </button>
      </div>
    </nav>
  )
}
