import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { BLOCKCHAIN_CONFIG, switchToNetwork } from '../config/blockchain';

const BlockchainPayment = ({ onPaymentSuccess, onPaymentError }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const ADMIN_WALLET = BLOCKCHAIN_CONFIG.ADMIN_WALLET;
  const PAYMENT_AMOUNT = BLOCKCHAIN_CONFIG.PAYMENT_AMOUNT;

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setError('MetaMask is not installed. Please install MetaMask to continue.');
        return;
      }

      await switchToNetwork(BLOCKCHAIN_CONFIG.DEFAULT_NETWORK);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
        setError('');
        setSuccess('Wallet connected successfully!');
      }
    } catch (err) {
      console.error('Wallet connection error:', err);
      
      if (err.message.includes('Failed to add')) {
        setError(`Network connection failed. Please manually add ${BLOCKCHAIN_CONFIG.NETWORKS[BLOCKCHAIN_CONFIG.DEFAULT_NETWORK].chainName} to MetaMask:
        1. Open MetaMask
        2. Click the network dropdown
        3. Select "Add network"
        4. Add the testnet manually
        5. Try connecting again`);
      } else {
        setError('Failed to connect wallet: ' + err.message);
      }
    }
  };

  const processPayment = async () => {
    if (!isConnected) {
      setError('Please connect your wallet first.');
      return;
    }

    setIsProcessing(true);
    setError('');
    setSuccess('');

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      const amountInWei = ethers.utils.parseEther(PAYMENT_AMOUNT);
      
      const tx = {
        to: ADMIN_WALLET,
        value: amountInWei,
        gasLimit: 21000
      };

      const transaction = await signer.sendTransaction(tx);
      
      setSuccess('Payment transaction sent! Waiting for confirmation...');
      
      const receipt = await transaction.wait();
      
      if (receipt.status === 1) {
        setSuccess('Payment successful! Transaction hash: ' + receipt.transactionHash);
        onPaymentSuccess(receipt.transactionHash);
      } else {
        setError('Transaction failed');
        onPaymentError('Transaction failed');
      }
    } catch (err) {
      const errorMsg = err.message || 'Payment failed';
      setError(errorMsg);
      onPaymentError(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setIsConnected(true);
          }
        })
        .catch(console.error);
    }
  }, []);

  return (
    <div className="bg-gray-50 p-6 rounded-lg border">
      <h3 className="text-xl font-semibold mb-4">🔐 Blockchain Payment Required</h3>
      <p className="text-gray-600 mb-4">
        To post a job, you need to pay {PAYMENT_AMOUNT} ETH to cover processing fees.
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      <div className="space-y-3">
        {!isConnected ? (
          <button
            onClick={connectWallet}
            className="w-full bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition-colors"
          >
            🔗 Connect MetaMask
          </button>
        ) : (
          <div className="space-y-3">
            <div className="p-3 bg-green-100 border border-green-400 rounded">
              <p className="text-green-700">
                ✅ Connected: {account.slice(0, 6)}...{account.slice(-4)}
              </p>
            </div>
            
            <button
              onClick={processPayment}
              disabled={isProcessing}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
                         >
               {isProcessing ? 'Processing Payment...' : `💳 Pay ${PAYMENT_AMOUNT} ETH`}
             </button>
          </div>
        )}
      </div>

             <div className="mt-4 text-sm text-gray-500">
         <p>• Make sure you have MetaMask installed</p>
         <p>• Ensure you have sufficient ETH balance for the payment</p>
         <p>• Transaction will be processed on {BLOCKCHAIN_CONFIG.NETWORKS[BLOCKCHAIN_CONFIG.DEFAULT_NETWORK].chainName}</p>
         <p>• Admin wallet: {ADMIN_WALLET.slice(0, 6)}...{ADMIN_WALLET.slice(-4)}</p>
       </div>
    </div>
  );
};

export default BlockchainPayment; 