'use client'
import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
  Image,
  Text,
  HStack
} from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { useMetaMask } from '../../hooks/useMetaMask'
import { useCoreWallet } from '../../hooks/useCoreWallet'

export function WalletConnectButton() {
  const { connectMetaMask } = useMetaMask()
  const { connectCoreWallet } = useCoreWallet()

  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon />}
        colorScheme="blue"
      >
        Connect Wallet
      </MenuButton>
      <MenuList>
        <MenuItem onClick={connectMetaMask}>
          <HStack>
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/512px-MetaMask_Fox.svg.png"
              alt="MetaMask"
              boxSize="24px"
            />
            <Text>MetaMask</Text>
          </HStack>
        </MenuItem>
        <MenuItem onClick={connectCoreWallet}>
          <HStack>
            <Image
              src="https://play-lh.googleusercontent.com/pYXciEtsSzizg_u5BFdNl8GWl1K-5Rjp8X8ltWDE0LXq4NKG-riznMOsfnlYu1sNJw=w240-h480-rw"
              alt="Core Wallet"
              boxSize="24px"
              objectFit="contain"
            />
            <Text>Core Wallet</Text>
          </HStack>
        </MenuItem>
      </MenuList>
    </Menu>
  )
} 