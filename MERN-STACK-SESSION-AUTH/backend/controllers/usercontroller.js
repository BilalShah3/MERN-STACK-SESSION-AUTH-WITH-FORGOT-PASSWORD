const UserSchema = require('../models/UserSchema')
const bcrypt = require('bcrypt')
const nodemailer = require("nodemailer");
const jwt  = require("jsonwebtoken");
const keysecret = process.env.SECRET_KEY


// email config

const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    service: process.env.SERVICE,
    port: Number(process.env.EMAIL_PORT),
    secure: Boolean(process.env.SECURE),
    auth:{
        user:process.env.EMAIL,
        pass:process.env.PASSWORD
    }
}) 



const signup = async(req, res)=>{
  const { email, password } = req.body

  if (!email || !password)
    return res.status(400).json({ msg: 'Password and email are required' })

  if (password.length < 8) {
    return res
      .status(400)
      .json({ msg: 'Password should be at least 8 characters long'})
  }

  const user = await UserSchema.findOne({ email }) // finding user in db
  if (user) return res.status(400).json({ msg: 'User already exists'})

  const newUser = new UserSchema({ email, password })
  // hasing the password
  bcrypt.hash(password, 7, async (err, hash) => {
    if (err)
      return res.status(400).json({ msg: 'error while saving the password' })

    newUser.password = hash
    const savedUserRes = await newUser.save()

    if (savedUserRes)
      return res.status(201).json({status: 201, msg: 'user is successfully signup' })
  })
}

const login = async(req, res)=>{
    const { email, password } = req.body
  
    if (!email || !password) {
      return res.status(400).json({ msg: 'Password and email are required' })
    }
  
    const user = await UserSchema.findOne({ email: email }) // finding user in db
    if (!user) {
      return res.status(401).json({status: 401, msg: 'Invalid credentials' })
    }
  
    const matchPassword = await bcrypt.compare(password, user.password)
    if (matchPassword) {

      // token generate
      const token = await user.generateAuthtoken();
      // ------- NEW CODE HERE
      // const userSession = {email: user.email,token:token} // creating user session to keep user loggedin also on refresh
      req.session.token = token // attach user session to session object from express-session
  
      return res
        .status(201)
        .json({status:201, msg: 'You have logged in successfully'}) // attach user session id to the response. It will be transfer in the cookies
    } else {
      return res.status(401).json({status: 401, msg: 'Invalid credentials'})
    }
}

const signout = async(req, res)=>{
  try {
        req.rootUser.tokens =  req.rootUser.tokens.filter((curelem)=>{
           return curelem.token !== req.token
        });
        req.session.destroy((error) => {
           if (error) throw error
           res.clearCookie('session-id') // cleaning the cookies from the user session
        })
        console.log('after destroy session')
        console.log('root user',req.rootUser)
        await req.rootUser.save();
       return res.status(201).json({status:201,msg:'Logout Successfully'})

} catch (error) {
    return res.status(401).json({status:401,msg:error})
}
// req.session.destroy((error) => {
//   if (error) throw error

//   res.clearCookie('session-id') // cleaning the cookies from the user session
//   res.status(200).send('Logout Success')
// })
  
}

const isloggedin= async(req, res)=>{
    try {
      const ValidUser = await UserSchema.findOne({_id:req.userId});
      return res.status(201).json({status:201,msg:ValidUser});
  } catch (error) {
     return res.status(401).json({status:401,msg:error});
  }
}
// send email Link For reset Password
const sendpasswordlink = async(req, res)=>{
  const { email } = req.body

  if (!email)
    return res.status(400).json({ msg: 'email is required' })

  const user = await UserSchema.findOne({ email: email }) // finding user in db
   if (!user) {
      return res.status(401).json({status:401, msg: 'invalid user' })
    }
    // token generate for reset password
    const token = jwt.sign({_id:user._id},keysecret,{
      expiresIn:"60s"
    });
    
    const setusertoken = await UserSchema.findByIdAndUpdate({_id:user._id},{verifytoken:token},{new:true});
    
    if(setusertoken){
      const mailOptions = {
          from:process.env.EMAIL,
          to:email,
          subject:"Sending Email For password Reset",
          text:`This Link Valid For 5 MINUTES http://localhost:5173/resetpassword/${user.id}/${setusertoken.verifytoken}`
      }

      transporter.sendMail(mailOptions,(error,info)=>{
        if(error){
           return res.status(401).json({status:401, msg: 'email not send' })
        }else{
            console.log("Email sent",info.response);
           return res.status(201).json({status:201,msg:"Email sent Succsfully"})
        }
      })
    }
}

// verify user for forgot password time
const verifyuserforgotpassword = async(req, res)=>{
    const {id,token} = req.params;

    try{
      const validuser = await UserSchema.findOne({_id:id,verifytoken:token});
        const verifyToken =  jwt.verify(token,keysecret);

        console.log(verifyToken)

    if(validuser && verifyToken._id){
        return res.status(201).json({status:201,msg:"valid user",validuser})
    }else{
       return res.status(401).json({status:401,msg:"Token expires regenerate new token"})
    }
  }
  catch(err){
    res.status(401).send({
      status:401,
      msg:err.name
  })
  }
}

// change password
const changepassword= async(req, res)=>{
    const {id,token} = req.params;

    const {password} = req.body;
  
    try {
        const validuser = await UserSchema.findOne({_id:id,verifytoken:token});
        
        const verifyToken = jwt.verify(token,keysecret);
  
        if(validuser && verifyToken._id){
            const newpassword = await bcrypt.hash(password,7);
  
            const setnewuserpass = await UserSchema.findByIdAndUpdate({_id:id},{password:newpassword});
  
            setnewuserpass.save();
           return res.status(201).json({status:201,msg:"new password created"})
  
        }else{
           return res.status(401).json({status:401,msg:"Token Expired generate new LInk"})
        }
    } catch (error) {
       return res.status(401).json({status:401,msg: error})
    }
}


module.exports={
    signup,
    login,
    signout,
    sendpasswordlink, 
    verifyuserforgotpassword,
    isloggedin,
    changepassword,
}