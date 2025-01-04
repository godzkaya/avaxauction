'use client'
import {
  Box,
  Flex,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Text,
  useColorModeValue
} from '@chakra-ui/react'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import { disconnect } from '../../store/slices/authSlice'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { WalletConnectButton } from '../Wallet/WalletConnectButton'

export function Navbar() {
  const { address, isConnected } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const router = useRouter()
  const bg = useColorModeValue('white', 'gray.800')

  const handleDisconnect = () => {
    dispatch(disconnect())
  }

  return (
    <Box bg={bg} px={4} shadow="sm">
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Text fontSize="xl" fontWeight="bold" cursor="pointer" onClick={() => router.push('/')}>
          Web3 Marketplace
        </Text>

        <Flex alignItems="center" gap={4}>
          {!isConnected && <WalletConnectButton />}
          {isConnected && (
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                variant="ghost"
              >
                <Flex alignItems="center">
                  <Avatar size="sm" mr={2} />
                  <Text isTruncated maxW="150px">
                    {address}
                  </Text>
                </Flex>
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => router.push('/profile')}>
                  My Profile
                </MenuItem>
                <MenuItem onClick={handleDisconnect}>
                  Disconnect
                </MenuItem>
              </MenuList>
            </Menu>
          )}
        </Flex>
      </Flex>
    </Box>
  )
} 