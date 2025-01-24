import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "boxicons";
import "../adminpanel/Adminpanel.css";
import { Switch, Textarea, useToast } from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import Scientificjournals from "../../components/journals.jsx";
import { perplexityService } from "../../services/perplexityapi.js";
import { useInfluencerContext } from "../../Context/InfluencerContext";

const Adminpanel = () => {
  const navigate = useNavigate();
  const { dispatch } = useInfluencerContext();
  const toast = useToast();

  // State to accumulate search information
  const [searchData, setSearchData] = useState([]);
  const [selectedJournals, setSelectedJournals] = useState([]); // State for selected journals
  const [activeButton, setActiveButton] = useState("specific");
  const [timeRange, setTimeRange] = useState("Last Month"); // Manage time range state
  const [results, setResults] = useState([]); // State to store search results
  const [error, setError] = useState(null); // State to manage errors

  const handleNavigation = useCallback((route, buttonType) => {
    setActiveButton(buttonType);
  }, []);

  // Function to add influencer information to the search data
  const addInfluencerInfo = (values) => {
    setSearchData((prevData) => [
      ...prevData,
      {
        name: values.influencerName,
        claimsPerInfluencer: values.claimsPerInfluencer,
        productsPerInfluencer: values.productsPerInfluencer,
        timeRange: values.timeRange,
        includeRevenueAnalysis: values.includeRevenueAnalysis,
        verifyWithScientificJournals: values.verifyWithScientificJournals,
        researchNotes: values.researchNotes,
        journals: selectedJournals, // Include selected journals
      },
    ]);
    toast({
      title: "Influencer Added",
      description: `Influencer ${values.influencerName} added to search.`,
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  // Optimized search function
  const search = useCallback(
    async (data) => {
      dispatch({ type: "FETCH_START" });
      try {
        const searchOptions = {
          influencerName: data.influencerName,
          config: {
            claimsPerInfluencer: data.claimsPerInfluencer,
            productsPerInfluencer: data.productsPerInfluencer,
            timeRange: data.timeRange,
            includeRevenueAnalysis: data.includeRevenueAnalysis,
            verifyWithScientificJournals: data.verifyWithScientificJournals,
            researchNotes: data.researchNotes,
            journals: data.journals, // Include journals in search options
          },
        };

        const results = await perplexityService.searchInfluencerDetails(
          searchOptions
        );

        console.log("resultsxxx", results);

        dispatch({
          type: "SET_CURRENT_INFLUENCER",
          payload: results,
        });

        navigate("/influencer/details");

      } catch (err) {
        const errorMessage = err.message || "An unexpected error occurred";
        dispatch({ type: "FETCH_ERROR", payload: errorMessage });
        toast({
          title: "Search Error",
          description: errorMessage,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setError(errorMessage); // Set the error state
        console.error(err);
      }
    },
    [dispatch, toast, navigate, searchData, activeButton]
  );
  const handleJournalSelection = (selectedJournals) => {
    setSelectedJournals(selectedJournals); // Update selected journals state
  };



  return (
    <Formik
      initialValues={{
        influencerName: "",
        claimsPerInfluencer: 50,
        productsPerInfluencer: 0,
        timeRange: "Last Month",
        includeRevenueAnalysis: false,
        verifyWithScientificJournals: false,
        researchNotes: "",
        journals: [],
      }}
      onSubmit={(values, { setSubmitting }) => {
        console.log(values);
        // addInfluencerInfo(values);
        search(values); // Call search without passing searchData
        // setSubmitting(false);
      }}
    >
      {({
        values,
        handleChange,
        handleSubmit,
        isSubmitting,
        setFieldValue,
      }) => (
        <div className="adminpanel-container">
          <div className="main-content">
          <div className="main-container">
            <div className="research-container">
              <box-icon name="cog" color="teal"></box-icon>
              <h1 className="main-title">Research Configuration</h1>
            </div>
          

          <div className="second-section">
            <div className="contenedor-botones">
              <div>
                <div className="btn-specific">
                  <button
                    type="button" // Set type to button to prevent form submission
                    className={`btn-specific-influencer ${
                      activeButton === "specific" ? "active" : ""
                    }`}
                    onClick={() => {
                      //handleNavigation("influencer", "specific");
                      setActiveButton("specific");
                    }}
                  > Specific Influencer
                    <p className="parrafo-btn">
                      Research a known health influencer by name
                    </p>
                  </button>
                </div>
              </div>

              <div>
                <div className="btn-specific">
                  <button
                    type="button" // Set type to button to prevent form submission
                    className={`btn-discover-new ${
                      activeButton === "discover" ? "active" : ""
                    }`}
                    onClick={() => {
                      //handleNavigation("discover", "discover");
                      setActiveButton("discover");
                    }}
                  > Discover New
                    <p className="parrafo-btn">
                      Find and analyze new health influencers
                    </p>
                  </button>
                </div>
              </div>
            </div>
          </div>

            <Form onSubmit={handleSubmit}>
              <div className="second-section">
                <div className="second-section-container">
                  <div className="timeprogress-tile">
                    <h3 className="title-time">Time Range</h3>
                  </div>
                  <div className="btns-container">
                    {["Last Week", "Last Month", "Last Year", "All Time"].map(
                      (range) => (
                        <button
                          type="button" // Set type to button to prevent form submission
                          key={range}
                          className={`time-btns ${
                            values.timeRange === range ? "active" : ""
                          }`}
                          onClick={() => {
                            //setTimeRange(range)
                            setFieldValue("timeRange", range);
                          }}
                        >
                          {range}
                        </button>
                      )
                    )}
                  </div>

                  <div>
                    <div className="influencer-information">
                      <div className="name-container">
                        <h4 className="influencer-name">Influencer Name</h4>
                        <box-icon name="search" color="white"></box-icon>
                        <Field
                          type="text"
                          className="influencer-input"
                          name="influencerName"
                          placeholder="Enter Influencer name"
                          onChange={handleChange}
                          value={values.influencerName}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="influencer-information">
                    <div className="name-container">
                      <h4 className="influencer-name">
                        Claims to analyze per Influencer
                      </h4>
                      <box-icon name="search" color="white"></box-icon>
                      <Field
                        type="number"
                        className="influencer-input"
                        name="claimsPerInfluencer"
                        placeholder="50"
                        onChange={handleChange}
                        value={values.claimsPerInfluencer}
                      />
                    </div>
                  </div>
                </div>

                <div className="Products-finder">
                  <div className="title-products">
                    <h3 className="h-productsfinder">
                      Products to Find Per Influencer
                    </h3>
                  </div>
                  <Field
                    className="research-input"
                    type="number"
                    name="productsPerInfluencer"
                    value={values.productsPerInfluencer}
                    onChange={handleChange}
                  />
                  <label className="skip-research" htmlFor="input">
                    Set to 0 to skip research
                  </label>

                  <div className="Analysis-container">
                    <h4 className="heading-analysis">
                      Include Revenue Analysis
                    </h4>
                    <p className="p-analysis">
                      Analyze monetization methods and estimate earnings
                    </p>
                    <Switch
                      colorScheme="green"
                      isChecked={values.includeRevenueAnalysis}
                      onChange={() =>
                        handleChange({
                          target: {
                            name: "includeRevenueAnalysis",
                            value: !values.includeRevenueAnalysis,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="Analysis-container">
                    <h4 className="heading-analysis">
                      Verify with Scientific Journals
                    </h4>
                    <p className="p-analysis">
                      Cross-reference claims with scientific literature
                    </p>
                    <Switch
                      colorScheme="green"
                      isChecked={values.verifyWithScientificJournals}
                      onChange={() =>
                        handleChange({
                          target: {
                            name: "verifyWithScientificJournals",
                            value: !values.verifyWithScientificJournals,

                          },
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="section-journals">
                <Scientificjournals
                  onJournalSelect={(data) => {
                    console.log("ss", data);
                    setFieldValue("journals", data);
                  }}
                />
              </div>

              <footer>
                <div className="footer-container">
                  <h5 className="footer-heading">
                    Notes for Research Assistant
                  </h5>
                  <Textarea
                    color="white"
                    value={values.researchNotes}
                    onChange={handleChange}
                    name="researchNotes"
                  />
                </div>
                <div className="btn-container">
                  <button
                    className="action-btn"
                    type="submit" // Only the Start Research button is a submit button
                  >
                    {isSubmitting ? "Searching ..." : "+ Start Research"}
                  </button>
                  </div>
              </footer>
            </Form>
          </div>

          <div className="results-container">
            {results.length > 0 && (
              <div className="results">
                <h2>Search Results</h2>
                {results.map((result, index) => (
                  <div key={index} className="result-item">
                    <h3>{result.name}</h3>
                    <p>Total Claims: {result.totalClaims}</p>
                    <p>Categories: {result.categories.join(", ")}</p>
                    <p> Trust Score: {result.performanceMetrics.trustScore}%</p>
                    <p>
                      Revenue Estimate: $
                      {result.performanceMetrics.revenueEstimate}
                    </p>
                    <p>Followers: {result.performanceMetrics.followers}</p>
                    <h4>Claims:</h4>
                    <ul>
                      {result.claims.map((claim, claimIndex) => (
                        <li key={claimIndex}>
                          <strong>{claim.claim}</strong> -{" "}
                          {claim.verificationStatus} (Sources:{" "}
                          {claim.sources.join(", ")})
                        </li>
                      ))}
                    </ul>
                    <h4>Monetization Strategies:</h4>
                    <ul>
                      {result.monetizationStrategies.map(
                        (strategy, strategyIndex) => (
                          <li key={strategyIndex}>{strategy}</li>
                        )
                      )}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
          </div>
        </div>
      )}
    </Formik>
  );
};

export default Adminpanel;
