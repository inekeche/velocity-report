import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ExcelUpload from './components/ExcelUpload';
import DashboardSummary from './components/DashboardSummary';

function App() {
  const [reportData, setReportData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showCriteria, setShowCriteria] = useState(false);

  const handleDataProcessed = (response) => {
    setReportData(response);
    setSelectedCategory('All');
  };

  const handleReset = () => {
    setReportData(null);
    setSelectedCategory('All');
    setShowCriteria(false);
  };

  const filteredItems = reportData && reportData.data ? reportData.data.filter(item => {
    if (selectedCategory === 'All') return true;
    return item.category === selectedCategory;
  }) : [];

  const summary = reportData?.summary;
  const total = summary?.totalItems || 1;
  const fastPct = ((summary?.fastMoving || 0) / total) * 100;
  const slowPct = ((summary?.slowMoving || 0) / total) * 100;
  const outPct = ((summary?.outOfStock || 0) / total) * 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Navbar />

      <div style={{ flex: 1, padding: '30px', maxWidth: '1200px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
        
        {/* Dashboard Section */}
        <div id="dashboard">
          <h1 style={{ textAlign: 'center', color: '#0f172a', marginBottom: '10px' }}>Smart AI Velocity Report Dashboard</h1>
          <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '25px' }}>Upload your inventory matrix to get automated AI insights and stock velocity analytics.</p>
          
          <ExcelUpload 
            onDataProcessed={handleDataProcessed} 
            onReset={handleReset} 
            hasData={Boolean(reportData)} 
          />
        </div>

        {reportData && (
          <>
            {/* AI Smart Insights Banner */}
            <div style={aiCardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <span style={{ fontSize: '20px' }}>🧠</span>
                <h3 style={{ margin: 0, color: '#1e3a8a' }}>AI Inventory Health & Recommendations</h3>
              </div>
              <p style={{ margin: '5px 0', fontSize: '14px', color: '#334155' }}>
                <strong>Stock Health Status:</strong> Out of {summary.totalItems} evaluated SKUs, <strong>{summary.outOfStock} items ({outPct.toFixed(1)}%)</strong> are currently out of stock and require urgent replenishment. 
                {summary.fastMoving > summary.slowMoving ? ' Your inventory turnover is strong with high demand velocity on key lines.' : ' Warning: High proportion of slow-moving/non-moving stock detected. Consider running promotional clear-outs.'}
              </p>
            </div>

            {/* Visual Metric Chart Section */}
            <div style={chartContainerStyle}>
              <h3 style={{ marginTop: 0, color: '#1e293b' }}>Metric Breakdown & Distribution</h3>
              <div style={{ display: 'flex', height: '24px', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#e2e8f0', margin: '15px 0' }}>
                <div style={{ width: `${fastPct}%`, backgroundColor: '#16a34a' }} title={`Fast Moving: ${summary.fastMoving}`}></div>
                <div style={{ width: `${slowPct}%`, backgroundColor: '#ea580c' }} title={`Slow Moving: ${summary.slowMoving}`}></div>
                <div style={{ width: `${outPct}%`, backgroundColor: '#dc2626' }} title={`Out of Stock: ${summary.outOfStock}`}></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#475569', flexWrap: 'wrap', gap: '10px' }}>
                <span>🟢 Fast Moving: <strong>{summary.fastMoving}</strong> ({fastPct.toFixed(1)}%)</span>
                <span>🟠 Slow Moving: <strong>{summary.slowMoving}</strong> ({slowPct.toFixed(1)}%)</span>
                <span>🔴 Out of Stock: <strong>{summary.outOfStock}</strong> ({outPct.toFixed(1)}%)</span>
              </div>
            </div>

            {/* Clickable Summary Cards */}
            <DashboardSummary 
              summary={summary} 
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory} 
            />

            {/* Reports / Items List Section */}
            <div id="reports" style={{ marginTop: '40px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h2>Items List ({selectedCategory}) - Showing {filteredItems.length} items</h2>
              </div>
              <div style={{ overflowX: 'auto', maxHeight: '500px', border: '1px solid #cbd5e1', borderRadius: '8px', backgroundColor: '#fff' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead style={{ backgroundColor: '#f1f5f9', position: 'sticky', top: 0, zIndex: 1 }}>
                    <tr>
                      <th style={thStyle}>Description</th>
                      <th style={thStyle}>Start Qty</th>
                      <th style={thStyle}>Total Sold</th>
                      <th style={thStyle}>Closing Qty</th>
                      <th style={thStyle}>Avg Monthly Sales</th>
                      <th style={thStyle}>Category</th>
                      <th style={thStyle}>Forecast / Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={tdStyle}>{item.description}</td>
                        <td style={tdStyle}>{item.startQty}</td>
                        <td style={tdStyle}>{item.totalSold}</td>
                        <td style={tdStyle}>{item.closingQty}</td>
                        <td style={tdStyle}>{item.avgMonthlySales.toFixed(2)}</td>
                        <td style={tdStyle}>
                          <span style={badgeStyle(item.category)}>{item.category}</span>
                        </td>
                        <td style={{ ...tdStyle, fontWeight: 'bold' }}>{item.forecast}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Settings & Calculation Criteria Section */}
            <div id="settings" style={{ marginTop: '50px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <h2>Settings & Calculation Criteria</h2>
                <button 
                  onClick={() => setShowCriteria(!showCriteria)}
                  style={buttonStyle}
                >
                  {showCriteria ? 'Hide Calculation Rules' : 'View Calculation Rules'}
                </button>
              </div>

              {showCriteria && (
                <div style={criteriaBoxStyle}>
                  <h3>Inventory Logic & Formulas</h3>
                  <ul>
                    <li><strong>Total Items:</strong> Total count of valid inventory SKUs processed.</li>
                    <li><strong>Total Sales (Qty):</strong> Sum of Total Sold (Qty.) across all evaluated items.</li>
                    <li><strong>Stock Balance (Qty):</strong> Sum of Closing Qty. currently available in inventory.</li>
                    <li><strong>Fast Moving:</strong> Items where Total Sold &gt; 10 OR average monthly sales exceed 1 unit. <em>Forecast: Increase Order Qty.</em></li>
                    <li><strong>Slow Moving:</strong> Items with Total Sold equal to 0 over the review window. <em>Forecast: Reduce / Consider Write-off.</em></li>
                    <li><strong>Out of Stock:</strong> Items where Closing Qty. equals 0. <em>Forecast: URGENT REORDER.</em></li>
                  </ul>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}

// Styles
const buttonStyle = { padding: '10px 15px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };
const aiCardStyle = { background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', padding: '20px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #bfdbfe', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' };
const chartContainerStyle = { background: '#ffffff', padding: '20px', borderRadius: '10px', marginBottom: '25px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' };
const criteriaBoxStyle = { background: '#f1f5f9', padding: '20px', borderRadius: '8px', marginTop: '15px', borderLeft: '5px solid #0284c7' };
const thStyle = { padding: '12px', borderBottom: '2px solid #cbd5e1', fontSize: '14px', color: '#334155' };
const tdStyle = { padding: '10px', fontSize: '13px', color: '#334155' };
const badgeStyle = (cat) => ({
  padding: '4px 8px',
  borderRadius: '4px',
  fontSize: '11px',
  color: '#fff',
  backgroundColor: cat === 'Fast Moving' ? '#16a34a' : cat === 'Out of Stock' ? '#dc2626' : cat === 'Slow Moving / Non-Moving' ? '#ea580c' : '#64748b'
});

export default App;