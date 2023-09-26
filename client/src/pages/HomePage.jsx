import React from 'react'
import { Box, Container, Text, Tabs, Tab, TabList, TabPanel, TabPanels } from '@chakra-ui/react';
import Login from '../components/authentication/Login';
import SignUp from '../components/authentication/SignUp';

const HomePage = () => {
  return (
    <Container maxW='xl' centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg="black"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
        textAlign="center"
      >
        <Text fontSize="4xl" fontFamily="work sans">BakBak - A Live Chat App</Text>
      </Box>

      <Box w="100%" p={4} borderRadius="lg" borderWidth="1px" bg="black">
        <Tabs variant='soft-rounded' colorScheme='red'>
          <TabList mb="1em">
            <Tab color="white" width="50%">Login</Tab>
            <Tab color="white" width="50%">Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login/>
            </TabPanel>
            <TabPanel>
              <SignUp/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default HomePage
