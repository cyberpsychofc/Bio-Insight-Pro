import { useState } from "react";
import Footer from "../components/Footer.jsx";
import { Helmet } from "react-helmet";

export default function BioAlign() {
    const [sequence1, setSequence1] = useState("");
    const [sequence2, setSequence2] = useState("");
    const [result, setResult] = useState({});

    const isAlignEnabled = sequence1.trim() !== "" && sequence2.trim() !== "";

    function handleCopy(text) {
        navigator.clipboard.writeText(text);
    };

    function handlePaste(setter) {
        navigator.clipboard.readText().then(setter);
    };

    async function handleAlignResponse(sequence1, sequence2) {
        try {
            const response = await fetch("http://localhost:8000/seq/align", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ sequence1, sequence2 }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setResult(data);
            console.log("Response:", result);
        } catch (error) {
            console.error("Error:", error);
            return null;
        }
    }

    return (
        <>
            <Helmet>
                <title>
                    BioAlign | BioInsightPro
                </title>
            </Helmet>
            <div className="grid items-center">
                <div className="grid items-center justify-center mt-20 text-center text-4xl text-gray-300">
                    Raw Sequence
                    <textarea
                        className="lg:w-[900px] xl:w-[1200px] md:w-[600px] sm:w-[500px] xs:w-[100px] mx-auto text-white mt-5 rounded-md p-5 text-2xl mb-2 bg-gray-900 focus:outline-none [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-transparent dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 resize-none"
                        rows="10"
                        value={sequence1}
                        onChange={(e) => setSequence1(e.target.value.toUpperCase())}
                    />
                    <div className="flex justify-center gap-4 mb-8">
                        <button className="px-4 py-2 bg-gray-900 text-white rounded" onClick={() => handlePaste(setSequence1)}><svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h2.429M7 8h3M8 8V4h4v2m4 0V5h-4m3 4v3a1 1 0 0 1-1 1h-3m9-3v9a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1v-6.397a1 1 0 0 1 .27-.683l2.434-2.603a1 1 0 0 1 .73-.317H19a1 1 0 0 1 1 1Z" />
                        </svg>
                        </button>
                    </div>
                    Target Sequence
                    <textarea
                        className="lg:w-[900px] xl:w-[1200px] md:w-[600px] sm:w-[500px] xs:w-[100px] mx-auto text-white mt-5 rounded-md p-5 text-2xl mb-2 bg-gray-900 focus:outline-none [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-transparent dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 resize-none"
                        rows="10"
                        value={sequence2}
                        onChange={(e) => setSequence2(e.target.value.toUpperCase())}
                    />
                    <div className="flex justify-center gap-4 mt-2">
                        <button className="px-4 py-2 bg-gray-900 text-white rounded" onClick={() => handlePaste(setSequence2)}><svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h2.429M7 8h3M8 8V4h4v2m4 0V5h-4m3 4v3a1 1 0 0 1-1 1h-3m9-3v9a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1v-6.397a1 1 0 0 1 .27-.683l2.434-2.603a1 1 0 0 1 .73-.317H19a1 1 0 0 1 1 1Z" />
                        </svg>
                        </button>
                    </div>
                </div>
                <button
                    className={`my-10 mx-auto w-auto rounded text-lg font-semibold transition-all duration-300 px-5 py-3 ${isAlignEnabled
                        ? "bg-cyan-300 text-black hover:bg-transparent hover:text-cyan-300 shadow-[0_0_10px_#22d3ee]"
                        : "bg-gray-500 text-gray-300 cursor-not-allowed"
                        }`}
                    disabled={!isAlignEnabled}
                    onClick={() => handleAlignResponse(sequence1, sequence2)}
                >
                    Align
                </button>
                <div
                    className="mt-9 bg-gray-950 text-center items-center justify-center mb-20 mx-auto p-5 rounded-md text-lg text-white [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-transparent dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 lg:w-[900px] xl:w-[1200px] md:w-[600px] sm:w-[400px] xs:w-[200px]"
                    style={{
                        maxHeight: "70vh", // Use relative height for responsiveness
                        overflowY: "auto", // Vertical scrollbar for overflowing content
                    }}
                >
                    <p className="text-2xl font-semibold mb-5 ">Alignments</p>
                    <hr className="my-4 border-gray-700" />
                    {result.alignments && result.alignments.length > 0 ? (
                        result.alignments.map((a, index) => (
                            <div key={index} className="mb-6">
                                <h2 className="text-lg font-semibold mb-2">Alignment {index + 1}</h2>
                                <p className="mb-8">Score: {result.scores[index]}</p>
                                <div
                                    className="border-2 py-8 px-5 rounded-md border-gray-800 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-transparent dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
                                    style={{ // Relative width for responsiveness
                                        maxWidth: "1300px", // Maximum width limit
                                        whiteSpace: "nowrap", // Prevent wrapping of text
                                        overflowX: "auto", // Horizontal scrollbar for overflow
                                        margin: "0 auto", // Center horizontally
                                    }}
                                >
                                    <pre>{a.sequence1 || "N/A"}</pre>
                                    <pre>{a.alignment || "N/A"}</pre>
                                    <pre>{a.sequence2 || "N/A"}</pre>
                                </div>
                                <hr className="my-4 border-gray-700" />
                            </div>
                        ))
                    ) : (
                        <p>No results.</p>
                    )}
                </div>
                <div>
                    <Footer />
                </div>
            </div>
        </>
    );
}