const Cita = require('../models/Citas');
const Pacient = require('../models/Pacients');

const registerCita = async (req, res) => {
    try {
        const { pacienteId, fecha, hora, motivo, doctor, consultorio } = req.body;
        const existingPacient = await Pacient.getPacientById(pacienteId);
        if (!existingPacient) {
            return res.status(404).json({
                message: 'Paciente not found'
            });
        }
        const newCita = await Cita.createCita(pacienteId, fecha, hora, motivo, doctor, consultorio);
        res.status(201).json({
            message: 'Cita Registered Successfully',
            cita: newCita
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
};

const getAllCitas = async (req, res) => {
    try {
        const citas = await Cita.getAllCitas();
        res.json({
            citas,
            message: 'success'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}
const getCitasPorDia = async (req, res) => {
    try {
        const { dia } = req.params;
        const citas = await Cita.getAllCitasPorDia(dia);
        res.json({
            citas,
            message: 'success'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error'
        });
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

module.exports = { registerCita, getAllCitas, getCitasPorDia, deleteCita, updateCita };
