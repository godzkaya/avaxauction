'use client'
import { Box, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { useSelector } from 'react-redux'
import { CreateProductForm } from '../components/Product/CreateProductForm'
import { ProductList } from '../components/Product/ProductList'

export default function Home() {
  const { isConnected } = useSelector((state) => state.auth)

  return (
    <Box p={4}>
      <Tabs>
        <TabList>
          <Tab>Browse Products</Tab>
          {isConnected && <Tab>Sell Product</Tab>}
        </TabList>

        <TabPanels>
          <TabPanel>
            <ProductList />
          </TabPanel>
          {isConnected && (
            <TabPanel>
              <CreateProductForm />
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
    </Box>
  )
} 