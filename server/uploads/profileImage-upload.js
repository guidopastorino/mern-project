const multer = require('multer');
const path = require('path');

// Configurar el almacenamiento de archivos con Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Especifica la carpeta donde se guardarán los archivos subidos
        cb(null, 'uploads/profile-images');
    },
    filename: (req, file, cb) => {
        // Obtén la extensión del archivo original
        const extension = path.extname(file.originalname);

        // Asigna un nombre único al archivo con su extensión
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + extension);
    },
});

// Configurar la función de filtrado de archivos
const fileFilter = (req, file, cb) => {
    // Verificar si el tipo de archivo es imagen o video
    if (file.mimetype.startsWith('image/')) {
        cb(null, true); // Aceptar el archivo
    } else {
        cb(new Error('Tipo de archivo no válido. Solo se permiten imágenes'), false); // Rechazar el archivo
    }
};

// Configurar la instancia de Multer
const profileImageUpload = multer({ storage, fileFilter });

module.exports = profileImageUpload;