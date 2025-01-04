import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setAddress } from '../store/slices/authSlice'
import { AVALANCHE_TESTNET } from '../config/chains'

export const useCoreWallet = () => {
  const dispatch = useDispatch()

  const connectCoreWallet = async () => {
    if (typeof window.avalanche !== 'undefined') {
      try {
        await window.avalanche.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: AVALANCHE_TESTNET.id }],
        })
        
        const accounts = await window.avalanche.request({
          method: 'eth_requestAccounts',
        })
        dispatch(setAddress(accounts[0]))
      } catch (error) {
        if (error.code === 4902) {
          try {
            await window.avalanche.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: AVALANCHE_TESTNET.id,
                  chainName: AVALANCHE_TESTNET.name,
                  nativeCurrency: AVALANCHE_TESTNET.nativeCurrency,
                  rpcUrls: [AVALANCHE_TESTNET.rpcUrls.default],
                  blockExplorerUrls: [AVALANCHE_TESTNET.blockExplorers.default.url],
                },
              ],
            })
          } catch (addError) {
            console.error('Error adding Avalanche network to Core Wallet:', addError)
          }
        }
        console.error('Error connecting to Core Wallet:', error)
      }
    } else {
      window.open('https://core.app/', '_blank')
    }
  }

  return { connectCoreWallet }
} 