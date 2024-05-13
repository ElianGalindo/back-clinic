const Checkup = require('../models/Checkups');
const Pacient = require('../models/Pacients');

const registerCheckup = async (req, res) => {
    try {
        const { pacienteId, fecha, hora, tratamiento, doctor, comentarios, archivos, pagos } = req.body;
        const existingPacient = await Pacient.getPacientById(pacienteId);
        if (!existingPacient) {
            return res.status(404).json({
                message: 'Paciente not found'
            });
        }
        const newCheckup = await Checkup.createCheckup(pacienteId, fecha, hora, tratamiento, doctor, comentarios, archivos, pagos);
        res.status(201).json({
            message: 'Checkup Registered Successfully',
            checkup: newCheckup
        });
    } catch (error) {
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
