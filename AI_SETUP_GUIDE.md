# 🤖 Free AI API Integration Setup

## Overview
This guide helps you set up free AI APIs for advanced NLP features in your job portal:
- **Job Matching**: AI-powered similarity analysis
- **Skill Extraction**: Automatic skill detection from resumes
- **Smart Suggestions**: Personalized job recommendations

## 🚀 Quick Setup

### 1. Choose Your Free AI Service

| Service | Free Tier | Setup Difficulty | Quality |
|---------|-----------|------------------|---------|
| **OpenAI** | $5 credit | ⭐ Easy | ⭐⭐⭐⭐⭐ Excellent |
| **Cohere** | 5 requests/month | ⭐⭐ Medium | ⭐⭐⭐⭐ Good |
| **Hugging Face** | 1000 requests/month | ⭐⭐⭐ Hard | ⭐⭐⭐ Good |

### 2. Setup Instructions

#### **Option 1: OpenAI (Recommended)**
```bash
# 1. Visit https://platform.openai.com/
# 2. Sign up for free account
# 3. Go to API Keys
# 4. Create new API key
# 5. Copy the key
```

**Update config:**
```javascript
// In client/src/config/aiConfig.js
OPENAI: {
  API_KEY: 'sk-your-actual-openai-key-here',
  // ... rest of config
}
```

#### **Option 2: Cohere**
```bash
# 1. Visit https://cohere.ai/
# 2. Sign up for free account
# 3. Go to API Keys
# 4. Create new API key
# 5. Copy the key
```

**Update config:**
```javascript
// In client/src/config/aiConfig.js
COHERE: {
  API_KEY: 'your-actual-cohere-key-here',
  // ... rest of config
}
```

#### **Option 3: Hugging Face**
```bash
# 1. Visit https://huggingface.co/
# 2. Sign up for free account
# 3. Go to Settings > Access Tokens
# 4. Create new token
# 5. Copy the token
```

**Update config:**
```javascript
// In client/src/config/aiConfig.js
HUGGING_FACE: {
  API_KEY: 'hf_your-actual-token-here',
  // ... rest of config
}
```

## 🔧 Configuration

### Update AI Config File
Edit `client/src/config/aiConfig.js`:

```javascript
export const AI_CONFIG = {
  OPENAI: {
    API_KEY: 'YOUR_ACTUAL_OPENAI_KEY', // Replace this
    // ... rest unchanged
  },
  COHERE: {
    API_KEY: 'YOUR_ACTUAL_COHERE_KEY', // Replace this
    // ... rest unchanged
  },
  HUGGING_FACE: {
    API_KEY: 'YOUR_ACTUAL_HF_TOKEN', // Replace this
    // ... rest unchanged
  }
};
```

## 🧪 Testing the AI Features

### 1. Test Job Matching
```javascript
// The AI will automatically try services in order:
// 1. OpenAI (if configured)
// 2. Cohere (if configured)
// 3. Hugging Face (if configured)
// 4. Fallback to local algorithm
```

### 2. Test Skill Extraction
```javascript
// Upload a resume or paste text
// AI will extract skills using:
// - OpenAI GPT-3.5 for understanding
// - Cohere for text generation
// - Hugging Face for local processing
```

### 3. Test Smart Suggestions
```javascript
// AI analyzes user profile and available jobs
// Uses multiple similarity algorithms:
// - TF-IDF vectorization
// - Cosine similarity
// - Semantic analysis
```

## 💰 Cost Breakdown

### **OpenAI (Recommended)**
- **Free Tier**: $5 credit (≈ 5000 requests)
- **Cost**: $0.002 per 1K tokens
- **Monthly Cost**: ~$0-5 for typical usage

### **Cohere**
- **Free Tier**: 5 requests/month
- **Cost**: $0.15 per request
- **Monthly Cost**: $0-15 for typical usage

### **Hugging Face**
- **Free Tier**: 1000 requests/month
- **Cost**: $0 for most models
- **Monthly Cost**: $0

## 🛡️ Security Best Practices

### **API Key Security**
1. **Never commit API keys** to version control
2. **Use environment variables** in production
3. **Rotate keys** regularly
4. **Monitor usage** to avoid unexpected charges

### **Environment Variables (Production)**
```bash
# .env file
REACT_APP_OPENAI_API_KEY=sk-your-key
REACT_APP_COHERE_API_KEY=your-key
REACT_APP_HUGGING_FACE_TOKEN=hf-your-token
```

## 🔄 Fallback Strategy

The system uses a **multi-tier fallback approach**:

1. **Primary**: OpenAI (best quality)
2. **Secondary**: Cohere (good quality)
3. **Tertiary**: Hugging Face (free)
4. **Fallback**: Local algorithms (no API needed)

## 📊 Performance Comparison

| Feature | OpenAI | Cohere | Hugging Face | Local |
|---------|--------|--------|--------------|-------|
| **Job Matching** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **Skill Extraction** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **Smart Suggestions** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **Cost** | $0-5/month | $0-15/month | $0 | $0 |
| **Setup** | Easy | Medium | Hard | None |

## 🚨 Troubleshooting

### **Common Issues**

1. **"API key not found"**
   - Check if API key is properly set in config
   - Verify key format (starts with `sk-` for OpenAI)

2. **"Rate limit exceeded"**
   - Free tier limits reached
   - Wait for reset or upgrade plan

3. **"Service unavailable"**
   - API service is down
   - System will automatically try next service

### **Debug Mode**
```javascript
// Add to browser console to see API calls
localStorage.setItem('debug_ai', 'true');
```

## ✅ Success Indicators

- ✅ AI job matching shows percentage scores
- ✅ Skill extraction categorizes skills properly
- ✅ Smart suggestions appear with match scores
- ✅ No API errors in browser console

## 🎯 Next Steps

1. **Choose your preferred AI service**
2. **Get free API key** from the service
3. **Update the config file** with your key
4. **Test the features** in your app
5. **Monitor usage** to stay within free limits

Your AI-powered job portal is now ready! 🚀 