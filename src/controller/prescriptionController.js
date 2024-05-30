const Prescription = require('../models/Prescriptions')
const Pacient = require('../models/Pacients')

const registerPrescription = async (req, res) => {
    try {
        const { pacienteId, fecha, hora, nota, doctor } = req.body
        const existingPacient = await Pacient.getPacientById(pacienteId)
        if (!existingPacient) {
            return res.status(404).json({
                message: 'Paciente not found'
            })
        }
        const newPrescription = await Prescription.createPrescription(pacienteId, fecha, hora, nota, doctor)
        res.status(201).json({
            message: 'Prescription Registered Successfully',
            prescription: newPrescription
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

const getAllPrescriptions = async (req, res) => {
    try {
        const prescription = await Prescription.getAllPrescriptions()
        res.json({
            prescription,
            message: 'success'
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

const getPrescriptionsByPatientId = async (req, res) => {
    try {
        const { pacienteId } = req.params;
        const prescriptions = await Prescription.getPrescriptionsByPatientId(pacienteId)
        res.json({
            prescriptions,
            message: 'success'
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

module.exports = { registerPrescription, getAllPrescriptions, getPrescriptionsByPatientId }

