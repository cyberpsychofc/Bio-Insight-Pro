import { useState } from "react";
import Footer from "../components/Footer.jsx"

export default function BioAlign() {
    const [text1, setText1] = useState("");
    const [text2, setText2] = useState("");

    const isAlignEnabled = text1.trim() !== "" && text2.trim() !== "";

    return (
        <div className="grid items-center">
            <div className="grid items-center justify-center mt-20 text-center text-4xl text-gray-300">
                Raw Sequence
                <textarea
                    className="lg:w-[900px] xl:w-[1200px] md:w-[600px] sm:w-[500px] xs:w-[100px] mx-auto text-white mt-5 rounded-md p-5 text-2xl mb-8 bg-gray-900 focus:outline-none"
                    rows="10"
                    value={text1}
                    onChange={(e) => setText1(e.target.value.toUpperCase())}
                />
                Target Sequence
                <textarea
                    className="lg:w-[900px] xl:w-[1200px] md:w-[600px] sm:w-[500px] xs:w-[100px] mx-auto text-white mt-5 rounded-md p-5 text-2xl bg-gray-900 focus:outline-none"
                    rows="10"
                    value={text2}
                    onChange={(e) => setText2(e.target.value.toUpperCase())}
                />
            </div>
            <button
                className={`my-10 mx-auto w-auto rounded text-lg font-semibold transition-all duration-300 px-5 py-3 ${isAlignEnabled
                    ? "bg-cyan-300 text-black hover:bg-transparent hover:text-cyan-300 shadow-[0_0_10px_#22d3ee]"
                    : "bg-gray-500 text-gray-300 cursor-not-allowed"
                    }`}
                disabled={!isAlignEnabled}
            >
                Align
            </button>
            <div className="">

            </div>
            <div>
                <Footer />
            </div>
        </div>
    );
}