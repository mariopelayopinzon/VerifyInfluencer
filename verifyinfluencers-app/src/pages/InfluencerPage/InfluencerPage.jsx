import React, { useState, useEffect } from 'react';
import '../InfluencerPage/InfluencerPage.css';

const InfluencerPage = () => {
    const [influencerDetails, setInfluencerDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredClaims, setFilteredClaims] = useState([]); // State for filtered claims

    useEffect(() => {
        const fetchInfluencerDetails = () => {
            const storedResults = localStorage.getItem('influencerSearchResults');

            if (storedResults) {
                const parsedResults = JSON.parse(storedResults);
                // Assuming you want to display the first influencer's details
                setInfluencerDetails(parsedResults[0]); // Set the first influencer's details
                setFilteredClaims(parsedResults[0].claims); // Initialize filtered claims
            } else {
                setError('No influencer data found.');
                setLoading(false);
                return;
            }
            setLoading(false);
        };

        fetchInfluencerDetails();
    }, []);

    const handleSearchClaims = () => {
        if (!influencerDetails) return;

        const filtered = influencerDetails.claims.filter(claim =>
            claim.claim.toLowerCase().includes(searchQuery.toLowerCase()) ||
            claim.category.toLowerCase().includes(searchQuery.toLowerCase())
        );

        setFilteredClaims(filtered); // Update the state with filtered claims
    };

    if (loading) return <div className="loading-container">Loading...</div>;
    if (error) return <div className="error-container">Error: {error}</div>;
    if (!influencerDetails) return <div className="no-data-container">No data available</div>;

    return (
        <div className="influencer-container">
            <div className="influencer-header">
                <h1 className="influencer-name">{influencerDetails.name}</h1>

                <div className="influencer-categories">
                    {influencerDetails.categories.map((category, index) => (
                        <span key={index} className="category-tag">{category}</span>
                    ))}
                </div>

                <div className="performance-metrics">
                    <div className="metric-item">
                        <span className="metric-value">{influencerDetails.performanceMetrics.trustScore}</span>
                        <span className="metric-label">Trust Score</span>
                    </div>
                    <div className="metric-item">
                        <span className="metric-value">{influencerDetails.performanceMetrics.revenueEstimate}</span>
                        <span className="metric-label">Yearly Revenue</span>
                    </div>
                    <div className="metric-item">
                        <span className="metric-value">{influencerDetails.performanceMetrics.followers}</span>
                        <span className="metric-label">Followers</span>
                    </div>
                </div>

                <div className="claims-search-container">
                    <input
                        type="text"
                        className="claims-search-input"
                        placeholder="Search claims by keyword or category"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button
                        className="search-claims-btn"
                        onClick={handleSearchClaims}
                    >
                        Search Claims
                    </button>
                </div>

                <div className="claims-summary">
                    <h2 className="claims-title">Verified Claims</h2>
                    <div className="claims-count">
                        Total Claims: {influencerDetails.totalClaims}
                    </div>

                    <div className="claims-list">
                        {(filteredClaims.length > 0 ? filteredClaims : influencerDetails.claims).map((claim, index) => (
                            <div key={index} className="claim-card">
                                <div className="claim-content">
                                    <p className="claim-description">{claim.claim}</p>
                                    <div className="claim-metadata">
                                        <span className="claim-category">{claim.category}</span>
                                        <span className={`claim-status ${claim.verificationStatus.toLowerCase()}`}>
                                            {claim.verificationStatus}
                                        </span>
                                    </div>
                                </div>
                                <div className="claim-actions">
                                    <button className="view-details-btn">View Details</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfluencerPage;