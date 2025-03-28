import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Footer from './components/Footer.jsx';
import ImageText from './components/ImageText.jsx';
import TitleCard from './components/TitleCard.jsx';
import { useNavigate } from "react-router"
import { Helmet } from 'react-helmet';
import { resetIsAnalysed } from './pages/Similarity.jsx';
import Loader from './components/Loader.jsx';

export let filesSize = 0;

export default function App() {
  const nav = useNavigate();
  const [isFixedDivVisible, setIsFixedDivVisible] = useState(false);
  const footerRef = useRef(null);
  const [localFiles, setLocalFiles] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [simLoading, setSimLoading] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const footerTop = footerRef.current?.getBoundingClientRect().top + window.scrollY;
      setIsFixedDivVisible(window.scrollY > 1125 && window.scrollY + 1000 <= footerTop);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFileUpload = (files) => {
    setSimLoading(true);
    resetIsAnalysed();
    if (files.length > 0) {
      filesSize = files.length;
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }
      axios.post('http://localhost:8000/api/upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
        .then((response) => {
          console.log("Files uploaded successfully", response.data);
          setSimLoading(false);
          nav('/similarity');
        })
        .catch((error) => console.error("Error uploading files:", error.response?.data || error.message));
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    setLocalFiles(event.dataTransfer.files);
  };

  const handleRemoveFile = (index) => {
    const dataTransfer = new DataTransfer();
    Array.from(localFiles).forEach((file, i) => {
      if (i != index) {
        dataTransfer.items.add(file);
      }
    });
    setLocalFiles(dataTransfer.files);
  };

  return (
    <>
      <Helmet>
        <title>BioInsightPro</title>
      </Helmet>
      <div className="flex flex-col min-h-screen">
        <TitleCard />
        <div>
          <div className="relative flex items-center justify-center pt-10 px-5">
            <div
              className={`relative w-full max-w-5xl md:py-8 text-white rounded-lg shadow-lg transition-all duration-300 text-center `}
            >
              <div className="flex flex-col items-center justify-center border-2 p-10 rounded border-gray-700 w-full">
                <label htmlFor="file-upload" className="flex flex-col items-center justify-center bg-gray-950 rounded-md hover:bg-gray-700 border-2 border-dashed border-gray-700 hover:border-gray-500 cursor-pointer h-64 w-full">
                  <div className={`flex flex-col items-center px-5 md:px-10 py-10 md:py-20 w-full ${isDragging ? 'border-cyan-300 bg-gray-800' : 'border-gray-700 hover:border-gray-500'}`} onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-500">PDF</p>
                    <p className='text-gray-500 text-center mb-2 text-sm'>Please upload at least 2 documents</p>
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        setLocalFiles(e.target.files);
                      }}
                      accept=".pdf"
                      multiple
                    />
                  </div>
                </label>
                <p className="text-gray-400 text-2xl mt-4">or</p>
                <button
                  className="bg-cyan-300 rounded text-lg text-black font-semibold hover:bg-transparent hover:text-cyan-300 transition-all duration-300 shadow-[0_0_10px_#22d3ee] px-8 py-3 mt-4"
                  onClick={() => document.getElementById('file-upload').click()}
                >
                  Select document(s)
                </button>
              </div>
            </div>
          </div>

          <div
            className={`font-semibold backdrop-blur-md fixed z-50 bottom-4 mx-auto left-0 right-0 w-4/5 sm:w-3/5 md:w-2/5 lg:w-1/4 transition-all duration-300 px-6 py-6 text-3xl rounded-lg shadow-lg cursor-pointer bg-cyan-300 hover:bg-transparent text-black hover:text-cyan-300 text-center 
            ${isFixedDivVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            onClick={() => document.getElementById('file-upload').click()}
          >
            Select document(s)
          </div>

          {/* Uploaded Files Info */}
          <div className='flex items-center justify-center flex-col'>
            <div className="px-20 border-2 border-gray-700 w-2/3 py-5 mt-20 mx-20 mb-10 rounded-lg">
              <h2 className="text-xl text-white p-2 justify-center flex">Uploaded Files</h2>
              {Array.from(localFiles).length === 0 ? (
                <p className="text-white flex justify-center text-center">No files uploaded.</p>
              ) : (
                <ul>
                  {Array.from(localFiles).map((file, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center bg-gray-800 p-4 mb-2 rounded-md"
                    >
                      <div>
                        <p className="text-white">{file.name}</p>
                        <p className="text-gray-400 text-sm">
                          {(file.size / 1024).toFixed(2)} KB - {file.timestamp}
                        </p>
                      </div>
                      <button
                        className="bg-red-500 text-white rounded px-4 py-2"
                        onClick={() => handleRemoveFile(index)}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="grid justify-center mt-4">
            <button
              className={`rounded text-lg font-semibold transition-all duration-300 px-12 py-3 ${Array.from(localFiles).length < 2
                ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                : "bg-cyan-300 text-black hover:bg-transparent hover:text-cyan-300 shadow-[0_0_10px_#22d3ee] mb-4"
                }`}
              onClick={() => handleFileUpload(localFiles)}
              disabled={Array.from(localFiles).length < 2}
            >
              Analyze
            </button>
            {simLoading && (
              <div className="mt-4 items-center justify-center">
                <Loader />
              </div>
            )}
          </div>
          {/* New Components Right Here */}
          <ImageText />
        </div>

        <div ref={footerRef} className='mt-5'>
          <Footer />
        </div>
      </div>
    </>
  );
}