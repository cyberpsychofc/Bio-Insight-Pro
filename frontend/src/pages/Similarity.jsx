import axios from "axios";
import ShinyText from '../components/ui/ShinyText';
import { useState, useEffect } from 'react';
import { Markdown } from "../components/NonMemoizedMarkdown.jsx"
import Footer from "../components/Footer.jsx"

const AnimatedNumber = ({ value }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let current = 0;
        const duration = 1000; // Animation duration in milliseconds
        const stepTime = 10; // Time interval for updating the number
        const steps = duration / stepTime;
        const increment = value / steps;

        const interval = setInterval(() => {
            current += increment;
            if (current >= value) {
                setCount(value);
                clearInterval(interval);
            } else {
                setCount(Math.round(current)); // Round for better display
            }
        }, stepTime);

        return () => clearInterval(interval);
    }, [value]);

    return (
        <div className="mt-12 items-center justify-center flex text-8xl">
            {count}
        </div>
    );
};

async function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
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
        try {
            const analyzeResponse = await axios.post('http://localhost:8000/agent/similarity/predict');
            console.log('Analyze Response:', analyzeResponse.data);

            const fetchResponse = await axios.get('http://localhost:8000/agent/similarity/fetch');
            console.log('Fetch Response:', fetchResponse.data);
            // await wait(5000);
            setResult(fetchResponse.data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        handleAnalyze();
    }, []);

    useEffect(() => {
        const newText = sampleText[(sampleText.indexOf(loadingText) + 1) % sampleText.length]
        const time = setTimeout(() => {
            setLoadingText(newText);
        }, [3000]);
        return () => {
            clearInterval(time);
        }
    }, [loadingText]);

    return <>
        <div className="w-screen min-h-[85vh] flex items-center justify-start">
            {isLoading ? (
                <div className='w-full flex items-center justify-center p-10'>
                    <div className='w-2/3 -translate-y-60'>
                        <ShinyText text={loadingText + '...'} disabled={false} speed={3} className="text-4xl" />
                    </div>
                </div>
            ) : (
                <div className='w-full flex items-center justify-center p-10'>
                    <div className='w-2/3'>
                        <Markdown>
                            {result.ModelResponse}
                        </Markdown>
                        <AnimatedNumber value={result.similarity_score * 100} />
                    </div>
                    </div>
                )}


        </div>
        <div>
            <Footer />
        </div>
    </>
}