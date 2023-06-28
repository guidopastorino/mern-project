const express = require('express');
const path = require('path');
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const router = require('./routes/router')
const connectDB = require('./dbConnection/dbConnect')

// Configurar la carpeta para archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())
app.use(cors())
app.use(router)


// connecting to DB
connectDB()


app.listen(5000, () => console.log("server listening"))