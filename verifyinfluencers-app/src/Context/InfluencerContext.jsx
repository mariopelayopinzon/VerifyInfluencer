import React, { createContext, useReducer, useContext } from 'react'; 

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
  
    return (
      <InfluencerContext.Provider value={{ state, dispatch }}>
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