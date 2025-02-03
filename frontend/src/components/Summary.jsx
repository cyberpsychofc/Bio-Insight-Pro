import React, { useState, useEffect, useRef } from 'react';
import { Markdown } from './NonMemoizedMarkdown'; // Adjust the import path accordingly

const Summary = () => {
    const [inputText, setInputText] = useState('');
    const textEndRef = useRef(null);

    const handleChange = (e) => {
        setInputText(e.target.value);
    };

    useEffect(() => {
        if (textEndRef.current) {
            textEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [inputText]);

    return (
        <div className='grid bg-gray-600 justify-center mt-10'>
            <div className='flex flex-col items-center px-10 py-12'>
                <textarea
                    id="message"
                    rows="12"
                    cols="90"
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Write your thoughts here..."
                    name='inputText'
                    value={inputText}
                    onChange={handleChange}
                ></textarea>
            </div>
            <div className='flex flex-col items-start w-full min-h-[3rem] bg-gray-700 text-left overflow-y-auto overflow-x-auto flex-grow mb-12 p-10'>
                <Markdown className='text-2xl'>{inputText}</Markdown>
                <div ref={textEndRef} />
            </div>
        </div>
    );
};

export default Summary;