import axios from "axios";
import ShinyText from '../components/ui/ShinyText';
import { useState, useEffect } from 'react';
import { Markdown } from "../components/NonMemoizedMarkdown.jsx";
import Footer from "../components/Footer.jsx";
import AnimatedNumber from "../components/AnimatedNumber.jsx";
import { Helmet } from "react-helmet";

// Global variable
export let isAnalysed = false;

export function resetIsAnalysed() {
    isAnalysed = false;
}

export default function Similarity() {
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

    const handleAnalyze = async () => {
        setIsLoading(true);
        isAnalysed = false; // Reset state
        localStorage.removeItem('similarityResult'); // Clear localStorage

        try {
            const analyzeResponse = await axios.post('http://localhost:8000/agent/similarity/predict');
            console.log('Analyze Response:', analyzeResponse.data);

            const fetchResponse = await axios.get('http://localhost:8000/agent/similarity/fetch');
            console.log('Fetch Response:', fetchResponse.data);

            setResult(fetchResponse.data);
            localStorage.setItem('similarityResult', JSON.stringify(fetchResponse.data)); // Persist result
            isAnalysed = true;
            if (isAnalysed) {
                localStorage.setItem('similarityResult', JSON.stringify(fetchResponse.data));
                console.log('Response stored in localStorage:', fetchResponse.data);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

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
        <div className="min-h-[85vh] flex items-center justify-start">
            {isLoading ? (
                <div className='w-full flex items-center justify-center p-10'>
                    <div className='w-2/3 -translate-y-60'>
                        <ShinyText text={loadingText + '...'} disabled={false} speed={3} className="text-4xl" />
                    </div>
                </div>
            ) : (
                <div className='w-full flex items-center justify-center p-10'>
                    <div className='w-2/3 mt-32 grid'>
                        <Markdown>
                            {result.ModelResponse}
                        </Markdown>
                        <AnimatedNumber value={result.similarity_score * 100} />
                        <button
                            className="my-10 mx-auto w-auto rounded text-lg font-semibold transition-all duration-300 px-5 py-3 bg-cyan-300 text-black hover:bg-transparent hover:text-cyan-300 shadow-[0_0_10px_#22d3ee] mt-16"
                        >
                            Knowledge Graph
                        </button>
                    </div>
                </div>
            )}
        </div>
        <div>
            <Footer />
        </div>
    </>
};