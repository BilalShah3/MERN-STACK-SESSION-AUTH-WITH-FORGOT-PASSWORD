import Dashboard from "./components/Dashboard";
import './App.css' 
import Error from "./components/Error";
import Header from "./components/Header";
import Footer from './components/Footer';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import PasswordReset from "./components/PasswordReset";
import ForgotPassword from "./components/ForgotPassword";
import { Routes, Route, useNavigate } from "react-router-dom"
import { useState,useEffect, useContext } from "react";
import {LoginContext} from "./ContextProvider/Context"
import { CircularProgress } from "@mui/material";
import Box from '@mui/material/Box'

function App() {

  const [data, setData] = useState(false)
  const {logindata, setLoginData} = useContext(LoginContext)
  const history = useNavigate()

  const DashBoardValid = async()=>{
    try {
      const res = await fetch('/api/isAuth',{
        method:'GET',
        headers:{
          'Content-Type':'application/json',
        },
      })
      const data = await res.json()
      if (data.status==401 || !data){
        console.log('user not valid')
      }
      if(data.status==201){
        console.log('user veerify')
        setLoginData(data)
        history('/dashboard')
      }
    } catch (error) {
      console.log('there was an error fetch auth', error)
      return
    }
  }

  useEffect(()=>{
    setTimeout(()=>{
      DashBoardValid()
      setData(true)
    },2000)
  },[])
  
  return (
    <>
      {
        data?(
          <>
              <Header/>
                <Routes>
                  <Route path="/" element={<SignIn />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/forgotpassword" element={<ForgotPassword />} />
                  <Route path="/resetpassword/:id/:token" element={<PasswordReset />} />
                  <Route path="*" element={<Error />} />
                </Routes>
              <Footer/>
          </>) : <Box sx={{ display: 'flex', justifyContent: "center", alignItems: "center", height: "100vh" }}>
                     Loading... &nbsp;
                     <CircularProgress />
                  </Box>
                 }
                  </>

      )           
}

export default App
