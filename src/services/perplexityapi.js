import axios from "axios";

class PerplexityService {
  constructor() {
    this.cache = new Map();
    this.CACHE_DURATION = 24 * 60 * 60 * 1000;
    this.API_URL = import.meta.env.VITE_PERPLEXITY_API_URL;
    this.API_TOKEN = import.meta.env.VITE_PERPLEXITY_TOKEN;

    // Validate API URL and Token
    if (!this.API_URL || !this.API_TOKEN) {
      throw new Error(
        "API URL or Token is not defined in environment variables."
      );
    }
  }

  async makeRequest(prompt, options = {}) {
    try {
      const body = {
        model: "llama-3.1-sonar-small-128k-online",
        messages: [
          {
            role: "system",
            content: "Provide precise and scientific analysis.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.2,
        top_p: 0.9,
        ...options,
      };

      const response = await axios.post(this.API_URL, body, {
        headers: {
          Authorization: `Bearer ${this.API_TOKEN}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      });


      const cleanedResponse = this.cleanResponse(
        response.data.choices[0].message.content
      );
      const parsedResponse = this.parseResponse(cleanedResponse);

      return parsedResponse;
    } catch (error) {
      this.handleError(error);
    }
  }

  generateCacheKey(prompt, options) {
    return JSON.stringify({ prompt, options });
  }

  checkCache(key) {
    const cached = this.cache.get(key);
    if (cached) {
      // Check if the cache is still valid
      if (Date.now() - cached.timestamp < this.CACHE_DURATION) {
        return cached.data;
      }
      // Remove expired cache
      this.cache.delete(key);
    }
    return null;
  }

  cleanResponse(content) {
    return content.replaceAll("```", "").replace(/^json/i, "").trim();
  }

  parseResponse(content) {
    try {
      const parsed = JSON.parse(content);
      this.validateResponse(parsed);
      return parsed;
    } catch (error) {
      console.error("Error parsing response:", error); // Log the error directly
      throw new Error("Failed to parse response"); // Optionally throw an error
    }
  }

  validateResponse(data) {
    if (!data) {
      throw new Error("Empty response");
    }
  }

  handleError(error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error("API Error:", error.response.data);
        throw new Error(
          `API Error: ${error.response.status} - ${
            error.response.data.message || ""
          }`
        );
      } else if (error.request) {
        console.error("No response received");
        throw new Error("No response received from server");
      }
    }
    console.error("Unexpected error:", error);
    throw error;
  }

  async searchInfluencers(options = {}) {
    const prompt = `
      Give me the top 10 health influencers include category, followers and total verified claims include the X username without the @ give me the response in JSON with the next format and do not add anything else to the response
      [
        {
          "name":"influencer name",
          "category":"category",
          "followers":"followers",
          "claims":"total verified claims",
          "x":"x profile username",
          "trustScore": "percentage score"
        }
      ]
    `;

    return this.makeRequest(options.query || prompt, {
      search_domain_filter: ["perplexity.ai"],
      return_images: false,
      return_related_questions: false,
      search_recency_filter: "month",
      top_k: 0,
      stream: false,
      presence_penalty: 0,
      frequency_penalty: 1,
    });
  }

  async searchInfluencerDetails(options) {
    const prompt = `
      Provide detailed analysis for the health influencer ${options.influencerName}. 
      Include:
      - Brief description of the influencer - Verified claims
      - Products
      - Research categories
      - Detailed performance metrics
      - Monetization strategies
      - Influencer's "X" username without the @

      Respond in JSON format with these fields, do not add anything else to the response just the JSON format, nothing else:
      {
        "name": "Influencer Name",
        "xusername": "Influencer X username",
        "description": "Influencer Description",
        "totalClaims": "Number of verified claims",
        "productsPerInfluencer": "Number of recommended products from the influencer",
        "categories": ["Category1", "Category2"],
        "performanceMetrics": {
          "trustScore": "Percentage",
          "revenueEstimate": "Yearly revenue in USD format and 2 decimal places",
          "followers": "Total followers"
        },
        "claims": [
          {
            "claim": "Specific claim description",
            "category": "Research category",
            "verificationStatus": "Verified/Pending/Debunked",
            "sources": ["Research source 1", "Research source 2"],
            "url":"source url",
            "claimtrustScore": "Percentage"
          }
        ],
        "monetizationStrategies": [
          "Strategy 1",
          "Strategy 2"
        ]
      }
    `;

    const response = await this.makeRequest(prompt, {
      search_domain_filter: ["perplexity.ai"],
      return_related_questions: false,
      return_images: false, 
    });
    return response;
  }

  // Method to clear cache
  clearCache() {
    this.cache.clear();
  }

  // Method to get cache statistics
  getCacheStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys()),
    };
  }
}

export const perplexityService = new PerplexityService();