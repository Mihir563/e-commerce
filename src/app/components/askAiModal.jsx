import { useState } from "react";

const AskAIModal = ({ isOpen, onClose }) => {
  const [aiInput, setAiInput] = useState("");
  const [aiResponse, setAiResponse] = useState("");

  const handleSendToAI = async () => {
    if (!aiInput) return;

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: aiInput }),
      });

      const data = await response.json();
      setAiResponse(data.output);
    } catch (error) {
      console.error("AI Error:", error);
      setAiResponse("Oops! Something went wrong. Try again.");
    }
  };

  if (!isOpen) return null; // Don't render if modal is closed

  return (
    <div className=" inset-0 flex items-center justify-center bg-black bg-opacity-50 ">
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-bold mb-2">Ask AI 🤖</h2>
        <input
          type="text"
          placeholder="What do you need?"
          value={aiInput}
          onChange={(e) => setAiInput(e.target.value)}
          className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSendToAI}
          className="w-full bg-green-600 text-white rounded-lg px-4 py-2 hover:bg-green-500 transition-all"
        >
          Send 🚀
        </button>

        {aiResponse && (
          <div className="mt-3 p-2 bg-gray-800 rounded-lg">{aiResponse}</div>
        )}

        <button
          onClick={onClose}
          className="mt-3 w-full bg-red-600 text-white rounded-lg px-4 py-2 hover:bg-red-500 transition-all"
        >
          Close ❌
        </button>
      </div>
    </div>
  );
};

export default AskAIModal;
