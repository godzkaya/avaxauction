import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setAddress } from '../store/slices/authSlice'
import { AVALANCHE_MAINNET, AVALANCHE_TESTNET } from '../config/chains'

export const useMetaMask = () => {
  const dispatch = useDispatch()

  const switchToAvalanche = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: AVALANCHE_TESTNET.id }], // veya AVALANCHE_MAINNET.id
      })
    } catch (switchError) {
      // Ağ henüz eklenmemişse, ekleyelim
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
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
          console.error('Error adding Avalanche network:', addError)
        }
      }
    }
  }

  const connectMetaMask = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await switchToAvalanche()
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        })
        dispatch(setAddress(accounts[0]))
      } catch (error) {
        console.error('Error connecting to MetaMask', error)
      }
    } else {
      window.open('https://metamask.io/download/', '_blank')
    }
  }

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', (accounts) => {
        dispatch(setAddress(accounts[0]))
      })
      window.ethereum.on('chainChanged', (chainId) => {
        if (chainId !== AVALANCHE_TESTNET.id) {
          switchToAvalanche()
        }
      })
    }
  }, [dispatch])

  return { connectMetaMask }
} 