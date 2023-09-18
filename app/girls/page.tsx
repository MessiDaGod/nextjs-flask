import React from 'react';

const columnStyle: React.CSSProperties = {
    overflow: 'auto',
    resize: 'horizontal' as 'horizontal',
    backgroundColor: '#e0e0e0',
    height: '100%',
    width: '30%',
    marginRight: '5px'
};
const Girls = () => {
  return (
    <div style={{ display: 'flex', flex: '0.3', height: '100vh' }}>
      <div style={columnStyle}>
        Left Column
      </div>

      <div style={{ flex: '0.4', backgroundColor: '#c0c0c0' }}>
        {/* Content for the middle column */}
        Middle Column
      </div>

      <div style={{ flex: '0.3', backgroundColor: '#a0a0a0' }}>
        {/* Content for the right column */}
        Right Column
      </div>
    </div>
  );
}

export default Girls;
