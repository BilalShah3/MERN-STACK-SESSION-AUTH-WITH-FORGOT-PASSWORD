import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import{regexPassword} from '../utils/password-regex'
import { useState,useEffect, useContext } from "react";
import {ToastContainer,toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useParams, useNavigate,Link } from 'react-router-dom';
import { CircularProgress } from "@mui/material";

const defaultTheme = createTheme();

export default function PasswordReset() {
  const history = useNavigate()
  const {id,token}=useParams()
  const [data2,setData] = useState(false)
  const [message,setMessage] = useState(false)
  const [values, setValues] = useState({
   password:''
  })
  const [errors, setErrors] = useState({
   password:false
  })

  const handleChange = (fieldName)=>(event)=>{
   const currValue=event.target.value

   let isCorrectValue = fieldName === 'password' && regexPassword.test(currValue)

    isCorrectValue?setErrors({...errors,[fieldName]:false}):setErrors({...errors,[fieldName]:true})
    setValues({...values,[fieldName]:event.target.value})
  }
  
  const validLink = async()=>{
    try {
      const res = await fetch(`/api/resetpassword/${id}/${token}`,{
        method:'GET',
        headers:{
          'Content-Type':'application/json',
        },
      })
      if(!res.ok){
        history("*")
      }
      const data = await res.json()
      if(data.status==201){
        console.log("link valid", data.msg)
      }
      return
    } catch (error) {
      console.log("there was a problem with a server")
    }
  }

  const setPassword=async (event)=>{
    event.preventDefault()
    if(values.password === ""){
      toast.error('password is required',{
        position:'top-center'
      })
      return
    }
    try {
      const res = await fetch(`/api/${id}/${token}`,{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
        },
        body:JSON.stringify({
          password: values.password,
        })
      })
      if(!res.ok){
        const error = await res.json()
        toast.error(`Token Expired generate new token ${error.msg}`,{
          position:'top-center'
        })
        setMessage(true)
        return
      }
      const data = await res.json()
      if(data.status==201){
        setValues({
          password:''
        })
        toast.success(`${data.msg}`,{
          position:'top-center'
        })
      }
      return
    } catch (error) {
      toast.error(`There was a problem with our server, please try again later`,{
        position:'top-center'
      })
      return
    }
  }
  useEffect(()=>{
    setTimeout(()=>{
      validLink()
      setData(true)
    },2000)
  },[])
  return (
    <>
    {
      data2?( 
   <>
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Enter Your New Password
          </Typography>
          {message ? <Link to='/forgotpassword' variant="body2">Go to Forgot Password?</Link>:""}
          <Box component="form" onSubmit={setPassword} noValidate sx={{ mt: 1 }}>
            <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={values.password}
                onChange={handleChange('password')}
                error={errors.password}
                helperText={errors.password && "Password must be 8 characters, have one symbol, 1 uppercase letter, 1 lowercase and 1 digit"}
              />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Reset Password
            </Button>
          </Box>
        </Box>
      </Container>
      <ToastContainer/>
    </ThemeProvider>
    </> ) : <Box sx={{ display: 'flex', justifyContent: "center", alignItems: "center", height: "100vh" }}>
                     Loading... &nbsp;
                     <CircularProgress />
                  </Box>
                 }
      </>
  );
}