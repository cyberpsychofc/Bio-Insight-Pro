import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import Footer from './components/Footer.jsx';
import Summary from './components/Summary.jsx';
import Table from './components/Table.jsx';
import ImageText from './components/ImageText.jsx';

function App() {
  const [isFixedDivVisible, setIsFixedDivVisible] = useState(false);
  const footerRef = useRef(null);

  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      const footerTop = footerRef.current.getBoundingClientRect().top + window.scrollY;

      if (window.scrollY > 690 && window.scrollY + 1000 <= footerTop) {
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


  const handleFile = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) formData.append('files', files[i]);
  
      axios.post('http://localhost:8000/api/upload/', formData, { // Correct endpoint URL
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then((response) => {
        console.log("Files uploaded successfully", response.data);
      }).catch((error) => {
        console.error("Error uploading files:", error.response ? error.response.data : error.message);
      });
    }
  };
  
  

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
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
              multiple
            />
            <div id="file-preview" className="mt-6 text-lg text-gray-300 hidden"></div>
          </div>
        </div>

        {/* Small Fixed Div */}
        <div
          id="fixedDiv"
          className={`font-semibold backdrop-blur-md fixed z-50 bottom-4 mx-auto left-0 right-0 w-4/5 sm:w-3/5 md:w-2/5 lg:w-1/4 transition-all duration-300 px-6 py-6 text-3xl rounded-lg shadow-lg cursor-pointer bg-cyan-300 hover:bg-transparent text-black hover:text-cyan-300 text-center ${isFixedDivVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
          onClick={() => document.getElementById('file-upload').click()}
        >
          Select document(s)
        </div>
        {/*New Components Here*/}
        <ImageText/>
      </div>

      {/* Footer */}
      <div ref={footerRef} className='mt-5'>
        <Footer />
      </div>
    </div>
  );
}

export default App;

{/* http://127.0.0.1:8000/api/upload/
key params is files
for django */}