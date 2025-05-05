import { useState } from "react";
import Footer from "../components/Footer.jsx";
import { Helmet } from "react-helmet";

export default function BioAlign() {
    const [sequence1, setSequence1] = useState("");
    const [sequence2, setSequence2] = useState("");
    const [result, setResult] = useState({});

    const isAlignEnabled = sequence1.trim() !== "" && sequence2.trim() !== "";

    function handlePaste(setter) {
        navigator.clipboard.readText().then((text) => {
            setter(text.replace(/\s+/g, ""));
        });
    }

    function handleKeyDown(event) {
        const allowedCharacters = ["A", "G", "C", "T", "a", "g", "c", "t", '-'];
        const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Enter", "Tab", "Shift", "Control", "Meta", "Alt", "Escape", "Home", "End", "PageUp", "PageDown", "Insert", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "PrintScreen", "ScrollLock", "PauseBreak", "NumLock", "Numpad0", "Numpad1", "Numpad2", "Numpad3", "Numpad4", "Numpad5", "Numpad6", "Numpad7", "Numpad8", "Numpad9", "NumpadAdd", "NumpadSubtract", "NumpadMultiply", "NumpadDivide", "NumpadDecimal", "NumpadEnter", "ContextMenu", "ArrowUp", "ArrowDown", "Space", "V", "C", "Z"];
        if ((event.ctrlKey || event.metaKey) && ["v", "c", "x"].includes(event.key.toLowerCase())) {
            return;
        }
        if (!allowedCharacters.includes(event.key) && !allowedKeys.includes(event.key)) {
            event.preventDefault();
        }
    }

    function sanitizeInput(input) {
        return input.toUpperCase().replace(/[^AGCT-]/g, "");
    }


    async function handleAlignResponse(sequence1, sequence2) {
        try {
            const response = await fetch("http://localhost:8000/seq/align", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    sequence1,
                    sequence2
                }),
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
                        className="lg:w-[900px] xl:w-[1200px] md:w-[600px] sm:w-[500px] xs:w-[100px] mx-auto text-white mt-5 rounded-md p-5 text-2xl mb-2 bg-gray-900 focus:outline-none [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-transparent dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 resize-none bg-opacity-75"
                        rows="10"
                        value={sequence1}
                        onChange={(e) => setSequence1(sanitizeInput(e.target.value))}
                        onKeyDown={handleKeyDown}
                    />
                    <div className="flex justify-center gap-4 mb-8">
                        <button className="hidden px-4 py-2 bg-gray-900 text-white rounded bg-opacity-75" onClick={() => handlePaste(setSequence1)}><svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h2.429M7 8h3M8 8V4h4v2m4 0V5h-4m3 4v3a1 1 0 0 1-1 1h-3m9-3v9a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1v-6.397a1 1 0 0 1 .27-.683l2.434-2.603a1 1 0 0 1 .73-.317H19a1 1 0 0 1 1 1Z" />
                        </svg>
                        </button>
                    </div>
                    Target Sequence
                    <textarea
                        className="lg:w-[900px] xl:w-[1200px] md:w-[600px] sm:w-[500px] xs:w-[100px] mx-auto text-white mt-5 rounded-md p-5 text-2xl mb-2 bg-gray-900 focus:outline-none [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-transparent dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 resize-none bg-opacity-75"
                        rows="10"
                        value={sequence2}
                        onChange={(e) => setSequence2(sanitizeInput(e.target.value))}
                        onKeyDown={handleKeyDown}
                    />
                    <div className="flex justify-center gap-4 mt-2">
                        <button className="hidden px-4 py-2 bg-gray-900 text-white rounded bg-opacity-75" onClick={() => handlePaste(setSequence2)}>
                            <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
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
                    className="mt-9 bg-gray-950 text-center items-center justify-center mb-20 mx-auto p-5 rounded-md text-lg text-white [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-transparent dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 lg:w-[900px] xl:w-[1200px] md:w-[600px] sm:w-[400px] w-2/3 bg-opacity-75"
                    style={{
                        maxHeight: "70vh",
                        overflowY: "auto",
                    }}
                >
                    <p className="text-2xl font-semibold mb-5 ">Alignments</p>
                    <hr className="my-4 border-gray-700" />
                    {result.alignments && result.alignments.length > 0 ? (
                        result.alignments.map((a, index) => (
                            <div key={index} className="mb-6">
                                <h2 className="text-lg font-semibold">Alignment {index + 1}</h2>
                                <p className="mb-8">Score: {result.scores[index]}</p>
                                <div
                                    className="border-2 py-8 rounded-md border-gray-800 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-transparent dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 p-5 text-center text-xl"
                                    style={{
                                        maxWidth: "1300px",
                                        whiteSpace: "pre-wrap",
                                        overflowY: "auto",
                                        margin: "0 auto",
                                    }}
                                >
                                    <pre className="inline-block">{a.sequence1 || "N/A"}</pre><br />
                                    <pre className="inline-block">{a.alignment || "N/A"}</pre><br />
                                    <pre className="inline-block">{a.sequence2 || "N/A"}</pre>
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