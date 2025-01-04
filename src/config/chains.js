export const AVALANCHE_MAINNET = {
  id: '0xa86a',
  name: 'Avalanche',
  network: 'avalanche',
  nativeCurrency: {
    name: 'Avalanche',
    symbol: 'AVAX',
    decimals: 18,
  },
  rpcUrls: {
    default: 'https://api.avax.network/ext/bc/C/rpc',
  },
  blockExplorers: {
    default: { name: 'SnowTrace', url: 'https://snowtrace.io' },
  },
  testnet: false,
}

export const AVALANCHE_TESTNET = {
  id: '0xa869',
  name: 'Avalanche Testnet',
  network: 'avalanche-testnet',
  nativeCurrency: {
    name: 'Avalanche',
    symbol: 'AVAX',
    decimals: 18,
  },
  rpcUrls: {
    default: 'https://api.avax-test.network/ext/bc/C/rpc',
  },
  blockExplorers: {
    default: { name: 'SnowTrace', url: 'https://testnet.snowtrace.io' },
  },
  testnet: true,
}

// Avalanche ağındaki USDC token adresi
export const USDC_ADDRESS = {
  mainnet: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
  testnet: '0x5425890298aed601595a70AB815c96711a31Bc65' // Test USDC
} 