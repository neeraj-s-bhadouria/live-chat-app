import React, { useState } from 'react';
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react';

const SignUp = () => {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [pic, setPic] = useState();
    const [show, setShow] = useState();
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const handleClick = () => setShow(!show);

    const postDetails = (pic) => {
        console.log('pic = '+pic);
        console.log('pic type = '+pic.type);
        setLoading(true);
        if(pic === undefined){
            toast({
                title: "please select an Image!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            return;
        }

        if(pic.type==="image/jpeg" || pic.type==="image/png"){
            const data = new FormData();
            data.append("file", pic);
            data.append("upload_preset", "bakbak");
            data.append("cloud_name", "de6nevd4p");
            fetch("https://api.cloudinary.com/v1_1/de6nevd4p/image/upload", {
                method: "post",
                body: data,
            }).then((res)=> res.json())
            .then(data => {
                setPic(data.url.toString());
                console.log(data.url.toString());
                setLoading(false);
            })
            .catch((err)=> {
                console.log(err);
                setLoading(false);
            });
        } else {
            toast({
                title: "Please select a valid image of jpeg/png",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }
    }
    const submitHandler = () => {}

  return (
    <VStack spacing="5px">
        <FormControl id='name' isRequired>
            <FormLabel>Name</FormLabel>
                <Input 
                    placeholder='Enter your name'
                    onChange={(e) => setName(e.target.value)}
                />
        </FormControl>
        <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input 
                placeholder='Enter your email address'
                onChange={(e) => setEmail(e.target.value)}
            />
        </FormControl>
        <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
                <Input 
                    type={show? 'text' : 'password'}
                    placeholder='Enter your password'
                    onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                    <Button h='1.75rem' size='sm' onClick={handleClick}>
                        {show ? "Hide" : "Show"}
                    </Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>
        <FormControl id="confirm-password" isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup>
                <Input 
                    type={show? 'text' : 'password'}
                    placeholder='Enter your password again'
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                    <Button h='1.75rem' size='sm' onClick={handleClick}>
                        {show ? "Hide" : "Show"}
                    </Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>
        <FormControl id='pic'>
            <FormLabel>Select your display pic</FormLabel>
            <Input 
                type='file'
                p={1.5}
                accept='image/*'
                onChange={(e) => postDetails(e.target.files[0])}
            />
        </FormControl>
        <Button
            colorScheme='blue'
            width='100%'
            style={{ marginTop: 15 }}
            onClick={submitHandler}
            isLoading={loading}
        >
            Sign Up
        </Button>
    </VStack>
  )
}

export default SignUp
