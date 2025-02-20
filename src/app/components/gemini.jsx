'use client'

import React, { useState } from "react";
const GeminiInput = () => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    setResponse("");
    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });
      const data = await res.json();
      if (res.ok) {
        setResponse(data.output);
      } else {
        setResponse(`Error: ${data.error}`);
      }
    } catch (error) {
      setResponse(`Network Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      {" "}
      <h2>Gemini Input</h2>{" "}
      <form onSubmit={handleSubmit}>
        {" "}
        <label htmlFor="geminiInput">Enter text:</label>{" "}
        <input
          type="text"
          id="geminiInput"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />{" "}
        <button type="submit" disabled={loading}>
          {" "}
          {loading ? "Loading..." : "Submit"}{" "}
        </button>{" "}
      </form>{" "}
      {response && (
        <div>
          {" "}
          <h3>Response:</h3> <p>{response}</p>{" "}
        </div>
      )}{" "}
    </div>
  );
};
export default GeminiInput;
