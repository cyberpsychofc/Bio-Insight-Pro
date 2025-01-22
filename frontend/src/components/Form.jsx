import React, { useState } from 'react';
import TogglePlug from './TogglePlug';

const Form = () => {
  const [isOn, setIsOn] = useState(false);

  const handleToggle = () => {
    setIsOn((prev) => !prev);
  };

  return (
    <>
      <div className="max-w-6xl mx-auto bg-transparent text-white shadow-md rounded-lg p-6 py-80">
        <div className="grid-cols-1 md:grid-cols-2 gap-4 mb-6 w-1/2">
          <div>
            <label htmlFor="industry-pack" className="block font-semibold mb-2">
              Select Industry Pack
            </label>
            <select
              id="industry-pack"
              className="w-full border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
            >
              <option>General</option>
            </select>
          </div>
          <div>
            <label htmlFor="text-sample" className="block font-semibold mb-2">
              Select a text sample
            </label>
            <select
              id="text-sample"
              className="w-full border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
            >
              <option>Sample One</option>
            </select>
          </div>
          <div className="grid justify-center">
            <TogglePlug />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg">
            <h2 className="font-bold mb-2">EAST RUTHERFORD, N.J.</h2>
            <textarea
              rows="12"
              className="w-full bg-transparent border-gray-300 rounded-lg focus:ring focus:ring-blue-300 p-2"
              placeholder="He's gotta beat the gameuh"
            ></textarea>
            <div className="flex justify-center py-2">
              <button className="bg-cyan-300 rounded p-3 text-black font-semibold text-base shadow-[0_0_10px_#22d3ee] transition-all duration-300 hover:bg-transparent hover:text-cyan-300 hover:shadow-[0_0_10px_#000000]">
                Analyze
              </button>
            </div>
          </div>

          <div className=''>
            <TogglePlug/>
            {/* Summary Section */}
            <div className="p-4 rounded-lg border bg-gray-950">
              <h2 className="font-bold mb-2">Summary</h2>
              <p className="text-sm text-gray-100">
                Leaving the practice field Monday morning, Giants Coach Tom Coughlin was asked about the limited number of running
                backs...
              </p>
            </div>

            <div className="p-4 rounded-lg mt-4">
              <h3 className="font-bold mb-2">Sentiment Analysis</h3>
              <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead>
                  <tr>
                    <th className="border border-gray-300 p-4 text-center font-extrabold" >Sentiment Phrase</th>
                    <th className="border border-gray-300 p-4 text-center font-extrabold" >Sentiment Score</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-2 text-center">all set</td>
                    <td className="border border-gray-300 p-2 text-center">0.49</td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>

        </div>

      </div>
    </>
  );
};

export default Form;
