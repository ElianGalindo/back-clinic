const Pacient = require('../models/Pacients')
const multer = require('multer')
const admin = require('../config/firebase')
const storage = multer.memoryStorage()
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limitar tamaño de archivo a 5MB
    fileFilter: function(req, file, cb) {
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG, and PDF files are allowed.'))
        }
    }
}).single('archivo')

const registerPacient = async (req, res) => {
    try {
        upload(req, res, async function (err) {
            if (err) {
                console.error(err)
                return res.status(400).json({ message: 'Error uploading file' })
            }
            const {email, nombre, apaterno, amaterno, direccion, telefono, edad, sexo, doctorId} = req.body
            let archivoURL = null
            if (req.file) {
                // Subir el archivo a Firebase Storage y obtener su URL
                const bucket = admin.storage().bucket();
                const file = bucket.file(req.file.originalname);
                await file.save(req.file.buffer, { contentType: req.file.mimetype })
                archivoURL = await file.getSignedUrl({ action: 'read', expires: '01-01-2100' })
            }

            const newPacient = await Pacient.createPacient(email, nombre, apaterno, amaterno, direccion, telefono, edad, sexo, archivoURL, doctorId)
            res.status(201).json({ message: 'Pacient Registered Successfully', pacient: newPacient })
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}
const getAllPacients = async (req, res) => {
    try {
        const doctorId = req.user.email
        const pacients = await Pacient.getPacientsByDoctorId(doctorId)
        res.json({
            pacients,
            message: 'success'
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}
const deletePacient = async (req, res) => {
    const pacientEmail = req.params.email
    try {
        await Pacient.deletePacient(pacientEmail)
        res.status(204).send()
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

const updatePacient = async (req, res) => {
    const pacientEmail = req.params.email
    const pacientData = req.body
    try {
        const pacientUpdate = await Pacient.updatePacient(pacientEmail, pacientData)
        res.json({
            pacientUpdate,
            message: 'success'
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

const getPacientById = async (req, res) => {
    try {
        const pacientId = req.params.email
        const pacient = await Pacient.getPacientById(pacientId)
        if (pacient) {
            res.json({
                pacient,
                message: 'Success'
            })
        } else {
            res.status(404).json({
                message: 'Product not found'
            })
        }
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error'
        })
    }
}

module.exports = {registerPacient, getAllPacients, deletePacient, updatePacient, getPacientById}