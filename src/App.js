import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [labels, setLabels] = useState([]);
  const [prompts, setPrompts] = useState([]);
  const [error, setError] = useState(null);

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select an image file to analyze.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "https://scene-variant-generator.herokuapp.com/api/analyze-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      setLabels(response.data.labels);
      setPrompts(response.data.prompts);
      setError(null);
    } catch (error) {
      console.error("Error analyzing image:", error);
      setError("Error analyzing image: " + error.message);
    }
  };

  return (
    <div className="App">
      <h1>Image Recognition and Prompt Generator</h1>
      <form onSubmit={onSubmit}>
        <input type="file" onChange={onFileChange} />
        <button type="submit">Analyze Image</button>
      </form>

      {error && <p className="error">{error}</p>}

      {labels.length > 0 && (
        <div>
          <h2>Labels</h2>
          <ul>
            {labels.map((label, index) => (
              <li key={index}>{label}</li>
            ))}
          </ul>
        </div>
      )}

      {prompts.length > 0 && (
        <div>
          <h2>Prompts</h2>
          <ul>
            {prompts.map((prompt, index) => (
              <li key={index}>{prompt}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
