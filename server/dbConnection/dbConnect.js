const mongoose = require('mongoose');

const URI = "mongodb+srv://guidopastorino:guidopasto01@cluster0.ltbz25q.mongodb.net/social-network"

const connectDB = async () => {
    try {
        await mongoose.connect(URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Conexión exitosa a la base de datos.');
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error.message);
        process.exit(1); // Salir del proceso con error
    }
};

module.exports = connectDB;