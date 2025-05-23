import axios from "axios";
import ShinyText from '../components/ui/ShinyText';
import { useState, useEffect } from 'react';
import { Markdown } from "../components/NonMemoizedMarkdown.jsx";
import Footer from "../components/Footer.jsx";
import AnimatedNumber from "../components/AnimatedNumber.jsx";
import { Helmet } from "react-helmet";
import { filesSize } from "../App.jsx";
import { useNavigate } from "react-router";
import Loader2 from "../components/Loader2.jsx";
import { RefreshCcw } from "lucide-react";

// Global variable
export let isAnalysed = false;
export function resetIsAnalysed() {
    isAnalysed = false;
}

export let fetchResponse = null;

export let n = filesSize;

export let relFound = false;
export function resetRelFound() {
    relFound = false;
}

export default function Similarity() {
    const navigate = useNavigate();
    const [isGraph, setIsGraph] = useState(false);
    const [loadingText, setLoadingText] = useState("Thinking");
    const sampleText = [
        "Thinking",
        "Creating Embeddings",
        "Finding Patterns",
        "Calculating Similarities",
        "Finding Cosines",
        "Analyzing Results",
        "Extracting Insights",
        "Finalizing Analysis"
    ];

    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState({});

    async function handleAnalyze() {
        window.scrollTo(0, 0);
        setIsLoading(true);
        isAnalysed = false; // Reset state
        localStorage.removeItem('similarityResult'); // Clear localStorage

        try {
            const analyzeResponse = await axios.post('http://localhost:8000/agent/similarity/predict');
            console.log('Analyze Response:', analyzeResponse.data);

            fetchResponse = await axios.get('http://localhost:8000/agent/similarity/fetch');
            console.log('Fetch Response:', fetchResponse.data);

            setResult(fetchResponse.data);
            localStorage.setItem('similarityResult', JSON.stringify(fetchResponse.data)); // Persist result
            isAnalysed = true;
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleKnowledgeGraph() {
        console.log('Creating Graphs...');
        setIsGraph(true);
        relFound = false;
        function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        for (let i = 1; i <= filesSize; i++) {
            try {
                console.log(`Creating Graph for file ${i} ...`);
                let response = await axios.post(`http://localhost:8000/agent/ner/${i}/create-graph`);
                console.log(`Graph created for file ${i}`, response.message);
                await delay(500);
            } catch (error) {
                console.error(`Error creating graph for file ${i}:`, error);
                try {
                    response = await axios.post(`http://localhost:8000/agent/ner/${i}/create-graph`);
                } catch (error) {
                    console.error(`Error creating graph for file ${i} again:`, error);
                }
            }
        }
        console.log('All graphs created successfully.');
        setIsGraph(false);
        navigate('/biomap');
        relFound = true;
    }

    useEffect(() => {
        console.log('filesSize:', filesSize);
        if (filesSize === 0) {
            navigate('/');
        }
    }, [filesSize]);


    useEffect(() => {
        if (!isAnalysed) {
            handleAnalyze();
        }
    }, []);

    useEffect(() => {
        const newText = sampleText[(sampleText.indexOf(loadingText) + 1) % sampleText.length];
        const time = setTimeout(() => {
            setLoadingText(newText);
        }, [3000]);
        return () => {
            clearInterval(time);
        };
    }, [loadingText]);

    useEffect(() => {
        const storedResult = localStorage.getItem('similarityResult');
        if (storedResult) {
            setResult(JSON.parse(storedResult));
        }
    }, []);

    return <>
        <Helmet>
            <title>
                Similarity | BioInsightPro
            </title>
        </Helmet>
        <div className="flex items-center mb-[400px]">
            <div className='w-full flex items-center justify-center p-10'>
                <div className='w-2/3 mt-3 grid'>
                    {isLoading ? (
                        <ShinyText text={loadingText + '...'} disabled={false} speed={3} className="text-2xl mb-[700px]" />
                    ) : (
                        <div className="mb-[430px] grid items-center justify-center text-center">
                            <Markdown>
                                {result.ModelResponse}
                            </Markdown>
                            <AnimatedNumber value={result.similarity_score * 100} />
                            <div className="flex">
                                <button
                                    className="my-10 mx-auto w-auto rounded text-lg font-semibold transition-all duration-300 px-5 py-3 bg-cyan-300 text-black hover:bg-transparent hover:text-cyan-300 shadow-[0_0_10px_#22d3ee] mt-16"
                                    onClick={handleKnowledgeGraph}
                                >
                                    Create Map
                                </button>
                                <button onClick={handleAnalyze} className="p-2 group">
                                    <RefreshCcw className="w-6 h-6 text-white group-hover:text-cyan-500 transition-colors duration-200" />
                                </button>
                            </div>

                            {isGraph && (
                                <div className="flex items-center justify-center mt-20">
                                    <Loader2 />
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </div>
        <div>
            <Footer />
        </div>
    </>
};