'use client'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Switch,
  VStack,
  NumberInput,
  NumberInputField,
  useToast,
  Select
} from '@chakra-ui/react'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createProduct } from '../../store/slices/productSlice'

export function CreateProductForm() {
  const [isAuction, setIsAuction] = useState(false)
  const [paymentToken, setPaymentToken] = useState('AVAX')
  const [images, setImages] = useState([])
  const toast = useToast()
  const { address } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    
    const productData = {
      title: formData.get('title'),
      description: formData.get('description'),
      price: formData.get('price'),
      paymentToken: paymentToken,
      quantity: formData.get('quantity'),
      images: images.map(file => URL.createObjectURL(file)),
      sellerId: address,
      isAuction: isAuction,
      auctionStartDate: isAuction ? formData.get('auctionStartDate') : null,
      auctionEndDate: isAuction ? formData.get('auctionEndDate') : null,
      currentBidToken: isAuction ? paymentToken : null,
      status: 'active',
      currentBid: null
    }

    try {
      const result = await dispatch(createProduct(productData)).unwrap()
      toast({
        title: 'Product created.',
        status: 'success',
        duration: 3000,
      })
      e.target.reset()
      setImages([])
      setIsAuction(false)
    } catch (error) {
      console.error('Create product error:', error)
      toast({
        title: 'Error creating product.',
        description: error.message,
        status: 'error',
        duration: 3000,
      })
    }
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    setImages(files)
  }

  return (
    <Box as="form" onSubmit={handleSubmit} maxW="600px" mx="auto" p={6}>
      <VStack spacing={4}>
        <FormControl isRequired>
          <FormLabel>Title</FormLabel>
          <Input name="title" />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Description</FormLabel>
          <Textarea name="description" />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Payment Token</FormLabel>
          <Select
            value={paymentToken}
            onChange={(e) => setPaymentToken(e.target.value)}
          >
            <option value="AVAX">AVAX</option>
            <option value="USDC">USDC</option>
          </Select>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Price ({paymentToken})</FormLabel>
          <NumberInput min={0}>
            <NumberInputField name="price" />
          </NumberInput>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Quantity</FormLabel>
          <NumberInput min={1}>
            <NumberInputField name="quantity" />
          </NumberInput>
        </FormControl>

        <FormControl>
          <FormLabel>Images</FormLabel>
          <Input type="file" multiple onChange={handleImageUpload} />
        </FormControl>

        <FormControl display="flex" alignItems="center">
          <FormLabel mb="0">
            Is this an auction?
          </FormLabel>
          <Switch onChange={(e) => setIsAuction(e.target.checked)} />
        </FormControl>

        {isAuction && (
          <>
            <FormControl isRequired>
              <FormLabel>Auction Start Date</FormLabel>
              <Input type="datetime-local" name="auctionStartDate" />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Auction End Date</FormLabel>
              <Input type="datetime-local" name="auctionEndDate" />
            </FormControl>
          </>
        )}

        <Button type="submit" colorScheme="blue" w="full">
          Create Product
        </Button>
      </VStack>
    </Box>
  )
} 