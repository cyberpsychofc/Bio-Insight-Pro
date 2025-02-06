import React from 'react';

const ImageText = () => {
  return (
    <>
      <div className="flex flex-col md:flex-row items-center mt-20 text-base md:text-xl lg:text-2xl shadow rounded-lg p-4 lg:p-10">
        {/* Image Section */}
        <div className="flex-shrink-0">
          <img className="w-24 h-24 md:w-48 md:h-48 lg:w-96 lg:h-96" src="src/assets/doc icon.png" alt="Doc Icon" />
        </div>
        {/* Text Section */}
        <div className="mt-4 ml-60">
          <h2 className="font-bold text-gray-800 mb-4 md:mb-16">Title Text</h2>
          <p className="text-gray-600">
            This is a short description of the component. You can add more details here as needed.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center mt-10 text-base md:text-xl lg:text-2xl shadow rounded-lg p-4 lg:p-10">
        {/* Text Section */}
        <div className="mt-4 md:mt-0 md:ml-4 order-2 md:order-1 mr-60">
          <h2 className="font-bold text-gray-800 mb-4 md:mb-16">Title Text</h2>
          <p className="text-gray-600">
            This is a short description of the component. You can add more details here as needed.
          </p>
        </div>
        {/* Image Section */}
        <div className="flex-shrink-0 order-1 md:order-2">
          <img className="w-[640px] h-[640px]" src="src/assets/dna.png" alt="DNA" />
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center mt-10 text-base md:text-xl lg:text-2xl shadow rounded-lg p-4 lg:p-10">
        {/* Image Section */}
        <div className="flex-shrink-0">
          <img className="w-[640px] h-[640px]" src="src/assets/graph.png" alt="GRAPH" />
        </div>
        {/* Text Section */}
        <div className="mt-4 ml-60">
          <h2 className="font-bold text-gray-800 mb-4 md:mb-16">Title Text</h2>
          <p className="text-gray-600">
            This is a short description of the component. You can add more details here as needed.
          </p>
        </div>
      </div>
    </>
  );
}

export default ImageText;
