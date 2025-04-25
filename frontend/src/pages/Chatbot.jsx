import React, { useState, useRef, useEffect } from 'react';

const key = import.meta.env.VITE_OPENAI_API_KEY;

const Chatbot = () => {
    const [messages, setMessages] = useState([]); // { role: 'user' | 'assistant', content: string }
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

                    // Process only complete lines
                    let lines = buffer.split('\n');
                    buffer = lines.pop(); // keep the last line (might be incomplete)

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

                                setMessages(prev => [
                                    ...prev,
                                    { role: 'assistant', content: currentMessage }
                                ]);
                            }
                            continue;
                        }

                        // If streaming already started, update the last message
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
        <div className={`flex flex-col min-h-screen px-10 py-6 ${messages.length === 0 ? 'overflow-hidden' : 'overflow-auto'}`}>
            {messages.length === 0 ? (
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
                    <div className="flex flex-col space-y-4 mb-32 mt-20 mr-96">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex flex-col ${msg.role === 'user' ? 'self-end items-end' : 'self-start items-start'}`}>
                                <div className={`px-4 py-2 ml-96 rounded-3xl ${msg.role === 'user' ? 'bg-cyan-400 text-black text-md font-semibold rounded-s-3xl' : ' text-white text-xl rounded-e-3xl rounded-es-3xl'}`}>
                                    {msg.content}
                                </div>

                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

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
                </>
            )}
        </div>
    );
};

export default Chatbot;