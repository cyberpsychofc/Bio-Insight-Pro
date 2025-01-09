import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [isFixedDivVisible, setIsFixedDivVisible] = useState(false);

  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 950) {
        setIsFixedDivVisible(true);
      } else {
        setIsFixedDivVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Handle file input change
  const handleFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log(`File selected: ${file.name}`);
    }
  };

  return (
    <>
      {/* Main Heading */}
<div className="flex justify-center mt-60 mb-60 px-10 py-16 relative">
  <div className="text-white flex justify-center text-9xl font-semibold neon-text">
    <h1 className="text-shadow">BIO INSIGHT PRO</h1>
  </div>
</div>

      {/* File Drop Area */}
      <div className="relative flex items-center justify-center py-1">
        <div className="absolute inset-0 backdrop-blur-md bg-transparent"></div>
        <div className="relative w-full max-w-3xl p-10 backdrop-blur-md bg-transparent text-white rounded-lg shadow-lg border-2 border-dashed border-gray-700 hover:border-gray-500 text-center">
          <p className="text-gray-400 text-2xl mb-4">Drag & drop your document here</p>
          <p className="text-gray-400 mb-4 text-2xl"> or </p>
          <button
            className="bg-cyan-300 rounded px-8 py-3 text-lg text-black font-semibold hover:bg-transparent hover:text-cyan-300 transition-all duration-300 shadow-[0_0_10px_#22d3ee]"
            onClick={() => document.getElementById('file-upload').click()}
          >
            Select document(s)
          </button>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFile}
            accept=".pdf,.doc,.docx,.txt"
          />
          <div id="file-preview" className="mt-6 text-lg text-gray-300 hidden"></div>
        </div>
      </div>

      {/* Small Fixed Div */}
      <div
        id="fixedDiv"
        className={`backdrop-blur-md fixed bottom-4 mx-auto left-0 right-0 w-4/5 sm:w-3/5 md:w-2/5 lg:w-1/4 transition-all duration-300 px-6 py-6 text-3xl rounded-lg shadow-lg cursor-pointer bg-cyan-300 hover:bg-transparent text-black hover:text-cyan-300 text-center ${
          isFixedDivVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <button
          onClick={() => document.getElementById('file-upload').click()}
          className="font-semibold"
        >
          Select Document(s)
        </button>
      </div>
    </>
  );
}

export default App;