import React, { useState, useEffect } from 'react'
import '../Leaderboard/leaderboard.css'
import { perplexityService } from '../../services/perplexityapi'
import InfluencerTable from '../../articles/Tables/InfluencerTable.jsx'

const Leaderboard = () => {
  const [influencers, setInfluencers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('highest');

  useEffect(() => {
    const fetchInfluencers = async () => {
      try {
        const storedInfluencers = localStorage.getItem('influencerSearchResults');
        
        if (storedInfluencers) {
          const parsedInfluencers = JSON.parse(storedInfluencers);
          setInfluencers(Array.isArray(parsedInfluencers) ? parsedInfluencers : []);
        } else {
          const results = await perplexityService.searchInfluencers({
            query: 'Top health influencers'
          });
          
          localStorage.setItem('influencerSearchResults', JSON.stringify(results));
          setInfluencers(Array.isArray(results) ? results : []);
        }
        
        setLoading(false);
      } catch (err) {
        setError(err.message || 'An unexpected error occurred');
        setLoading(false);
      }
    };

    fetchInfluencers();
  }, []);

  const filterInfluencersByCategory = () => {
    if (selectedCategory === 'All') return influencers;
    
    return influencers.filter(influencer => 
      influencer.category && 
      influencer.category.toLowerCase() === selectedCategory.toLowerCase()
    );
  };

  const sortInfluencers = (influencerList) => {
    return [...influencerList].sort((a, b) => {
      const trustScoreA = parseFloat(a.trustScore || 0);
      const trustScoreB = parseFloat(b.trustScore || 0);
      
      return sortOrder === 'highest' 
        ? trustScoreB - trustScoreA 
        : trustScoreA - trustScoreB;
    });
  };

  const calculateStats = () => {
    if (influencers.length === 0) {
      return {
        activeInfluencers: 0,
        totalClaims: 0,
        averageTrustScore: '0.0'
      };
    }

    const activeInfluencers = influencers.length;
    const totalClaims = influencers.reduce((sum, influencer) => 
      sum + parseInt(influencer.claims || 0), 0
    );
    const averageTrustScore = influencers.reduce((sum, influencer) => 
      sum + parseFloat(influencer.trustScore || 0), 0
    ) / influencers.length;

    return {
      activeInfluencers,
      totalClaims,
      averageTrustScore: averageTrustScore.toFixed(1)
    };
  };

  const stats = calculateStats();

  if (loading) return <div className="loading-container">Loading...</div>;
  if (error) return <div className="error-container">Error: {error}</div>;

  const filteredAndSortedInfluencers = sortInfluencers(filterInfluencersByCategory());

  return (
    <>
      <header className='header-container'>
        <div className='header'>
          <h1 className='header-title'>Influencer Trust Leaderboard</h1>
          <p className='p-header'>
            Real-time ranking of health influencers based on scientific accuracy, 
            credibility, and transparency. Updated daily using AI-powered analysis.
          </p>
        </div>
      </header>

      <main>
        <div className='threebox-container'>
          <div className='boxes'>
            <box-icon name='user' color='green'></box-icon>
            <h2 className='numbers-information'>{stats.activeInfluencers}</h2>
            <p className='p-information'>Active Influencers</p>
          </div>
          <div className='boxes'>
            <box-icon name='check-circle' color='green'></box-icon>
            <h2 className='numbers-information'>{stats.totalClaims}</h2>
            <p className='p-information'>Claims Verified</p>
          </div>
          <div className='boxes'>
            <box-icon type='solid' name='bar-chart-alt-2' color='green'></box-icon>
            <h2 className='numbers-information'>{stats.averageTrustScore}%</h2>
            <p className='p-information'>Average Trust Score</p>
          </div>
        </div>

        <div className='navigation-btns'>
          <div className='btns-container'>
            {['All', 'Nutrition', 'Fitness', 'Medicine', 'Mental Health'].map(category => (
              <button 
                key={category}
                className={`btns-type ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}

            <div className='toggleButton-container'>
              <button 
                className='highest-first'
                onClick={() => setSortOrder(sortOrder === 'highest' ? 'lowest' : 'highest')}
              >
                {sortOrder === 'highest' ? 'Highest First' : 'Lowest First'}
              </button>
            </div>
          </div>
          
          <div>
            <InfluencerTable 
              influencers={filteredAndSortedInfluencers} 
            />
          </div>
        </div>
      </main>
    </>
  )
}

export default Leaderboard