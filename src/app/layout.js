import { Providers } from './providers'
import { ChakraProvider } from '../components/Providers/ChakraProvider'
import { Navbar } from '../components/Navigation/Navbar'

export const metadata = {
  title: 'Web3 Login App',
  description: 'A Web3 application with MetaMask authentication',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>
          <ChakraProvider>
            <Navbar />
            {children}
          </ChakraProvider>
        </Providers>
      </body>
    </html>
  )
} 