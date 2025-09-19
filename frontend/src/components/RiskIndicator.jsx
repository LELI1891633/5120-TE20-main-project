import React from 'react'

const RiskIndicator = ({ title, score, riskLevel, description }) => {
  return (
    <div className="risk-indicator">
      <div className="risk-header">
        <h4>{title}</h4>
        <span className={`risk-badge ${riskLevel.level.toLowerCase()}`}>
          {riskLevel.icon} {riskLevel.level}
        </span>
      </div>
      
      <div className="risk-score">
        <div className="score-bar">
          <div 
            className="score-fill" 
            style={{ 
              width: `${score}%`,
              backgroundColor: riskLevel.color
            }}
          />
        </div>
        <span className="score-text">{score}%</span>
      </div>
      
      <p className="risk-description">{description}</p>
    </div>
  )
}

export default RiskIndicator

