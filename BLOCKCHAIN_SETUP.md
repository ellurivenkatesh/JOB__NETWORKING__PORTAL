# 🔐 Blockchain Payment Integration Setup

## Overview
This integration adds blockchain payment functionality to the job posting system using MetaMask and Ethers.js. Users must pay 0.001 ETH before they can post a job.

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
cd client
npm install ethers@5.7.2
```

### 2. Configure Admin Wallet
Edit `client/src/config/blockchain.js` and replace the `ADMIN_WALLET` address with your actual wallet address:

```javascript
ADMIN_WALLET: 'YOUR_ACTUAL_WALLET_ADDRESS_HERE',
```

### 3. Ethereum Network Setup
The system is configured to use **Ethereum Sepolia Testnet** by default for testing. Users need test ETH for payments.

**For Testing:**
1. The system uses Sepolia testnet by default
2. Visit [Sepolia Faucet](https://sepoliafaucet.com/)
3. Get free test ETH

## 🔧 Configuration Options

### Network Selection
The system is configured to use **Ethereum Sepolia Testnet** only:

- `ETHEREUM_SEPOLIA` - Ethereum Sepolia Testnet (default)

### Payment Amount
Modify `PAYMENT_AMOUNT` in `blockchain.js` to change the required payment:

```javascript
PAYMENT_AMOUNT: '0.001', // Change this value
```

## 🧪 Testing the Integration

### Prerequisites
1. **MetaMask Extension**: Install MetaMask browser extension
2. **Ethereum Network**: MetaMask will automatically connect to Sepolia testnet
3. **ETH Balance**: Users need test ETH for payments (get from Sepolia faucet)

### Test Flow
1. Navigate to "Post a Job" page
2. Click "Connect MetaMask" button
3. Approve the connection in MetaMask
4. Click "Pay 0.001 ETH" button
5. Confirm the transaction in MetaMask
6. Wait for transaction confirmation
7. Fill in job details and submit

## 🔍 Transaction Verification

All transactions are recorded with their hash. You can verify transactions on:
- **Ethereum Sepolia**: https://sepolia.etherscan.io

## 🛡️ Security Features

- **Network Validation**: Automatically switches to correct testnet
- **Transaction Confirmation**: Waits for blockchain confirmation
- **Error Handling**: Comprehensive error messages for users
- **Hash Tracking**: Stores transaction hash with job data

## 📁 File Structure

```
client/src/
├── components/
│   └── BlockchainPayment.jsx    # Payment component
├── config/
│   └── blockchain.js            # Configuration
└── pages/
    └── JobPost.jsx              # Updated job posting page
```

## 🚨 Important Notes

1. **Replace Admin Wallet**: Always replace the example wallet address with your actual address
2. **Test First**: Always test on testnet before mainnet
3. **Gas Fees**: Users need sufficient balance for gas fees
4. **Network Support**: Currently supports Ethereum Sepolia testnet only

## 🔄 Production Deployment

The system is configured for testing with Ethereum Sepolia testnet. For production:
1. Update admin wallet address with your actual Ethereum address
2. Adjust payment amount as needed
3. Consider switching to mainnet for real payments

## 📞 Support

If you encounter issues:
1. Check MetaMask connection
2. Verify network selection (should be Ethereum Sepolia testnet)
3. Ensure sufficient test ETH balance for payment and gas fees
4. Check browser console for errors 