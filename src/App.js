import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageLabels, setImageLabels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const onFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const analyzeImage = async () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await axios.post(
        'https://scene-variant-generator.herokuapp.com/api/analyze-image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setImageLabels(response.data.labels);
    } catch (error) {
      console.error('Error analyzing image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Image Recognition App</h1>
      <input type="file" onChange={onFileChange} />
      <button onClick={analyzeImage} disabled={isLoading || !selectedFile}>
        Analyze Image
      </button>
      {isLoading && <p>Loading...</p>}
      {imageLabels.length > 0 && (
        <div>
          <h2>Image Labels:</h2>
          <ul>
            {imageLabels.map((label, index) => (
              <li key={index}>{label}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
