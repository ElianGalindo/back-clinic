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
};

// Otros controladores de citas (eliminar, actualizar, obtener por ID) pueden agregarse aquí

module.exports = { registerCita, getAllCitas };
