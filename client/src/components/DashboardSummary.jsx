import React from 'react';

const DashboardSummary = ({ summary, selectedCategory, onSelectCategory }) => {
  if (!summary) return null;

  const cards = [
    { label: 'Total Items', key: 'All', value: summary.totalItems, color: '#333' },
    { label: 'Total Sales (Qty)', key: 'AllSales', value: summary.totalSalesQty.toLocaleString(), color: '#333', clickable: false },
    { label: 'Stock Balance (Qty)', key: 'AllStock', value: summary.totalStockQty.toLocaleString(), color: '#333', clickable: false },
    { label: 'Fast Moving', key: 'Fast Moving', value: summary.fastMoving, color: '#2e7d32' },
    { label: 'Slow Moving', key: 'Slow Moving / Non-Moving', value: summary.slowMoving, color: '#ed6c02' },
    { label: 'Out of Stock', key: 'Out of Stock', value: summary.outOfStock, color: '#d32f2f' },
  ];

  return (
    <div style={gridContainerStyle}>
      {cards.map((card, idx) => {
        const isSelected = selectedCategory === card.key;
        return (
          <div 
            key={idx} 
            onClick={() => card.clickable !== false && card.key !== 'AllSales' && card.key !== 'AllStock' ? onSelectCategory(card.key) : onSelectCategory('All')}
            style={{
              ...cardStyle, 
              border: isSelected ? '2px solid #007bff' : '1px solid #ddd',
              backgroundColor: isSelected ? '#f0f8ff' : '#ffffff',
              cursor: card.clickable !== false && card.key !== 'AllSales' && card.key !== 'AllStock' ? 'pointer' : 'default'
            }}
          >
            <h3 style={{ fontSize: '15px', color: '#555', marginBottom: '8px' }}>{card.label}</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: card.color, margin: 0 }}>{card.value}</p>
            {card.clickable !== false && card.key !== 'AllSales' && card.key !== 'AllStock' && (
              <span style={{ fontSize: '11px', color: '#007bff', display: 'block', marginTop: '6px' }}>Click to filter list</span>
            )}
          </div>
        );
      })}
    </div>
  );
};

const gridContainerStyle = { 
  display: 'grid', 
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
  gap: '15px' 
};

const cardStyle = { 
  padding: '15px', 
  borderRadius: '10px', 
  textAlign: 'center',
  boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
  transition: 'all 0.2s ease-in-out'
};

export default DashboardSummary;