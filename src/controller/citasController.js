const Cita = require('../models/Citas')
const Pacient = require('../models/Pacients')
const User = require('../models/User')

const registerCita = async (req, res) => {
    try {
        const { pacienteId, doctorId, fecha, hora, motivo, consultorio } = req.body
        const existingPacient = await Pacient.getPacientById(pacienteId)
        if (!existingPacient) {
            return res.status(404).json({
                message: 'Paciente not found'
            })
        }
        const newCita = await Cita.createCita(pacienteId, doctorId, fecha, hora, motivo, consultorio)
        res.status(201).json({
            message: 'Cita Registered Successfully',
            cita: newCita
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

const getAllCitas = async (req, res) => {
    try {
        const doctorId = req.user.email
        const citas = await Cita.getCitasByDoctorId(doctorId)
        res.json({
            citas,
            message: 'success'
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}
const getCitasPorDia = async (req, res) => {
    try {
        const { dia } = req.params
        const citas = await Cita.getAllCitasPorDia(dia)
        res.json({
            citas,
            message: 'success'
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}
const deleteCita = async (req, res) => {
    const citaId = req.params.id
    try {
        await Cita.deleteCita(citaId)
        res.status(204).send()
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}
const updateCita = async (req, res) => {
    const citaId = req.params.id
    const citaData = req.body
    try {
        const citaUpdate = await Cita.updateCita(citaId, citaData)
        res.json({
            citaUpdate,
            message: 'success'
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

// Otros controladores de citas (eliminar, actualizar, obtener por ID) pueden agregarse aquí

module.exports = { registerCita, getAllCitas, getCitasPorDia, deleteCita, updateCita }
