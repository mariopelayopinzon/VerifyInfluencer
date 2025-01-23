import React, { createContext, useReducer, useContext } from 'react'; 
import { TwitterApi } from 'twitter-api-v2';

const InfluencerContext = createContext(); 

const initialState = {
    influencers: [], 
    currentInfluencer: null, 
    loading: false, 
    error: null, 
    lastFetched: null,
    filters: {
        category: 'All',
        sortOrder: 'highest'
    }
}; 

const influencerReducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_START': 
            return { 
                ...state, 
                loading: true, 
                error: null 
            };
        case 'FETCH_SUCCESS': 
            return {
                ...state,
                influencers: action.payload,
                loading: false,
                lastFetched: Date.now()
            };
        case 'FETCH_ERROR':
            return { 
                ...state, 
                loading: false, 
                error: action.payload 
            }; 
        case 'SET_CURRENT_INFLUENCER': 
            return { 
                ...state, 
                currentInfluencer: action.payload 
            };
        case 'SET_PROFILE_PHOTO': 
            return {
                ...state, 
                currentInfluencer: state.currentInfluencer
                ? {
                    ...state.currentInfluencer,
                    socialMedia: {
                        ...state.currentInfluencer.socialMedia,
                        profilePhotoUrl: action.payload
                    }
                }
                : state.currentInfluencer
            };  
        case 'SET_FILTERS':
            return {
                ...state,
                filters: {
                    ...state.filters,
                    ...action.payload
                }
            };
        case 'RESET_STATE':
            return initialState;
        default: 
            return state; 
    }
}; 

export const InfluencerProvider = ({ children }) => {
    const [state, dispatch] = useReducer(influencerReducer, initialState);

    const fetchTwitterProfileImage = async (username) => {
        const cleanUsername = String(username)
            .replace('@', '')
            .trim()
            .toLowerCase();

        if (!cleanUsername) {
            console.error('Invalid username');
            return null;
        }

        const requiredEnvVars = [
            'VITE_TWITTER_APP_KEY',
            'VITE_TWITTER_APP_SECRET',
            'VITE_TWITTER_ACCESS_TOKEN',
            'VITE_TWITTER_ACCESS_SECRET'
        ];

        const missingVars = requiredEnvVars.filter(
            varName => !import.meta.env[varName]
        );

        if (missingVars.length > 0) {
            console.error('Missing environment variables:', missingVars);
            return null;
        }

        const client = new TwitterApi({
            appKey: import.meta.env.VITE_TWITTER_APP_KEY,
            appSecret: import.meta.env.VITE_TWITTER_APP_SECRET,
            accessToken: import.meta.env.VITE_TWITTER_ACCESS_TOKEN,
            accessSecret: import.meta.env.VITE_TWITTER_ACCESS_SECRET
        });

        try {
            const user = await client.v2.userByUsername(cleanUsername, {
                'user.fields': ["profile_image_url"]
            });

            if (user.data?.profile_image_url) {
                const profilePhotoUrl = user.data.profile_image_url.replace('_normal', '_400x400');

                dispatch({
                    type: 'SET_PROFILE_PHOTO',
                    payload: profilePhotoUrl
                });

                return profilePhotoUrl;
            }

            return null;
        } catch (error) {
            console.error('Error fetching Twitter profile photo', {
                message: error.message,
                code: error.code,
                stack: error.stack
            });

            return null;
        }
    };

    const contextValue = { 
        state, 
        dispatch,
        fetchTwitterProfileImage
    }; 
  
    return (
      <InfluencerContext.Provider value={contextValue}>
        {children}
      </InfluencerContext.Provider>
    );
};

export const useInfluencerContext = () => {
    const context = useContext(InfluencerContext);
    
    if (context === undefined) {
        throw new Error('useInfluencerContext must be used within an InfluencerProvider');
    }
    
    return context;
}; 