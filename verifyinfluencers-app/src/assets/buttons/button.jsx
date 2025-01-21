import React, { useState } from 'react';
import '../buttons/AdvanceToggle.css';

const AdvancedToggle = ({ 
  labelOn = 'On', 
  labelOff = 'Off',
  onColor = '#2ecc71',
  offColor = '#e74c3c'
}) => {
  const [isToggled, setIsToggled] = useState(false);

  const toggleStyles = {
    backgroundColor: isToggled ? onColor : offColor
  };

  return (
    <div className="advanced-toggle-wrapper">
      <div 
        className="advanced-toggle"
        style={toggleStyles}
        onClick={() => setIsToggled(!isToggled)}
      >
        <div className={`toggle-slider ${isToggled ? 'toggled' : ''}`}>
          <span className="toggle-label">
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdvancedToggle;