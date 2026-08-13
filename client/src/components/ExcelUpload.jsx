import React, { useState } from 'react';
import axios from 'axios';

const ExcelUpload = ({ onDataProcessed, onReset, hasData }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select an Excel file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    const API_URL = 'https://velocity-report-production.up.railway.app';

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/velocity/analyze`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onDataProcessed(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to analyze report. Make sure the backend server is running.');
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', margin: '20px 0', flexWrap: 'wrap' }}>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} style={inputStyle} />
      <button onClick={handleUpload} disabled={loading} style={buttonStyle}>
        {loading ? 'Analyzing...' : 'Analyze Report'}
      </button>

      {hasData && (
        <button onClick={() => { setFile(null); onReset(); }} style={resetButtonStyle}>
          🔄 Reset Report
        </button>
      )}

      {error && <p style={{ color: 'red', margin: 0, width: '100%', textAlign: 'center' }}>{error}</p>}
    </div>
  );
};

const inputStyle = { padding: '8px', border: '1px solid #ccc', borderRadius: '4px' };
const buttonStyle = { padding: '10px 20px', backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };
const resetButtonStyle = { padding: '10px 20px', backgroundColor: '#dc2626', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };

export default ExcelUpload;