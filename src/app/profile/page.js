'use client'
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Heading,
  VStack,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Badge,
  Divider,
  List,
  ListItem
} from '@chakra-ui/react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ProfilePage() {
  const { address, isConnected } = useSelector((state) => state.auth)
  const router = useRouter()

  useEffect(() => {
    if (!isConnected) {
      router.push('/')
    }
  }, [isConnected, router])

  if (!isConnected) return null

  return (
    <Box p={8}>
      <VStack spacing={6} align="stretch">
        <Heading size="lg">My Profile</Heading>
        
        <Card>
          <CardBody>
            <StatGroup>
              <Stat>
                <StatLabel>Wallet Address</StatLabel>
                <StatNumber fontSize="md">{address}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Account Status</StatLabel>
                <StatNumber>
                  <Badge colorScheme="green">Active</Badge>
                </StatNumber>
              </Stat>
            </StatGroup>
          </CardBody>
        </Card>

        <Tabs>
          <TabList>
            <Tab>My Listings</Tab>
            <Tab>Purchase History</Tab>
            <Tab>Auction History</Tab>
            <Tab>Reputation</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <MyListings />
            </TabPanel>
            <TabPanel>
              <PurchaseHistory />
            </TabPanel>
            <TabPanel>
              <AuctionHistory />
            </TabPanel>
            <TabPanel>
              <ReputationDetails />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Box>
  )
}

function MyListings() {
  const products = useSelector((state) => 
    state.products.items.filter(product => product.sellerId === state.auth.address)
  )

  return (
    <SimpleGrid columns={[1, 2, 3]} spacing={6}>
      {products.map(product => (
        <Card key={product.id}>
          <CardBody>
            <VStack align="start" spacing={3}>
              <Text fontWeight="bold">{product.title}</Text>
              <Text>{product.description}</Text>
              <Badge colorScheme={product.isAuction ? "purple" : "green"}>
                {product.isAuction ? "Auction" : "Fixed Price"}
              </Badge>
              <Text>Price: {product.price} ETH</Text>
              <Text>Available: {product.quantity}</Text>
            </VStack>
          </CardBody>
        </Card>
      ))}
    </SimpleGrid>
  )
}

function PurchaseHistory() {
  // Bu kısmı Redux store'a purchase history ekleyerek güncelleyebilirsiniz
  return (
    <List spacing={3}>
      <ListItem>
        <Card>
          <CardBody>
            <Text fontWeight="bold">Purchase #1</Text>
            <Text>Date: {new Date().toLocaleDateString()}</Text>
            <Text>Amount: 0.5 ETH</Text>
            <Badge colorScheme="green">Completed</Badge>
          </CardBody>
        </Card>
      </ListItem>
    </List>
  )
}

function AuctionHistory() {
  return (
    <List spacing={3}>
      <ListItem>
        <Card>
          <CardBody>
            <Text fontWeight="bold">Bid on Product #1</Text>
            <Text>Date: {new Date().toLocaleDateString()}</Text>
            <Text>Bid Amount: 0.3 ETH</Text>
            <Badge colorScheme="yellow">Active</Badge>
          </CardBody>
        </Card>
      </ListItem>
    </List>
  )
}

function ReputationDetails() {
  const { address } = useSelector((state) => state.auth)
  const reputation = useSelector(
    (state) => state.reputation.sellerReputations[address]
  )

  if (!reputation) {
    return <Text>Loading reputation...</Text>
  }

  return (
    <VStack spacing={6} align="stretch">
      <Card>
        <CardBody>
          <StatGroup>
            <Stat>
              <StatLabel>Reputation Score</StatLabel>
              <StatNumber>{reputation.reputationScore}%</StatNumber>
            </Stat>
            <Stat>
              <StatLabel>Total Sales</StatLabel>
              <StatNumber>{reputation.totalSales}</StatNumber>
            </Stat>
            <Stat>
              <StatLabel>Positive Reviews</StatLabel>
              <StatNumber>{reputation.positiveReviews}</StatNumber>
            </Stat>
          </StatGroup>
        </CardBody>
      </Card>

      <Divider />

      <Heading size="md">Recent Reviews</Heading>
      <List spacing={3}>
        {reputation.reviews.map((review) => (
          <ListItem key={review.id}>
            <Card>
              <CardBody>
                <Text>{review.comment}</Text>
                <Badge colorScheme={review.rating >= 4 ? "green" : "red"}>
                  {review.rating}/5
                </Badge>
              </CardBody>
            </Card>
          </ListItem>
        ))}
      </List>
    </VStack>
  )
} 