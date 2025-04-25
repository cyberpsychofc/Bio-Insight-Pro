import React, { useState, useRef, useEffect } from 'react';
import Footer from '../components/Footer.jsx';
import { Markdown } from "../components/NonMemoizedMarkdown.jsx";

const key = import.meta.env.VITE_OPENAI_API_KEY;

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const handleSend = async (e) => {
        if (e.key === 'Enter' && input.trim() !== '') {
            const userMessage = { role: 'user', content: input.trim() };
            setMessages(prev => [...prev, userMessage]);
            setInput('');

            const systemMessages = [...messages, userMessage];
            const newBotMessage = { role: 'assistant', content: '' };
            setMessages(prev => [...prev, newBotMessage]);

            try {
                const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${key}`,
                    },
                    body: JSON.stringify({
                        model: 'deepseek-r1-distill-llama-70b',
                        messages: systemMessages,
                        max_completion_tokens: 4096,
                        stream: true
                    })
                });

                const reader = res.body.getReader();
                const decoder = new TextDecoder('utf-8');

                let buffer = '';
                let streamingStarted = false;
                let currentMessage = '';

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    buffer += chunk;

                    let lines = buffer.split('\n');
                    buffer = lines.pop();

                    for (const line of lines) {
                        if (!line.trim().startsWith('data:')) continue;

                        const messageData = line.replace(/^data:\s*/, '');
                        if (messageData === '[DONE]') return;

                        let parsed;
                        try {
                            parsed = JSON.parse(messageData);
                        } catch (e) {
                            console.warn('Skipping malformed JSON:', messageData);
                            continue;
                        }

                        const token = parsed.choices?.[0]?.delta?.content || '';
                        currentMessage += token;

                        if (!streamingStarted) {
                            const idx = currentMessage.indexOf('</think>');
                            if (idx !== -1) {
                                streamingStarted = true;
                                currentMessage = currentMessage.slice(idx + '</think>'.length);

                                setMessages(prev => {
                                    const updated = [...prev];
                                    updated[updated.length - 1] = { role: 'assistant', content: currentMessage };
                                    return updated;
                                });
                            }
                            continue;
                        }

                        setMessages(prev => {
                            const updated = [...prev];
                            updated[updated.length - 1] = {
                                ...updated[updated.length - 1],
                                content: currentMessage
                            };
                            return updated;
                        });
                    }
                }

            } catch (err) {
                console.error('Error streaming response:', err);
                setMessages(prev => [...prev, { role: 'assistant', content: 'Oops! Something went wrong.' }]);
            }
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <>
            <div className="flex flex-col h-screen mx-96 p-4 backdrop-blur-sm">
                {messages.length === 0 ? (
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleSend}
                        className="focus:outline-none text-2xl rounded-3xl opacity-70 bg-gray-700 text-white w-full p-4 placeholder-gray-400 mt-96 mb-10"
                        placeholder="How may I help you?"
                    />
                ) : (
                    <>
                        <div className="flex-1 overflow-y-auto mt-10 mb-4 space-y-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-transparent dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 px-4">
                            {messages.map((msg, index) => (
                                <div key={index} className={`flex flex-col ${msg.role === 'user' ? 'self-end items-end' : 'self-start items-start'}`}>
                                    <div className={`px-4 py-2 rounded-3xl ${msg.role === 'user' ? 'bg-cyan-400 text-black text-md font-semibold rounded-s-3xl' : 'text-white text-xl rounded-e-3xl rounded-es-3xl'}`}>
                                        {msg.role === 'user' ? (
                                            <span>{msg.content}</span>
                                        ) : (
                                            <Markdown className="text-2xl">
                                                {msg.content}
                                            </Markdown>
                                        )}
                                        
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="py-6">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleSend}
                                className="focus:outline-none text-2xl rounded-3xl opacity-70 bg-gray-700 text-white w-full p-4 placeholder-gray-400"
                                placeholder="How may I help you?"
                            />
                        </div>
                    </>
                )}
            </div>
            <Footer />
        </>
    );
};

export default Chatbot;
