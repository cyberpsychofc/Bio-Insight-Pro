import React from 'react';

export default function ImageText () {
  return (
    <>
      <div className="flex flex-col md:flex-row items-center mt-20 text-base md:text-xl lg:text-2xl shadow rounded-lg p-4 lg:p-10 w-full h-full">
        {/* Image Section */}
        <div className="flex-shrink-0">
          
          <img className="w-auto h-auto md:w-[300px] md:h-[300px] lg:w-[400px] lg:h-[400px] sm:w-[200px] sm:h-[200px]" src="/doc icon.png" alt="Doc Icon"/>

        </div>
        {/* Text Section */}
        <div className="mt-4 md:ml-10 lg:ml-20 text-center md:text-left">
          <h2 className="font-bold text-gray-200 md:mb-4">AI-Powered Document Analysis</h2>
          <p className="text-gray-400 pr-8">
            A futuristic representation of intelligent document processing, highlighting AI-driven data analysis and pattern recognition.
            Find deep insights, emphasizing precision in extracting knowledge for research, decision-making, and biomedical advancements.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center mt-10 text-base md:text-xl lg:text-2xl shadow rounded-lg p-4 lg:p-10 w-full h-full">
        {/* Text Section */}
        <div className="mt-4 md:mt-0 md:ml-4 order-2 md:order-1 mr-8 md:mr-16 text-center md:text-left">
          <h2 className="font-bold text-gray-200 md:mb-4">Genetic Pattern Recognition</h2>
          <p className="text-gray-400">
            Advanced pattern recognition in genetic data.
            Perform in-depth analysis, enabling breakthroughs in genomics, medical research, and precision medicine for improved healthcare and disease prevention.
          </p>
        </div>
        {/* Image Section */}
        <div className="flex-shrink-0 order-1 md:order-2">

          <img className="w-auto h-auto md:w-[300px] md:h-[300px] lg:w-[600px] lg:h-[600px] sm:w-[200px] sm:h-[200px]" src="/dna.png" alt="DNA" />

        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center mt-10 text-base md:text-xl lg:text-2xl shadow rounded-lg p-4 lg:p-10 w-full h-full">
        {/* Image Section */}
        <div className="flex-shrink-0">

          <img className="w-auto h-auto md:w-[300px] md:h-[300px] lg:w-[400px] lg:h-[400px] sm:w-[200px] sm:h-[200px]" src="/graph.png" alt="GRAPH" />

        </div>
        {/* Text Section */}
        <div className="mt-4 md:ml-10 lg:ml-20 text-center md:text-left">
          <h2 className="font-bold text-gray-200 md:mb-4">Bio-Med Knowledge Graph Generation</h2>
          <p className="text-gray-400">
            Transform biomedical documents into structured knowledge graphs, revealing hidden connections and insights.
            Enables researchers and healthcare professionals to visualize relationships, enhance decision-making, and accelerate drug discovery and diagnosis.
          </p>
        </div>
      </div>
    </>
  );
}