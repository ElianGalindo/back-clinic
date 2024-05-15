const Checkup = require('../models/Checkups');
const Pacient = require('../models/Pacients');
const multer = require('multer')
const admin = require('../config/firebase')
const storage = multer.memoryStorage()
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
}).single('archivos')


const registerCheckup = async (req, res) => {
    try {
        upload(req, res, async function (err) {
            if (err) {
                console.error(err);
                return res.status(400).json({ message: 'Error uploading file' });
            }

            const { pacienteId, fecha, hora, tratamiento, doctor, comentarios, pagos } = req.body;
            const existingPacient = await Pacient.getPacientById(pacienteId);
            if (!existingPacient) {
                return res.status(404).json({ message: 'Paciente not found' });
            }

            let archivoURL = null;
            if (req.file) {
                // Subir el archivo a Firebase Storage y obtener su URL
                const bucket = admin.storage().bucket();
                const file = bucket.file(req.file.originalname);
                await file.save(req.file.buffer, { contentType: req.file.mimetype });
                archivoURL = await file.getSignedUrl({ action: 'read', expires: '01-01-2100' });
            }

            const newCheckup = await Checkup.createCheckup(pacienteId, fecha, hora, tratamiento, doctor, comentarios, archivoURL, pagos);
            res.status(201).json({ message: 'Checkup Registered Successfully', checkup: newCheckup });
        })
    
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
};

const getAllCheckups = async (req, res) => {
    try {
        const checkups = await Checkup.getAllCheckups();
        res.json({
            checkups,
            message: 'success'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

const getCheckupsByPatientId = async (req, res) => {
    try {
        const { pacienteId } = req.params;
        const checkups = await Checkup.getCheckupsByPatientId(pacienteId);
        res.json({
            checkups,
            message: 'success'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}
// Otros controladores de citas (eliminar, actualizar, obtener por ID) pueden agregarse aquí

module.exports = { registerCheckup, getAllCheckups, getCheckupsByPatientId };
