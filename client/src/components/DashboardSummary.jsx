import React from 'react';

function DashboardSummary({ summary, selectedCategory, onSelectCategory }) {
  if (!summary) return null;

  // Safely fallback to multiple possible key names coming from the backend or parent
  const stockBalanceValue = summary.stockBalanceQty ?? summary.stockBalance ?? summary.totalClosingQty ?? 0;
  const totalSalesValue = summary.totalSalesQty ?? summary.totalSales ?? 0;

  const cards = [
    { label: 'Total Items', value: summary.totalItems, category: 'All', color: '#0284c7' },
    { label: 'Total Sales (Qty)', value: totalSalesValue, category: null, color: '#0f172a' },
    { label: 'Stock Balance (Qty)', value: stockBalanceValue, category: null, color: '#0f172a' },
    { label: 'Fast Moving', value: summary.fastMoving, category: 'Fast Moving', color: '#16a34a' },
    { label: 'Slow Moving', value: summary.slowMoving, category: 'Slow Moving / Non-Moving', color: '#ea580c' },
    { label: 'Normal', value: summary.normal || 0, category: 'Normal', color: '#0284c7' },
    { label: 'Out of Stock', value: summary.outOfStock, category: 'Out of Stock', color: '#dc2626' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px', marginBottom: '30px' }}>
      {cards.map((card, index) => {
        const isSelected = selectedCategory === card.category;
        const isClickable = card.category !== null;

        return (
          <div 
            key={index}
            onClick={() => isClickable && onSelectCategory(card.category)}
            style={{
              background: '#ffffff',
              padding: '20px',
              borderRadius: '10px',
              border: isSelected ? `2px solid ${card.color}` : '1px solid #e2e8f0',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              textAlign: 'center',
              cursor: isClickable ? 'pointer' : 'default',
              transition: 'transform 0.1s ease, box-shadow 0.1s ease',
            }}
          >
            <h4 style={{ margin: '0 0 10px 0', color: '#64748b', fontSize: '14px' }}>{card.label}</h4>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: card.color, marginBottom: isClickable ? '5px' : '0' }}>
              {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
            </div>
            {isClickable && (
              <span style={{ fontSize: '11px', color: '#0284c7', textDecoration: 'underline' }}>
                Click to filter list
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default DashboardSummary;