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
import validator from 'validator'
import { useState } from 'react';
import {ToastContainer,toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const defaultTheme = createTheme();

export default function ForgotPassword() {
  
  const [values, setValues] = useState({
    email:'',
   })
   const [errors, setErrors] = useState({
    email:false,
   })

   const handleChange = (fieldName)=>(event)=>{
    const currValue=event.target.value

    let isCorrectValue = fieldName === 'email' && validator.isEmail(currValue)

     isCorrectValue?setErrors({...errors,[fieldName]:false}):setErrors({...errors,[fieldName]:true})
     setValues({...values,[fieldName]:event.target.value})
   }

   const sendLink = async(event)=>{
     event.preventDefault()
     if(values.email === ""){
      toast.error('email is required',{
        position:'top-center'
      })
      return
    }
    try {
      const res = await fetch('/api/sendpasswordlink',{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
        },
        body:JSON.stringify({
          email: values.email,
        })
      })
      const data = await res.json()
      if(data.status==201){
        toast.success(`${data.msg}`,{
          position:'top-center'
        })
        setValues({
          email:''
        })
      }else {
        toast.error(`${data.msg}`,{
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

  return (
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
             Enter Your Email
          </Typography>
          <Box component="form" onSubmit={sendLink} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              type="email"
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={values.email}
              onChange={handleChange('email')}
              error={errors.email}
              helperText={errors.email && "Please insert a valid email address"}
              autoFocus
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Send Link
            </Button>
          </Box>
        </Box>
      </Container>
      <ToastContainer/>
    </ThemeProvider>
  );
}