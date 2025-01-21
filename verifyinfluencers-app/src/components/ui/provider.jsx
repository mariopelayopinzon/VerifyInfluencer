import * as Chakra from '@chakra-ui/react'

export function Provider({ children }) {
  return (
    <Chakra.ChakraProvider>
      {children}
    </Chakra.ChakraProvider>
  )
}