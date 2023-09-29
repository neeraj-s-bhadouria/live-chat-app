import React, { useState } from 'react';
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [pic, setPic] = useState();
    const [showPassword, setShowPassword] = useState();
    const [showConfirmPassword, setShowConfirmPassword] = useState();
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();

    //toggle show/hide button 
    const handleShowPasswordClick = () => setShowPassword(!showPassword);
    const handleShowConfirmPasswordClick = () => setShowConfirmPassword(!showConfirmPassword);

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
    const submitHandler = async() => {
        setLoading(true);
        //validate if the user has passed all the required data in the request
        if(!name || !email || !password || !confirmPassword){
            toast({
                title: "Please provide all the mandatory fields!",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            setLoading(false);
            return;
        } else if(password !== confirmPassword){
            toast({
                title: 'Password and confirm password do not match',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            setLoading(false);
            return;
        }

        //process registration
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            }
            const { data } = await axios.post("/api/user", {name, email, password, pic}, config);
            toast({
                title: 'Registration Successful',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });
            
            localStorage.setItem("userInfo", JSON.stringify(data));

            setLoading(false);
            navigate("/chat");
        } catch (error) {
            toast({
                title: "Error Occured",
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: 'true',
                position: 'bottom'
            });
            setLoading(false);
        }
    }

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
                    type={showPassword? 'text' : 'password'}
                    placeholder='Enter your password'
                    onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                    <Button h='1.75rem' size='sm' onClick={handleShowPasswordClick}>
                        {showPassword ? "Hide" : "Show"}
                    </Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>
        <FormControl id="confirm-password" isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup>
                <Input 
                    type={showConfirmPassword? 'text' : 'password'}
                    placeholder='Enter your password again'
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                    <Button h='1.75rem' size='sm' onClick={handleShowConfirmPasswordClick}>
                        {showConfirmPassword ? "Hide" : "Show"}
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
