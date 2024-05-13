const Pacient = require('../models/Pacients')
const multer = require('multer')

const registerPacient = async (req, res) => {
    try {
        const {email, nombre, apaterno, amaterno, direccion, telefono, edad, sexo} = req.body
        const existingPacient = await Pacient.findByEmail(email)
        if(existingPacient){
            return res.status(404).json({
                message: 'User alredy exists'
            })
        }
        const newPacient = await Pacient.createPacient(email, nombre, apaterno, amaterno, direccion, telefono, edad, sexo, image)
        res.status(201).json({
            message: 'User Registered Successfully',
            user: newPacient
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}
const getAllPacients = async (req, res) => {
    try {
        const pacients = await Pacient.getAllPacients()
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
        const pacientId = req.params.email;
        const pacient = await Pacient.getPacientById(pacientId);
        if (pacient) {
            res.json({
                pacient,
                message: 'Success'
            });
        } else {
            res.status(404).json({
                message: 'Product not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error'
        });
    }
}

module.exports = {registerPacient, getAllPacients, deletePacient, updatePacient, getPacientById}