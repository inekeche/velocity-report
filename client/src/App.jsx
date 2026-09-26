import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ExcelUpload from './components/ExcelUpload';
import DashboardSummary from './components/DashboardSummary';
import Auth from './components/Auth';
import UserProfile from './components/UserProfile';

function App() {
  const [userInfo, setUserInfo] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'reports', 'profile'
  const [reportData, setReportData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showCriteria, setShowCriteria] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('userInfo');
    if (savedUser) {
      setUserInfo(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setUserInfo(null);
    setActiveTab('dashboard');
  };

  const handleDataProcessed = (response) => {
    setReportData(response);
    setSelectedCategory('All');
  };

  const handleReset = () => {
    setReportData(null);
    setSelectedCategory('All');
    setShowCriteria(false);
  };

  if (!userInfo) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        <Navbar />
        <Auth onLoginSuccess={(user) => setUserInfo(user)} />
        <Footer />
      </div>
    );
  }

  const filteredItems = reportData && reportData.data ? reportData.data.filter(item => {
    if (selectedCategory === 'All') return true;
    return item.category === selectedCategory;
  }) : [];

  const summary = reportData?.summary;
  const dataItems = reportData?.data || [];

  const computedFast = dataItems.filter(item => item.category === 'Fast Moving').length;
  const computedSlow = dataItems.filter(item => item.category === 'Slow Moving / Non-Moving').length;
  const computedNormal = dataItems.filter(item => item.category === 'Normal').length;
  const computedOut = dataItems.filter(item => item.category === 'Out of Stock').length;

  const computedStockBalance = dataItems.reduce((acc, item) => acc + (Number(item.closingQty) || 0), 0);
  const computedTotalSales = dataItems.reduce((acc, item) => acc + (Number(item.totalSold) || 0), 0);

  const total = summary?.totalItems || dataItems.length || 1;
  const fastPct = (computedFast / total) * 100;
  const slowPct = (computedSlow / total) * 100;
  const outPct = (computedOut / total) * 100;
  const normalPct = (computedNormal / total) * 100;

  const exportToExcel = () => {
    const dataToExport = filteredItems.map(item => ({
      Description: item.description,
      'Start Qty': item.startQty,
      'Total Sold': item.totalSold,
      'Closing Qty': item.closingQty,
      'Avg Monthly Sales': Number(item.avgMonthlySales.toFixed(2)),
      Category: item.category,
      'Forecast / Action': item.forecast
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Items List');
    XLSX.writeFile(workbook, `Velocity_Report_${selectedCategory.replace(/\s+/g, '_')}.xlsx`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF('landscape');
    doc.setFontSize(16);
    doc.text(`Velocity Report - ${selectedCategory} Items`, 14, 15);
    doc.setFontSize(10);
    doc.text(`Total Records: ${filteredItems.length}`, 14, 22);

    const tableColumn = ["Description", "Start Qty", "Total Sold", "Closing Qty", "Avg Monthly Sales", "Category", "Forecast / Action"];
    const tableRows = filteredItems.map(item => [
      item.description,
      item.startQty,
      item.totalSold,
      item.closingQty,
      item.avgMonthlySales.toFixed(2),
      item.category,
      item.forecast
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 26,
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [2, 132, 199] }
    });

    doc.save(`Velocity_Report_${selectedCategory.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      
      {/* Navbar with Integrated Logout Button */}
      <div style={{ background: '#0f172a', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff', flexWrap: 'wrap', gap: '15px' }}>
        <h3 style={{ margin: 0, cursor: 'pointer' }} onClick={() => setActiveTab('dashboard')}>🚀 Flexzy Smart(AI) Velocity Analytics</h3>
        
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ cursor: 'pointer', color: activeTab === 'dashboard' ? '#38bdf8' : '#cbd5e1' }} onClick={() => setActiveTab('dashboard')}>Dashboard</span>
          <span style={{ cursor: 'pointer', color: activeTab === 'reports' ? '#38bdf8' : '#cbd5e1' }} onClick={() => setActiveTab('reports')}>Reports</span>
          <span style={{ cursor: 'pointer', color: activeTab === 'profile' ? '#38bdf8' : '#cbd5e1', fontWeight: 'bold' }} onClick={() => setActiveTab('profile')}>👤 {userInfo.name}</span>
          <button onClick={handleLogout} style={{ padding: '6px 12px', backgroundColor: '#dc2626', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ flex: 1, padding: '30px', maxWidth: '1200px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
        
        {activeTab === 'profile' ? (
          <UserProfile userInfo={userInfo} onLogout={handleLogout} />
        ) : (
          <>
            <div id="dashboard" style={{ display: activeTab === 'dashboard' ? 'block' : 'none' }}>
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
                <div style={aiCardStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <span style={{ fontSize: '20px' }}>🧠</span>
                    <h3 style={{ margin: 0, color: '#1e3a8a' }}>AI Inventory Health & Recommendations</h3>
                  </div>
                  <p style={{ margin: '5px 0', fontSize: '14px', color: '#334155' }}>
                    <strong>Stock Health Status:</strong> Out of {total} evaluated SKUs, <strong>{computedOut} items ({outPct.toFixed(1)}%)</strong> are currently out of stock and require urgent replenishment. 
                    {computedFast > computedSlow ? ' Your inventory turnover is strong with high demand velocity on key lines.' : ' Warning: High proportion of slow-moving/non-moving stock detected. Consider running promotional clear-outs.'}
                  </p>
                </div>

                <div style={chartContainerStyle}>
                  <h3 style={{ marginTop: 0, color: '#1e293b' }}>Metric Breakdown & Distribution</h3>
                  <div style={{ display: 'flex', height: '24px', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#e2e8f0', margin: '15px 0' }}>
                    <div style={{ width: `${fastPct}%`, backgroundColor: '#16a34a' }} title={`Fast Moving: ${computedFast}`}></div>
                    <div style={{ width: `${slowPct}%`, backgroundColor: '#ea580c' }} title={`Slow Moving: ${computedSlow}`}></div>
                    <div style={{ width: `${normalPct}%`, backgroundColor: '#0284c7' }} title={`Normal: ${computedNormal}`}></div>
                    <div style={{ width: `${outPct}%`, backgroundColor: '#dc2626' }} title={`Out of Stock: ${computedOut}`}></div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#475569', flexWrap: 'wrap', gap: '10px' }}>
                    <span>🟢 Fast Moving: <strong>{computedFast}</strong> ({fastPct.toFixed(1)}%)</span>
                    <span>🟠 Slow Moving: <strong>{computedSlow}</strong> ({slowPct.toFixed(1)}%)</span>
                    <span>🔵 Normal: <strong>{computedNormal}</strong> ({normalPct.toFixed(1)}%)</span>
                    <span>🔴 Out of Stock: <strong>{computedOut}</strong> ({outPct.toFixed(1)}%)</span>
                  </div>
                </div>

                <DashboardSummary 
                  summary={{
                    ...summary,
                    fastMoving: computedFast,
                    slowMoving: computedSlow,
                    normal: computedNormal,
                    outOfStock: computedOut,
                    stockBalance: summary?.stockBalance ?? summary?.totalClosingQty ?? computedStockBalance,
                    totalSales: summary?.totalSales ?? computedTotalSales,
                    totalItems: summary?.totalItems || dataItems.length
                  }} 
                  selectedCategory={selectedCategory}
                  onSelectCategory={(cat) => {
                    setSelectedCategory(cat);
                    setActiveTab('reports');
                  }} 
                />

                <div id="reports" style={{ marginTop: '40px', display: activeTab === 'reports' || activeTab === 'dashboard' ? 'block' : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
                    <h2 style={{ margin: 0 }}>Items List ({selectedCategory}) - Showing {filteredItems.length} items</h2>
                    
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={exportToExcel} style={excelBtnStyle}>📥 Export Excel</button>
                      <button onClick={exportToPDF} style={pdfBtnStyle}>📄 Export PDF</button>
                    </div>
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
                        <li><strong>Normal:</strong> Items with regular, steady turnover that do not meet fast or slow movement thresholds. <em>Forecast: Maintain Stock.</em></li>
                        <li><strong>Out of Stock:</strong> Items where Closing Qty. equals 0. <em>Forecast: URGENT REORDER.</em></li>
                      </ul>
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}

const buttonStyle = { padding: '10px 15px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };
const excelBtnStyle = { padding: '8px 14px', backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' };
const pdfBtnStyle = { padding: '8px 14px', backgroundColor: '#dc2626', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' };
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
  backgroundColor: cat === 'Fast Moving' ? '#16a34a' : cat === 'Out of Stock' ? '#dc2626' : cat === 'Slow Moving / Non-Moving' ? '#ea580c' : cat === 'Normal' ? '#0284c7' : '#64748b'
});

export default App;