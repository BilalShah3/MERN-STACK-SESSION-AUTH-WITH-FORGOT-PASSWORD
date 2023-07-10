import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useState,useEffect, useContext } from "react";
import {LoginContext} from "../ContextProvider/Context"
import { CircularProgress } from "@mui/material";
import Box from '@mui/material/Box'

const Dashboard = () => {
    const {logindata, setLoginData} = useContext(LoginContext)
    const [data2, setData2] = useState(false)
    
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
              history('*')
          }
         else{
            console.log('user veerify')
            setLoginData(data)
            history('/dashboard')
          }
        } catch (error) {
          console.log('there was an error fetch auth', error)
        }
      }
     
  useEffect(()=>{
    setTimeout(()=>{
      DashBoardValid()
      setData2(true)
    },2000)
  },[])
    return (
        <>
          {

            data2?<div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <img src="./man.png" style={{ width: "200px", marginTop: 20 }} alt="" />
                <h1>User Email:{logindata ? logindata.msg.email : ""}</h1>    
                </div>  
                 :<Box sx={{ display: 'flex', justifyContent: "center", alignItems: "center", height: "100vh" }}>
                    Loading... &nbsp;
                  <CircularProgress />
                </Box>
          }
       
        </>

    )
}

export default Dashboard
