const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Product = require('../models/Products')
const multer = require('multer')
const admin = require('../config/firebase')
const storage = multer.memoryStorage()
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limitar tamaño de archivo a 5MB
    fileFilter: function(req, file, cb) {
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG, and PDF files are allowed.'));
        }
    }
}).single('archivo')

const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body
        //Buascar el usuario para verificar que existe el correo electronico en la bd
        //ahora con firebase-admin solo lo podemos poner asi 
        const userDoc = await User.findByEmail(email)

        //Si no existe el usuario
        if(!userDoc) {
            return res.status(404).json({
                message: 'USER NOT FOUND'
            })
        } 

        //Verificar si el password coincide 
        const isValidPass = await userDoc.verifyPassword(password)
        if(!isValidPass) {
            return res.status(401).json({
                message: 'INAVLID CREDENTIALS'
            })
        }

        //Generar el TOKEN
        const token = jwt.sign({email: userDoc.email}, process.env.SECRET, { expiresIn: '1h' })
        res.status(200).json({
            message: 'success',
            token,
            user: {
                email: userDoc.email,
                nombre: userDoc.nombre,
                archivos: userDoc.archivo,
                apaterno: userDoc.apaterno
            }
        })
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error'
        })
    }
}

const registerUser = async (req, res) => {
    try {
        upload(req, res, async function (err){
            if (err) {
                console.error(err);
                return res.status(400).json({ message: 'Error uploading file' });
            }
            const {email, password, nombre, apaterno, amaterno, direccion, telefono} = req.body
            let archivoURL = null;
            if (req.file) {
                // Subir el archivo a Firebase Storage y obtener su URL
                const bucket = admin.storage().bucket();
                const file = bucket.file(req.file.originalname);
                await file.save(req.file.buffer, { contentType: req.file.mimetype });
                archivoURL = await file.getSignedUrl({ action: 'read', expires: '01-01-2100' });
            }
            const existingUser = await User.findByEmail(email)
            if(existingUser){
                return res.status(404).json({
                    message: 'User alredy exists'
                })
            }
            const newUser = await User.createUser(email, password, nombre, apaterno, amaterno, direccion, telefono, archivoURL)
            res.status(201).json({
                message: 'User Registered Successfully',
                user: newUser
            })
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}
const getAllUsers = async (req, res) => {
    try {
        const users = await User.getAllUsers()
        res.json({
            users,
            message: 'success'
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

const deleteUser = async (req, res) => {
    const userEmail = req.params.email
    try {
        await User.deleteUser(userEmail)
        res.status(204).send()
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

const updateUser = async (req, res) => {
    const userEmail = req.params.email
    const userData = req.body
    try {
        const userUpdate = await User.updateUser(userEmail, userData)
        res.json({
            userUpdate,
            message: 'success'
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}
module.exports = {registerUser, loginUser, getAllUsers, deleteUser, updateUser}