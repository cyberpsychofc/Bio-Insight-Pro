import React, { useState } from "react";

const TogglePlug = () => {
  const [isOn, setIsOn] = useState(false);

  const handleToggle = () => {
    setIsOn((prev) => !prev);
  };

  return (
    <div className="items-center flex space-x-3 justify-center mb-4">
      <div className="relative">
        <input
          type="checkbox"
          id="toggle"
          checked={isOn}
          onChange={handleToggle}
          className="sr-only"
        />
        {/* Toggle Track */}
        <div
          className={`w-[60px] h-7 rounded-full cursor-pointer transition-colors duration-300 ${
            isOn ? "bg-cyan-500" : "bg-gray-300"
          }`}
          onClick=''
        ></div>
        {/* Toggle Knob */}
        <div
  className={`w-6 h-6 bg-white rounded-full shadow absolute top-0.5 left-0.5 transition-all duration-300 ease-in-out transform ${
    isOn ? "translate-x-8 hover:bg-gray-300" : "translate-x-0 hover:bg-cyan-300"
  }`}
  onClick={handleToggle}
></div>

      </div>
      <span
        className={`font-medium transition-colors duration-300 ${
          isOn ? "text-cyan-500" : "text-gray-300"
        }`}
      >
        {isOn ? "ON" : "OFF"}
      </span>
    </div>
  );
};

export default TogglePlug;