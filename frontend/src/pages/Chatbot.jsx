import React, { useState, useRef, useEffect } from 'react';

const key = import.meta.env.VITE_OPENAI_API_KEY; // Ensure you have your OpenAI API key in the .env file

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const handleSend = (e) => {
        if (e.key === 'Enter' && input.trim() !== '') {
            setMessages(prev => [...prev, input.trim()]);
            setInput('');
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        console.log(key);
    }, [messages]);

    return (
        <div className={`flex flex-col min-h-screen px-10 py-6 ${messages.length === 0 ? 'overflow-hidden' : 'overflow-auto'}`}>
            {messages.length === 0 ? (
                // Centered input when there are no messages
                <div className="flex flex-1 items-center justify-center">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleSend}
                        className="focus:outline-none text-2xl rounded-3xl opacity-70 bg-gray-700 text-white w-full max-w-5xl p-4 placeholder-gray-400"
                        placeholder="How may I help you?"
                    />
                </div>
            ) : (
                <>
                    {/* Chat messages */}
                    <div className="flex flex-col space-y-4 mb-32 mt-20 mr-96">
                        {messages.map((msg, index) => (
                            <>
                                <div
                                    key={index}
                                    className="self-end bg-cyan-400 text-black font-semibold px-4 py-2 rounded-s-3xl rounded-se-3xl max-w-md"
                                >
                                    {msg}
                                </div>
                                <div className='text-gray-500 text-sm self-end'>{new Date().toLocaleTimeString()}</div></>
                        ))}

                        <div ref={messagesEndRef} />
                        <div className="fixed bottom-0 left-0 right-0 flex justify-center px-10">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleSend}
                                className="focus:outline-none text-2xl rounded-3xl opacity-70 bg-gray-700 text-white w-full max-w-5xl p-4 placeholder-gray-400 mb-20"
                                placeholder="How may I help you?"
                            />
                        </div>
                    </div>

                    {/* Sticky input at bottom */}

                </>
            )}
        </div>
    );
};

export default Chatbot;