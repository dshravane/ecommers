const express = require('express');
const app = express();
const mongoose = require('mongoose');
const {User} = require('./models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const morgan = require('morgan');





mongoose.connect('mongodb://127.0.0.1:27017/ecommercekle')
.then(()=>{
    console.log("DB is connect");
}).catch(()=>{
    console.log("DB is not connect")
})
app.use(cors());
app.use(morgan("dev"));
//for method we use middleware
app.use(express.json())

//task 1-> route for register
app.post('/register',async(req,res)=>{
    
    const {email,password,name}= req.body;

if(!email||!password||!name){
    res.status(400).json({message:"Some fileds are Missing"});

}

//to check user is registe or not
const isUserAlreadyExist =await User.findOne({email});
if(isUserAlreadyExist){
    res.status(400).js({message:"Already have a account"})
    return;

}else{
    //hashing password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword =bcrypt.hashSync(password,salt);
    //generate JWT token
    const token = jwt.sign(email,"supersecret");
    awaitUser.create({
        name:name,
        password:hashedPassword,
        email:email,
        token:token
    });
   return res.status(201).json({message:"User created Succesfully"})
    

}





})
//task 2 ->rout for login
app.post('/login',async(req,res)=>{
    const {email,password} = req.body;
    const user = await User.findOne({email:email});
    if(user){
        //if user exist 
        const isPasswordMatched = bcrypt.compareSync(password,user.password);
        if(isPasswordMatched === true){
         res.status(200).json({
            name: user.name,
            token: user.token,
            email: user.email
         });
        }else{
            res.status(400).json({message:"Password Not matched"});
        }
    } else{
        res.status(400).json({message:"User is Not Registered.Please Register"});
    }
})

let PORT = 8080;
app.listen(PORT,()=>{
    console.log(`server is connected to ${PORT}`);
})
