'use client'
import {
  Box,
  VStack,
  HStack,
  Text,
  Progress,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Divider
} from '@chakra-ui/react'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { fetchSellerReputation } from '../../store/slices/reputationSlice'

export function SellerProfile({ sellerId }) {
  const dispatch = useDispatch()
  const reputation = useSelector(
    (state) => state.reputation.sellerReputations[sellerId]
  )

  useEffect(() => {
    if (sellerId) {
      dispatch(fetchSellerReputation(sellerId))
    }
  }, [dispatch, sellerId])

  if (!reputation) {
    return <Box>Loading...</Box>
  }

  const reputationColor = 
    reputation.reputationScore >= 80 ? 'green' :
    reputation.reputationScore >= 60 ? 'yellow' :
    'red'

  return (
    <Box p={6} borderWidth="1px" borderRadius="lg">
      <VStack spacing={4} align="stretch">
        <HStack justify="space-between">
          <Text fontSize="xl" fontWeight="bold">
            Seller Profile
          </Text>
          <Badge colorScheme={reputationColor} fontSize="md">
            {reputation.reputationScore}% Reputation
          </Badge>
        </HStack>

        <Progress
          value={reputation.reputationScore}
          colorScheme={reputationColor}
          size="sm"
          borderRadius="full"
        />

        <StatGroup>
          <Stat>
            <StatLabel>Total Sales</StatLabel>
            <StatNumber>{reputation.totalSales}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Positive Reviews</StatLabel>
            <StatNumber>{reputation.positiveReviews}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Negative Reviews</StatLabel>
            <StatNumber>{reputation.negativeReviews}</StatNumber>
          </Stat>
        </StatGroup>

        <Divider />

        <Text fontWeight="bold">Recent Reviews</Text>
        <VStack spacing={3} align="stretch">
          {reputation.reviews.slice(0, 5).map((review) => (
            <Box key={review.id} p={3} borderWidth="1px" borderRadius="md">
              <HStack justify="space-between">
                <Badge colorScheme={review.rating >= 4 ? 'green' : 'red'}>
                  {review.rating}/5
                </Badge>
                <Text fontSize="sm" color="gray.500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </Text>
              </HStack>
              <Text mt={2}>{review.comment}</Text>
            </Box>
          ))}
        </VStack>
      </VStack>
    </Box>
  )
} 