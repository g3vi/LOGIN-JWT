const router=require('express').Router()
const User=require('../models/user')
const Joi=require('@hapi/joi')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')

const schemaRegister=Joi.object({
    name:Joi.string().min(6).max(255).required(),
    email:Joi.string().min(6).max(255).required().email(),
    password:Joi.string().min(6).max(1024).required()
})
const schemaLogin=Joi.object({
    email:Joi.string().min(6).max(255).required().email(),
    password:Joi.string().min(6).max(1024).required()
})
// route to users
router.get('/all',async(req,res)=>{
    //const users=await User.find()
    try{
        const users=await User.find()
        res.json({
            error: null,
            data:users
        })
    }catch(error){
        res.status(400).json(error)
    }
})
//
router.post('/register',async(req,res)=>{
    //constatntes para validacion de campos
    const{error}=schemaRegister.validate(req.body)
    if(error){
        return res.status(400).json({
            error:error.details[0].message
        })
    }
    //constante para validacion de email
    const emailExists=await User.findOne({
        email:req.body.email
    })
    if(emailExists){
        return res.status(400).json({
            error:'El correo ya esta registrado'
        })
    }
    //Cifrado de password
    const salt=await bcrypt.genSalt(10)
    const password=await bcrypt.hash(req.body.password,salt)
    const user=new User({
        name:req.body.name,
        email:req.body.email,
        password
    })
    try {
        const savedUser=await user.save()
        res.json({
            error:null,
            data:savedUser
        })
    }catch(error){
        res.status(400).json(error)
    }
})
router.post('/login',async(req,res)=>{
    const{error}=schemaLogin.validate(req.body)
    if(error){
        return res.status(400).json({
            error:error.details[0].message
        })
    }
    const user=await User.findOne({
        email:req.body.email
    })
    if(!user){
        return res.status(400).json({
            error:'Usuario desconocido'
        })
    }
    const validPassword=await bcrypt.compare(req.body.password,user.password)
    if(!validPassword){
        return res.status(400).json({
            error:'Password Incorrecto'
        })
    }
   //Creacion del token
   const token =jwt.sign({
    name: user.name,
    id: user._id
   },process.env.TOKEN_SECRET)
   res.header('auth-token',toekn).json({
    error: null,
    data: {token}
   })
})
module.exports=router