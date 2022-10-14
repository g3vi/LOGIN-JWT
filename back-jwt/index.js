const express=require('express')
const mongoose=require('mongoose')
const bodyparser=require('body-parser')
const cors = require('cors')
require('dotenv').config()

const app=express()

var corsOptions = {
    origin:"*", //cuando se tenga el dominio del front 
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions))

//Capturar body
app.use(bodyparser.urlencoded({
    extended:false
}))
app.use(bodyparser.json())

//Conexion a BD
//mongodb+srv://g3vi:<password>@cluster0.nlfbri1.mongodb.net/?retryWrites=true&w=majority
//const url=mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@cluster0.go8qi0c.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`
const url=`mongodb+srv://${process.env.USSERNAME}:${process.env.PASSWORD}@cluster0.nlfbri1.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`
const options={
    useNewUrlParser:true,
    useUnifiedTopology:true
}
//console.log('url',url)
mongoose.connect(url,options).then(()=>{
    console.log('Conectado a DB')
}).catch(error =>{
    console.log('Error db: ',error)
})

//Importar las rutas
const authRoutes=require('./routes/auth')

//Ruta del middleware
app.get('/',(req,res)=>{
    res.json({
        estado:true,
        mensaje:'Works'
    })
})
app.use('/api/user',authRoutes)

//Arrancar el servidor
const PORT=process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`Servidor en: ${PORT}`)
})