export const BLOCKCHAIN_CONFIG = {
  ADMIN_WALLET: '0x75986CDd4e251a0aADE08ea9A921EE9BA59C0585', 
  PAYMENT_AMOUNT: '0.000',
  
  NETWORKS: {
    ETHEREUM_SEPOLIA: {
      chainId: '0xaa36a7', 
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
  
  DEFAULT_NETWORK: 'ETHEREUM_SEPOLIA' 
};

export const switchToNetwork = async (networkKey) => {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  const network = BLOCKCHAIN_CONFIG.NETWORKS[networkKey];
  if (!network) {
    throw new Error('Invalid network');
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: network.chainId }],
    });
  } catch (switchError) {
    if (switchError.code === 4902) {
      try {
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