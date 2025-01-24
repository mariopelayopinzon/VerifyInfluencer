import React, { useState, useEffect } from "react";
import { useInfluencerContext } from "../../Context/InfluencerContext";
import "../InfluencerPage/InfluencerPage.css";
import "boxicons";
import axios from "axios";
import userimage from "../../assets/usuario.png";

const InfluencerPage = () => {
  const ctx = useInfluencerContext();
  const [profilePhotoUrl, setProfilePhotoUrl] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredClaims, setFilteredClaims] = useState([]);

  // Use Twitter API SDK to fetch profile photo
  const fetchProfilePhoto = async () => {
    try {
      const username = ctx.state.currentInfluencer.xusername;

      const BEARER_TOKEN = import.meta.env.VITE_TWITTER_BEARER_TOKEN;
      const url = `/twitter-api/2/users/by/username/${username}?user.fields=profile_image_url`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`, // Autenticación
          "Content-Type": "application/json", // Opcional
        },
      });
     

      setProfilePhotoUrl(response.data.data.profile_image_url);
    } catch (error) {
      console.error("Error fetching profile photo:", error);
    }
  };

  // Fetch profile photo when component mounts or currentInfluencer changes
  useEffect(() => {
    if (!profilePhotoUrl) fetchProfilePhoto();
  }, [profilePhotoUrl]);
  //ctx.state.currentInfluencer
  const influencerDetails = {
     ...ctx.state.currentInfluencer,
  };

  const handleSearchClaims = () => {
    if (!influencerDetails) return;

    const filtered = influencerDetails.claims.filter(
      (claim) =>
        claim.claim.toLowerCase().includes(searchQuery.toLowerCase()) ||
        claim.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredClaims(filtered);
  };

  return (
    <div className="influencerPage-container">
      <div className="influencerPage-header">
        <div className="influencer-container">
          <div className="influencer-image">
            <img
              src={profilePhotoUrl || userimage}
              alt={`${influencerDetails.name} profile`}
            />
          </div>
          <div className="influencer-header">
            <h1 className="influencer-name">{influencerDetails.name}</h1>
            <div>
              <p className="influencer-description">
                {influencerDetails.description}
              </p>
            </div>
            <div className="influencer-categories">
              {influencerDetails.categories.map((category, index) => (
                <span key={index} className="category-tag">
                  {category}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="performance-metrics">
              <div className="metric-item">
                <span className="metric-label">Trust Score</span>
                <box-icon name="trending-up" color="teal"></box-icon>
                <span className="metric-value">
                  {influencerDetails.performanceMetrics.trustScore}%
                </span>
                <div>
                  <p>
                    Based on {influencerDetails.totalClaims} verified claims
                  </p>
                </div>
              </div>

              <div className="metric-item">
                <span className="metric-label">Yearly Revenue</span>
                <box-icon name="dollar" color="teal"></box-icon>
                <span className="metric-value">
                  ${influencerDetails.performanceMetrics.revenueEstimate}
                </span>
                <div>
                  <p>Estimated earnings</p>
                </div>
              </div>
              <div className="metric-item">
                <span className="metric-label">Products</span>
                <box-icon name="shopping-bag" color="teal"></box-icon>
                <span className="metric-value">
                  {influencerDetails.productsPerInfluencer}
                </span>
                <div>
                  <p>Recommended Products</p>
                </div>
              </div>
              <div className="metric-item">
                <span className="metric-label">Followers</span>
                <box-icon name="trending-up" color="teal"></box-icon>
                <span className="metric-value">
                  {influencerDetails.performanceMetrics.followers}
                </span>
                <div>
                  <p>Total following</p>
                </div>
              </div>
            </div>

      <div className="mainClaims-content">
        <div className="claims-search-container">
          <input
            type="text"
            className="claims-search-input"
            placeholder="Search claims by keyword or category"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="search-claims-btn" onClick={handleSearchClaims}>
            Search Claims
          </button>
        </div>

        <div className="claims-summary">
          <h2 className="claims-title">Verified Claims</h2>
          <div className="claims-count">
            Total Claims: {influencerDetails.totalClaims}
          </div>

          <div className="claims-list">
            {(filteredClaims.length > 0
              ? filteredClaims
              : influencerDetails.claims
            ).map((claim, index) => (
              <div key={index} className="claim-card">
                <div className="claim-content">
                  <p className="claim-description">{claim.claim}</p>
                  <div className="claim-metadata">
                    <span className="claim-category">{claim.category}</span>
                    <span
                      className={`claim-status ${claim.verificationStatus.toLowerCase()}`}
                    >
                      {claim.verificationStatus}
                    </span>
                  </div>
                </div>
                <div className="claim-actions">
                  <button
                    className="view-details-btn"
                    onClick={() => {
                      window.open(claim.url, "_blank").focus();
                    }}
                  >
                    View Source
                  </button>{" "}
                </div>
                <div className="claim-trustScore">
                  <span className="title-trustScore">Trust Score</span>
                  <span className="percentage-trustScore" data-trustscore='85%'>
                    {claim.claimtrustScore}%
                  </span>
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
