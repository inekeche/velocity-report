import React, { useState } from 'react';
import axios from 'axios';

const ExcelUpload = ({ onDataProcessed }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Corrected: Axios call is now properly inside the function
      const response = await axios.post('http://localhost:5000/api/velocity/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      onDataProcessed(response.data);
      alert('Analysis complete!');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to analyze file. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpload} style={{ margin: '20px 0' }}>
      <input 
        type="file" 
        onChange={(e) => setFile(e.target.files[0])} 
        disabled={loading}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Analyzing...' : 'Analyze Report'}
      </button>
    </form>
  );
};

export default ExcelUpload;