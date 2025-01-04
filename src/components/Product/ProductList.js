'use client'
import {
  SimpleGrid,
  Box,
  Image,
  Text,
  Badge,
  Button,
  VStack,
  NumberInput,
  NumberInputField,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  useToast,
  Popover,
  PopoverTrigger,
  PopoverContent
} from '@chakra-ui/react'
import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect } from 'react'
import { fetchProducts, placeBid, buyProduct } from '../../store/slices/productSlice'
import { SellerProfile } from '../Seller/SellerProfile'
import { ethers } from 'ethers'
import { getUSDCContract, formatUSDC, parseUSDC } from '../../services/contractHelpers'

export function ProductList() {
  const dispatch = useDispatch()
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [bidAmount, setBidAmount] = useState('')
  const { address } = useSelector((state) => state.auth)
  const { items: products, loading } = useSelector((state) => state.products)

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  const handlePlaceBid = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()

      if (selectedProduct.currentBidToken === 'USDC') {
        const usdcContract = getUSDCContract(signer)
        const bidAmount = parseUSDC(bidAmount)
        
        // Allowance kontrolü
        const allowance = await usdcContract.allowance(address, selectedProduct.sellerId)
        if (allowance < bidAmount) {
          const approveTx = await usdcContract.approve(selectedProduct.sellerId, bidAmount)
          await approveTx.wait()
        }
      } else {
        // AVAX teklifi
        await signer.sendTransaction({
          to: selectedProduct.sellerId,
          value: ethers.parseEther(bidAmount.toString())
        })
      }

      await dispatch(placeBid({
        productId: selectedProduct.id,
        bidAmount: parseFloat(bidAmount)
      })).unwrap()
      
      toast({
        title: 'Bid placed successfully',
        status: 'success',
        duration: 3000,
      })
      onClose()
    } catch (error) {
      toast({
        title: 'Error placing bid',
        description: error.message,
        status: 'error',
        duration: 3000,
      })
    }
  }

  const handleBuyNow = async (product) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()

      if (product.paymentToken === 'USDC') {
        const usdcContract = getUSDCContract(signer)
        const price = parseUSDC(product.price)
        
        // Önce USDC allowance kontrolü
        const allowance = await usdcContract.allowance(address, product.sellerId)
        if (allowance < price) {
          // Approve işlemi
          const approveTx = await usdcContract.approve(product.sellerId, price)
          await approveTx.wait()
        }

        // Transfer işlemi
        const transferTx = await usdcContract.transfer(product.sellerId, price)
        await transferTx.wait()
      } else {
        // AVAX ödemesi
        const tx = await signer.sendTransaction({
          to: product.sellerId,
          value: ethers.parseEther(product.price.toString())
        })
        await tx.wait()
      }

      await dispatch(buyProduct({
        productId: product.id,
        quantity: 1
      })).unwrap()
      
      toast({
        title: 'Purchase successful',
        status: 'success',
        duration: 3000,
      })
    } catch (error) {
      console.error('Purchase error:', error)
      toast({
        title: 'Error making purchase',
        description: error.message,
        status: 'error',
        duration: 3000,
      })
    }
  }

  const openBidModal = (product) => {
    setSelectedProduct(product)
    onOpen()
  }

  // USDC bakiyesini göstermek için yeni bir hook
  const useUSDCBalance = (address) => {
    const [balance, setBalance] = useState(null)

    useEffect(() => {
      const fetchBalance = async () => {
        if (address) {
          try {
            const provider = new ethers.BrowserProvider(window.ethereum)
            const usdcContract = getUSDCContract(provider)
            const balance = await usdcContract.balanceOf(address)
            setBalance(formatUSDC(balance))
          } catch (error) {
            console.error('Error fetching USDC balance:', error)
          }
        }
      }

      fetchBalance()
      const interval = setInterval(fetchBalance, 10000) // 10 saniyede bir güncelle
      return () => clearInterval(interval)
    }, [address])

    return balance
  }

  const usdcBalance = useUSDCBalance(address)

  if (loading) {
    return <Box p={6}>Loading...</Box>
  }

  return (
    <>
      <Box mb={4}>
        <Text>Your USDC Balance: {usdcBalance || '0'} USDC</Text>
      </Box>
      
      <SimpleGrid columns={[1, 2, 3]} spacing={6} p={6}>
        {products.map((product) => (
          <Box 
            key={product.id} 
            borderWidth="1px" 
            borderRadius="lg" 
            overflow="hidden"
          >
            <Image src={product.images[0]} alt={product.title} />
            
            <VStack p={4} align="start" spacing={3}>
              <Text fontSize="xl" fontWeight="bold">{product.title}</Text>
              <Text noOfLines={2}>{product.description}</Text>
              
              <Popover>
                <PopoverTrigger>
                  <Text
                    fontSize="sm"
                    color="blue.500"
                    cursor="pointer"
                    _hover={{ textDecoration: 'underline' }}
                  >
                    View Seller Profile
                  </Text>
                </PopoverTrigger>
                <PopoverContent p={0}>
                  <SellerProfile sellerId={product.sellerId} />
                </PopoverContent>
              </Popover>
              
              {product.isAuction ? (
                <>
                  <Badge colorScheme="purple">Auction</Badge>
                  <Text>Current Bid: {product.currentBid} {product.currentBidToken}</Text>
                  <Text>Ends: {new Date(product.auctionEndDate).toLocaleString()}</Text>
                  <Button 
                    onClick={() => isConnected ? openBidModal(product) : onOpen()} 
                    colorScheme="blue"
                    isDisabled={isConnected && (product.sellerId === address || new Date() > new Date(product.auctionEndDate))}
                    w="full"
                  >
                    {isConnected ? 'Place Bid' : 'Connect Wallet to Bid'}
                  </Button>
                </>
              ) : (
                <>
                  <Badge colorScheme="green">Fixed Price</Badge>
                  <Text>Price: {product.price} {product.paymentToken}</Text>
                  <Button 
                    onClick={() => isConnected ? handleBuyNow(product) : onOpen()}
                    colorScheme="blue"
                    isDisabled={isConnected && (product.sellerId === address || product.quantity === 0)}
                    w="full"
                  >
                    {isConnected ? 'Buy Now' : 'Connect Wallet to Buy'}
                  </Button>
                </>
              )}
              
              <Text fontSize="sm" color="gray.500">
                Available: {product.quantity} units
              </Text>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Place a Bid</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedProduct && (
              <>
                <Text mb={4}>
                  Current Bid: {selectedProduct.currentBid} {selectedProduct.currentBidToken}
                </Text>
                <FormControl>
                  <FormLabel>Your Bid ({selectedProduct.currentBidToken})</FormLabel>
                  <NumberInput
                    min={selectedProduct.currentBid}
                    precision={selectedProduct.currentBidToken === 'USDC' ? 6 : 18}
                    step={selectedProduct.currentBidToken === 'USDC' ? 0.000001 : 0.000000000000000001}
                    value={bidAmount}
                    onChange={(value) => setBidAmount(value)}
                  >
                    <NumberInputField />
                  </NumberInput>
                </FormControl>
                <Button
                  colorScheme="blue"
                  mt={4}
                  onClick={handlePlaceBid}
                  isDisabled={!bidAmount || bidAmount <= selectedProduct.currentBid}
                  w="full"
                >
                  Confirm Bid
                </Button>
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
} 