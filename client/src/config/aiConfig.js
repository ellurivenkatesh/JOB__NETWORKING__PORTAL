// Free AI API Configuration
export const AI_CONFIG = {
  // OpenAI API (Free tier - $5 credit)
  OPENAI: {
    API_KEY: 'YOUR_OPENAI_API_KEY', // Get from https://platform.openai.com/api-keys
    BASE_URL: 'https://api.openai.com/v1',
    MODEL: 'gpt-3.5-turbo',
    FREE_TIER_LIMIT: 5000, // requests per month
    COST_PER_REQUEST: 0.002 // USD per 1K tokens
  },

  // Cohere API (Free tier - 5 requests/month)
  COHERE: {
    API_KEY: 'YOUR_COHERE_API_KEY', // Get from https://cohere.ai/
    BASE_URL: 'https://api.cohere.ai/v1',
    MODEL: 'command',
    FREE_TIER_LIMIT: 5, // requests per month
    COST_PER_REQUEST: 0.15 // USD per request
  },

  // Hugging Face API (Free tier - no limit for some models)
  HUGGING_FACE: {
    API_KEY: 'hf_xxx', // Get from https://huggingface.co/settings/tokens
    BASE_URL: 'https://api-inference.huggingface.co',
    FREE_TIER_LIMIT: 1000, // requests per month
    COST_PER_REQUEST: 0 // Free for most models
  },

  // Alternative: Use local models (no API key needed)
  LOCAL: {
    ENABLED: true,
    MODELS: {
      'sentence-transformers': 'all-MiniLM-L6-v2',
      'text-generation': 'gpt2'
    }
  }
};

// AI Service Priority (tries in order)
export const AI_SERVICE_PRIORITY = [
  'OPENAI',    // Best quality, free tier available
  'COHERE',    // Good quality, limited free tier
  'HUGGING_FACE', // Free, some models available
  'LOCAL'      // Fallback, no API key needed
];

// Get API key for a service
export const getApiKey = (service) => {
  return AI_CONFIG[service]?.API_KEY || '';
};

// Check if service is available
export const isServiceAvailable = (service) => {
  const config = AI_CONFIG[service];
  return config && config.API_KEY && config.API_KEY !== 'YOUR_' + service + '_API_KEY';
};

// Get available services
export const getAvailableServices = () => {
  return AI_SERVICE_PRIORITY.filter(service => isServiceAvailable(service));
};

// Free API Setup Instructions
export const FREE_API_SETUP = {
  OPENAI: {
    steps: [
      '1. Visit https://platform.openai.com/',
      '2. Sign up for a free account',
      '3. Go to API Keys section',
      '4. Create a new API key',
      '5. Copy the key and replace YOUR_OPENAI_API_KEY',
      '6. You get $5 free credit (about 5000 requests)'
    ],
    cost: 'Free tier: $5 credit, then $0.002 per 1K tokens'
  },
  
  COHERE: {
    steps: [
      '1. Visit https://cohere.ai/',
      '2. Sign up for a free account',
      '3. Go to API Keys section',
      '4. Create a new API key',
      '5. Copy the key and replace YOUR_COHERE_API_KEY',
      '6. You get 5 free requests per month'
    ],
    cost: 'Free tier: 5 requests/month, then $0.15 per request'
  },
  
  HUGGING_FACE: {
    steps: [
      '1. Visit https://huggingface.co/',
      '2. Sign up for a free account',
      '3. Go to Settings > Access Tokens',
      '4. Create a new token',
      '5. Copy the token and replace hf_xxx',
      '6. Many models are completely free'
    ],
    cost: 'Free tier: 1000 requests/month, many models free'
  }
}; 