import { useState, useRef, useEffect } from "react"
import { Markdown } from "../components/NonMemoizedMarkdown.jsx"
import { Helmet } from "react-helmet"

const Chatbot = () => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const messagesEndRef = useRef(null)
  const [loadingMessageId, setLoadingMessageId] = useState(null)
  const key = import.meta.env.VITE_OPENAI_API_KEY

  useEffect(() => {
    // Load saved messages
    const savedMessages = localStorage.getItem("chat_messages")
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages)
        // Ensure all messages have an ID
        const messagesWithIds = parsedMessages.map((msg) =>
          msg.id ? msg : { ...msg, id: Date.now() + Math.random().toString(36).substring(2, 9) },
        )
        setMessages(messagesWithIds)
      } catch (e) {
        console.error("Error parsing saved messages:", e)
        localStorage.removeItem("chat_messages")
      }
    }

    // Clear on reload
    const handleBeforeUnload = () => {
      localStorage.removeItem("chat_messages")
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [])

  useEffect(() => {
    localStorage.setItem("chat_messages", JSON.stringify(messages))
  }, [messages])

  const handleSend = async (e) => {
    if (e.key === "Enter" && !e.shiftKey && input.trim() !== "") {
      const userMessage = {
        id: Date.now() + "-user-" + Math.random().toString(36).substring(2, 9),
        role: "user",
        content: input.trim(),
      }
      setMessages((prev) => [...prev, userMessage])
      setInput("")

      // Create message history for API request
      const messageHistory = [...messages, userMessage].map((msg) => ({
        role: msg.role,
        content: msg.content,
      }))

      const messageId = Date.now() + "-assistant-" + Math.random().toString(36).substring(2, 9)
      const newBotMessage = { id: messageId, role: "assistant", content: "", isLoading: true }
      setMessages((prev) => [...prev, newBotMessage])
      setLoadingMessageId(messageId)

      try {
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${key}`,
          },
          body: JSON.stringify({
            model: "deepseek-r1-distill-llama-70b",
            messages: messageHistory,
            max_completion_tokens: 4096,
            stream: true,
          }),
        })

        if (!res.ok) {
          throw new Error(`API responded with status: ${res.status}`)
        }

        const reader = res.body.getReader()
        const decoder = new TextDecoder("utf-8")
        let buffer = ""
        let currentMessage = ""
        let streamingStarted = false

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          buffer += chunk
          const lines = buffer.split("\n")
          buffer = lines.pop() || ""

          for (const line of lines) {
            if (!line.trim().startsWith("data:")) continue

            const messageData = line.replace(/^data:\s*/, "").trim()
            if (messageData === "[DONE]") {
              setLoadingMessageId(null)
              setMessages((prev) => {
                const updated = [...prev]
                const index = updated.findIndex((msg) => msg.id === messageId)
                if (index !== -1) {
                  updated[index] = {
                    ...updated[index],
                  }
                }
                return updated
              })
              continue
            }

            try {
              const parsed = JSON.parse(messageData)
              const token = parsed.choices?.[0]?.delta?.content || ""

              if (token) {
                currentMessage += token

                // Check if we need to handle thinking tags
                if (!streamingStarted) {
                  const thinkEndIndex = currentMessage.indexOf("</think>")
                  if (thinkEndIndex !== -1) {
                    streamingStarted = true
                    currentMessage = currentMessage.slice(thinkEndIndex + "</think>".length)
                  }
                }

                setMessages((prev) => {
                  const updated = [...prev]
                  const index = updated.findIndex((msg) => msg.id === messageId)
                  if (index !== -1) {
                    updated[index] = {
                      ...updated[index],
                      content: currentMessage,
                      isLoading: false,
                    }
                  }
                  return updated
                })
              }
            } catch (e) {
              console.warn("Skipping malformed JSON:", messageData)
            }
          }
        }
      } catch (err) {
        console.error("Error streaming response:", err)
        setMessages((prev) => {
          const updated = [...prev]
          const index = updated.findIndex((msg) => msg.id === messageId)
          if (index !== -1) {
            updated[index] = {
              ...updated[index],
              content: "Oops! Something went wrong. Please try again.",
              isLoading: false,
            }
          }
          return updated
        })
        setLoadingMessageId(null)
      }
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div>
      <Helmet><title>IntelliOnco | BioInsightPro</title></Helmet>
      <div className="flex-col flex max-h-screen mx-80 p-4 backdrop-blur-sm">
        {messages.length === 0 ? (
          <textarea
            rows={4}
            cols={50}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleSend}
            className="focus:outline-none text-2xl rounded-xl opacity-70 bg-gray-700 text-white w-full p-4 placeholder-gray-400 mt-96 mb-10 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-transparent dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 resize-none"
            placeholder="How may I help you?"
          />
        ) : (
          <>
            <div className="flex-1 overflow-y-auto mt-20 mb-4 space-y-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-transparent dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 px-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.role === "user" ? "self-end items-end" : "self-start items-start"}`}
                >
                  <div
                    className={`px-4 py-2 rounded-3xl ${msg.role === "user" ? "bg-cyan-500 text-black break-words max-w-[75%] text-xl font-semibold rounded-s-3xl" : "text-white rounded-e-3xl rounded-es-3xl"}`}
                  >
                    {msg.role === "user" ? (
                      <span>{msg.content}</span>
                    ) : msg.isLoading ? (
                      <div className="flex items-center space-x-2 text-2xl">
                        <span>Thinking</span>
                        <span className="loading-dots">
                          <span className="dot">.</span>
                          <span className="dot">.</span>
                          <span className="dot">.</span>
                        </span>
                      </div>
                    ) : (
                      <Markdown className='text-2xl'>{msg.content}</Markdown>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="py-6">
              <textarea
            rows={4}
            cols={50}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleSend}
                className="focus:outline-none text-2xl rounded-xl opacity-70 bg-gray-700 text-white w-full p-4 placeholder-gray-400  [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-transparent dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 resize-none"
                placeholder="How may I help you?"
                disabled={loadingMessageId !== null}
              />
            </div>
          </>
        )}
      </div>

      {/* Add CSS for loading animation */}
      <style jsx>{`
        .loading-dots {
          display: inline-flex;
        }
        
        .dot {
          animation: pulse 1.5s infinite;
          opacity: 0.5;
        }
        
        .dot:nth-child(2) {
          animation-delay: 0.5s;
        }
        
        .dot:nth-child(3) {
          animation-delay: 1s;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}

export default Chatbot
