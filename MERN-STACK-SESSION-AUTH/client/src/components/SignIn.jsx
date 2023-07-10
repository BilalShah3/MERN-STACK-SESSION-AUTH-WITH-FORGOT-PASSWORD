import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Link, useNavigate } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import{regexPassword} from '../utils/password-regex'
import validator from 'validator'
import { useState } from 'react';
import {ToastContainer,toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


const defaultTheme = createTheme();

export default function SignIn() {
  const history = useNavigate()
   const [values, setValues] = useState({
    email:'',
    password:''
   })
   const [errors, setErrors] = useState({
    email:false,
    password:false
   })

   const handleChange = (fieldName)=>(event)=>{
    const currValue=event.target.value

    let isCorrectValue = fieldName === 'email' ? validator.isEmail(currValue):regexPassword.test(currValue)

     isCorrectValue? setErrors({...errors,[fieldName]:false}): setErrors({...errors,[fieldName]:true})
     setValues({...values,[fieldName]:event.target.value})
   }

   const signIn = async(event)=>{
    event.preventDefault()
    if(values.email === ""){
      toast.error('email is required',{
        position:'top-center'
      })
      return
    }
    if(values.password === ""){
      toast.error('password is required',{
        position:'top-center'
      })
      return
    }

    try {
      const res = await fetch('/api/login',{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
        },
        body:JSON.stringify({
          email: values.email,
          password: values.password
        })
      })

      if(!res.ok){
        const error = await res.json()
        toast.error(`${error.msg}`,{
          position:'top-center'
        })
        return
      }
      const data = await res.json()
      if(data.status==201){
        toast.success(`${data.msg} , we will redirect you to dashboard`,{
          position:'top-center'
        })
        setTimeout(()=>{
          history('/dashboard')
        },2000)
        setValues({email:'',password:''})
        setErrors({email:false,password:false})
      }
      return
    } catch (error) {
      toast.error(`There was a problem with our server, please try again later`,{
        position:'top-center'
      })
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
            Sign In
          </Typography>
          <Box component="form" noValidate onSubmit={signIn} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  type='email'
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={handleChange('email')}
                  error={errors.email}
                  helperText={errors.email && "Please insert a valid email address"}
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  value={values.password}
                  onChange={handleChange('password')}
                  error={errors.password}
                  helperText={errors.password && "Password must be 8 characters, have one symbol, 1 uppercase letter, 1 lowercase and 1 digit"}
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={errors.email||errors.password}
            >
              Sign In
            </Button>
            <Grid container >
            <Grid item xs>
               <Link to='/forgotpassword' variant="body2">
                  Forgot Password?
               </Link>
             </Grid>
              <Grid item>
                <Link to='/signup' variant="body2">
                 {"Don't have an account? Sign up"} 
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
      <ToastContainer/>
    </ThemeProvider>
  );
}