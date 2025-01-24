import React, { useState, useEffect } from 'react'
import './InfluencerLeaderboard.css'

const generateInfluencerData = () => {
  const healthAreas = [
    'Nutrición', 
    'Fitness', 
    'Salud Mental', 
    'Medicina General', 
    'Nutrición Deportiva',
    'Dermatología'
  ]

  const generateInfluencer = (id) => ({
    id,
    name: `Influencer ${id}`,
    healthArea: healthAreas[Math.floor(Math.random() * healthAreas.length)],
    trustScore: (Math.random() * 100).toFixed(2),
    trend: [
      'Creciente', 
      'Estable', 
      'Decreciente'
    ][Math.floor(Math.random() * 3)],
    followers: Math.floor(Math.random() * 500000),
    verifiedClaims: Math.floor(Math.random() * 10)
  })

  return Array.from({ length: 20 }, (_, i) => generateInfluencer(i + 1))
}

function InfluencerLeaderboard() {
  const [influencers, setInfluencers] = useState([])
  const [sortConfig, setSortConfig] = useState({ 
    key: 'followers', 
    direction: 'descending' 
  })

  useEffect(() => {
    setInfluencers(generateInfluencerData())
  }, [])

  const sortTable = (key) => {
    let direction = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })

    const sortedInfluencers = [...influencers].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1
      if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1
      return 0
    })

    setInfluencers(sortedInfluencers)
  }

  return (
    <div className="container">
      <h1>Ranking de Influencers en Salud</h1>
      <div>
        <table>
          <thead>
            <tr>
              {['Nombre', 'Área de Salud', 'Trust Score', 'Tendencia', 'Seguidores', 'Claims Verificados'].map((header) => (
                <th 
                  key={header}
                  onClick={() => sortTable(header.toLowerCase().replace(/\s/g, ''))}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {influencers.map((influencer, index) => (
              <tr key={influencer.id}>
                <td>
                  <span>{index + 1}. </span>
                  <span>{influencer.name}</span>
                </td>
                <td className="health-area">{influencer.healthArea}</td>
                <td>
                  <div 
                    className={`trust-score ${
                      parseFloat(influencer.trustScore) > 70 
                        ? 'trust-score-high' 
                        : parseFloat(influencer.trustScore) > 40 
                          ? 'trust-score-medium' 
                          : 'trust-score-low'
                    }`}
                  >
                    {influencer.trustScore}%
                  </div>
                </td>
                <td>
                  <span 
                    className={`trend ${
                      influencer.trend === 'Creciente' 
                        ? 'trend-positive' 
                        : influencer.trend === 'Estable' 
                          ? 'trend-neutral' 
                          : 'trend-negative'
                    }`}
                  >
                    {influencer.trend}
                  </span>
                </td>
                <td className="followers">
                  {new Intl.NumberFormat('es-ES').format(influencer.followers)}
                </td>
                <td className="claims">{influencer.verifiedClaims}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default InfluencerLeaderboard