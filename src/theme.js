'use client'
import { extendTheme } from '@chakra-ui/react'

export const theme = extendTheme({
  colors: {
    brand: {
      yellow: '#ffe800',
      gray: '#3f475f'
    }
  },
  fonts: {
    body: '"Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
    heading: '"Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif'
  },
  styles: {
    global: {
      body: {
        fontFamily: '"Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif'
      }
    }
  }
})