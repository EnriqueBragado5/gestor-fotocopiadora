const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const carpeta = 'uploads/';
    if (!fs.existsSync(carpeta)) {
      fs.mkdirSync(carpeta);
    }
    cb(null, carpeta);
  },
  filename: (req, file, cb) => {
    const nombreUnico = `${Date.now()}-${file.originalname}`;
    cb(null, nombreUnico);
  }
});


const filtroArchivos = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos en formato PDF'), false);
  }
};

const upload = multer({
  storage,
  fileFilter: filtroArchivos,
  limits: { fileSize: 25 * 1024 * 1024 }
});

module.exports = upload;