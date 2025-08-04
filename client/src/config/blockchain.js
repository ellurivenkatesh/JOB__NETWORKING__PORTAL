// Blockchain Configuration
export const BLOCKCHAIN_CONFIG = {
  // Admin wallet address to receive payments (REPLACE WITH YOUR ACTUAL ADDRESS)
  // Get your address from MetaMask: Open MetaMask → Click account name → Copy address
  ADMIN_WALLET: '0x75986CDd4e251a0aADE08ea9A921EE9BA59C0585', // REPLACE THIS WITH YOUR ADDRESS
  
  // Payment amount in ETH/MATIC
  PAYMENT_AMOUNT: '0.000',
  
  // Network configuration
  NETWORKS: {
    ETHEREUM_SEPOLIA: {
      chainId: '0xaa36a7', // 11155111 in decimal
      chainName: 'Ethereum Sepolia Testnet',
      nativeCurrency: {
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18
      },
      rpcUrls: ['https://sepolia.infura.io/v3/'],
      blockExplorerUrls: ['https://sepolia.etherscan.io']
    }
  },
  
  // Default network to use
  DEFAULT_NETWORK: 'ETHEREUM_SEPOLIA' // Using Sepolia testnet for testing
};

// Helper function to switch network
export const switchToNetwork = async (networkKey) => {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  const network = BLOCKCHAIN_CONFIG.NETWORKS[networkKey];
  if (!network) {
    throw new Error('Invalid network');
  }

  try {
    // First try to switch to the network
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: network.chainId }],
    });
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask
    if (switchError.code === 4902) {
      try {
        // Add the network to MetaMask
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: network.chainId,
            chainName: network.chainName,
            nativeCurrency: network.nativeCurrency,
            rpcUrls: network.rpcUrls,
            blockExplorerUrls: network.blockExplorerUrls
          }],
        });
      } catch (addError) {
        console.error('Add network error:', addError);
        throw new Error(`Failed to add ${network.chainName} to MetaMask. Please add it manually.`);
      }
    } else {
      console.error('Switch network error:', switchError);
      throw new Error(`Failed to switch to ${network.chainName}`);
    }
  }
}; 