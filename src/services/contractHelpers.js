import { ethers } from 'ethers'
import { USDC_ABI } from '../contracts/usdcABI'
import { USDC_ADDRESS, AVALANCHE_TESTNET } from '../config/chains'

export const getUSDCContract = (signer) => {
  const usdcAddress = AVALANCHE_TESTNET.testnet ? USDC_ADDRESS.testnet : USDC_ADDRESS.mainnet
  return new ethers.Contract(usdcAddress, USDC_ABI, signer)
}

export const formatUSDC = (amount) => {
  return ethers.formatUnits(amount, 6) // USDC has 6 decimals
}

export const parseUSDC = (amount) => {
  return ethers.parseUnits(amount.toString(), 6)
} 