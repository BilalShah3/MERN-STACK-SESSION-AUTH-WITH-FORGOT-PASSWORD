import React from 'react';
import Avatar from '@mui/material/Avatar';
import "./header.css"
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate , NavLink } from "react-router-dom"
import "./header.css"
import { useState,useEffect, useContext } from "react";
import {LoginContext} from "../ContextProvider/Context"

const Header = () => {
    const {logindata, setLoginData} = useContext(LoginContext)
    console.log(logindata)
    const history = useNavigate();

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const logoutuser= async ()=>{
      const res = await fetch ('/api/logout', {method:'DELETE'})
      const data = await res.json()
      
      if (data.status==201){
        console.log("user logout")
           setLoginData(false)
           history('/')
        }
        else{
            console.log('error')
        }
    }

    const goDash =()=>{
       history("/dashboard")
    }
    const goError=()=>{
        history("*")
    }


    return (
        <>
            <header>
                <nav>
                    
                    {
                        logindata.msg ? <NavLink to="/dashboard"><h1>HBNS</h1></NavLink>:
                        <NavLink to="/"><h1>HBNS</h1></NavLink>
                    }
                    <div className="avtar">
                        {
                           logindata.msg ? <Avatar style={{ background: "salmon", fontWeight:"bold", textTransform:"capitalize" }} onClick={handleClick} >{logindata.msg.email[0].toUpperCase()}</Avatar>:
                                <Avatar style={{ background: "blue" }} onClick={handleClick} />
                        }

                    </div>

                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        {
                            logindata.msg ?(
                                <div>
                                    <MenuItem onClick={() => {
                                        goDash()
                                        handleClose()
                                    }}>Profile</MenuItem>
                                    <MenuItem onClick={() => {
                                        logoutuser()
                                        handleClose()
                                    }}>Logout</MenuItem>
                               </div>
                            ):(
                             <div>
                                    <MenuItem onClick={() => {
                                        goError()
                                        handleClose()
                                    }}>Profile</MenuItem>
                             </div>
                            )
                        }
                        
                    </Menu>
                </nav>
            </header>
        </>
    )
}

export default Header
