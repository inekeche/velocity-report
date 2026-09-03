import React from 'react';

function UserProfile({ userInfo, onLogout }) {
  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <div style={avatarStyle}>{userInfo.name ? userInfo.name.charAt(0).toUpperCase() : 'U'}</div>
          <h2 style={{ margin: '10px 0 5px 0', color: '#0f172a' }}>{userInfo.name}</h2>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>{userInfo.email}</p>
        </div>

        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={infoRowStyle}>
            <span style={infoLabelStyle}>Company:</span>
            <span style={infoValueStyle}>{userInfo.company || 'Not specified'}</span>
          </div>
          <div style={infoRowStyle}>
            <span style={infoLabelStyle}>Role:</span>
            <span style={infoValueStyle}>{userInfo.role || 'Inventory Manager'}</span>
          </div>
          <div style={infoRowStyle}>
            <span style={infoLabelStyle}>Account ID:</span>
            <span style={infoValueStyle}>{userInfo._id}</span>
          </div>
        </div>

        <button onClick={onLogout} style={logoutBtnStyle}>
          Logout
        </button>
      </div>
    </div>
  );
}

const containerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 20px', minHeight: '70vh' };
const cardStyle = { background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', width: '100%', maxWidth: '450px', border: '1px solid #e2e8f0' };
const avatarStyle = { width: '70px', height: '70px', borderRadius: '50%', backgroundColor: '#0284c7', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 'bold', margin: '0 auto' };
const infoRowStyle = { display: 'flex', justifyContent: 'space-between', fontSize: '14px' };
const infoLabelStyle = { color: '#64748b', fontWeight: '500' };
const infoValueStyle = { color: '#1e293b', fontWeight: '600' };
const logoutBtnStyle = { width: '100%', padding: '12px', backgroundColor: '#dc2626', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', marginTop: '25px' };

export default UserProfile;