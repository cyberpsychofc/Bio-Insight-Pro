import { useState, useRef, useEffect } from "react"
import { Markdown } from "../components/NonMemoizedMarkdown.jsx"
import { Helmet } from "react-helmet"
import { RefreshCcw } from "lucide-react"

const Chatbot = () => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const messagesEndRef = useRef(null)
  const [loadingMessageId, setLoadingMessageId] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
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

  const processStreamResponse = async (reader, decoder, messageId) => {
    let buffer = ""
    let currentMessage = ""
    let streamingStarted = false

    try {
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
            setIsProcessing(false)
            return
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
      handleApiError(err, messageId)
    }
  }

  const handleApiError = (error, messageId) => {
    console.error("Error processing response:", error)
    setMessages((prev) => {
      const updated = [...prev]
      const index = updated.findIndex((msg) => msg.id === messageId)
      if (index !== -1) {
        updated[index] = {
          ...updated[index],
          content: "Oops! Something went wrong. Please try again.",
          isLoading: false,
          error: true,
        }
      }
      return updated
    })
    setLoadingMessageId(null)
    setIsProcessing(false)
  }

  const retryMessage = async (messageId) => {
    // Find the failed message and the preceding user message
    const failedIndex = messages.findIndex((msg) => msg.id === messageId)
    if (failedIndex <= 0) return

    // Get the user message that triggered this response
    const userMessage = messages[failedIndex - 1]
    if (!userMessage || userMessage.role !== "user") return

    // Mark the current message as loading instead of removing it
    setMessages((prev) => {
      const updated = [...prev]
      updated[failedIndex] = {
        ...updated[failedIndex],
        content: "",
        isLoading: true,
        error: false,
      }
      return updated
    })

    setLoadingMessageId(messageId)
    setIsProcessing(true)

    // Create message history for API request (excluding the current message content)
    const messageHistory = messages.slice(0, failedIndex).map((msg) => ({
      role: msg.role,
      content: msg.content,
    }))

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
      await processStreamResponse(reader, decoder, messageId)
    } catch (err) {
      handleApiError(err, messageId)
    }
  }

  const sendApiRequest = async (messageHistory) => {
    const messageId = Date.now() + "-assistant-" + Math.random().toString(36).substring(2, 9)
    const newBotMessage = { id: messageId, role: "assistant", content: "", isLoading: true }

    setMessages((prev) => [...prev, newBotMessage])
    setLoadingMessageId(messageId)
    setIsProcessing(true)

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
      await processStreamResponse(reader, decoder, messageId)
    } catch (err) {
      handleApiError(err, messageId)
    }
  }

  const handleSend = async (e) => {
    if ((e.key === "Enter" && !e.shiftKey && input.trim() !== "") || e.type === "click") {
      if (isProcessing) return

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

      await sendApiRequest(messageHistory)
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div>
      <Helmet>
        <title>IntelliOnco | BioInsightPro</title>
      </Helmet>
      <div className="flex flex-col w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 2xl:px-80 backdrop-blur-sm">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center mt-80">
            <textarea
              rows={4}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleSend}
              className="focus:outline-none text-lg sm:text-xl md:text-2xl rounded-xl opacity-70 bg-gray-700 text-white w-full max-w-3xl p-4 placeholder-gray-400 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-transparent dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 resize-none backdrop-blur-sm"
              placeholder="How may I help you?"
            />
          </div>
        ) : (
          <>
            <div className="max-h-[700px] overflow-auto flex-1 overflow-y-auto mt-4 mb-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-transparent dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 px-0 sm:px-2">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.role === "user" ? "self-end items-end" : "self-start items-start"}`}
                >
                  <div
                    className={`px-3 sm:px-4 py-2 rounded-3xl ${
                      msg.role === "user"
                        ? "bg-cyan-500 text-black break-words max-w-[85%] sm:max-w-[75%] text-base sm:text-lg md:text-xl font-semibold rounded-s-3xl mt-5"
                        : ""
                    }`}
                  >
                    {msg.role === "user" ? (
                      <span>{msg.content}</span>
                    ) : msg.isLoading ? (
                      <div className="flex items-center space-x-2 text-base sm:text-lg md:text-xl">
                        <span>Thinking</span>
                        <span className="loading-dots">
                          <span className="dot">.</span>
                          <span className="dot">.</span>
                          <span className="dot">.</span>
                        </span>
                      </div>
                    ) : (
                      <>
                        <div>
                          {msg.error ? (
                            <div className="flex items-center gap-2">
                              <div className="bg-red-400/20 rounded-xl text-base sm:text-lg md:text-xl font-semibold p-2 border-red-700 border-2">
                                <div className="opacity-100">
                                  <Markdown>{msg.content}</Markdown>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <Markdown>{msg.content}</Markdown>
                          )}
                          <button onClick={() => retryMessage(msg.id)} className="p-2 group" aria-label="Retry">
                            <RefreshCcw className="w-5 h-5 text-white group-hover:text-cyan-500 transition-colors duration-200" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="py-3 sm:py-4 md:py-6 mb-2 sm:mb-4"></div>
            <div className="relative">
              <textarea
                rows={2}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleSend}
                className="focus:outline-none text-base sm:text-lg md:text-xl rounded-xl opacity-70 bg-gray-700 text-white w-full p-3 sm:p-4 placeholder-gray-400 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-transparent dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 resize-none backdrop-blur-sm mb-5 pr-12"
                placeholder="How may I help you?"
                disabled={isProcessing}
              />
            </div>
          </>
        )}

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
    </div>
  )
}

export default Chatbot