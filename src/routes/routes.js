const express = require('express')
const router = express.Router()
const { registerUser, loginUser, getAllUsers, deleteUser, updateUser } = require('./../controller/userController')
const authenticateToken = require('./../auth/authMiddleware')
const { registerPacient, getAllPacients, deletePacient, updatePacient, getPacientById  } = require('./../controller/pacientController')
const { registerCita, getAllCitas, getCitasPorDia, deleteCita, updateCita } = require('../controller/citasController')
const { registerPrescription, getAllPrescriptions, getPrescriptionsByPatientId } = require('../controller/prescriptionController')
const { registerCheckup, getAllCheckups, getCheckupsByPatientId } = require('../controller/checkupController')
const { registerProduct, getAllProducts, getProductById, updateProduct, deleteProduct } = require('../controller/productController')
//Rutas de usuarios
router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/get-all-users', authenticateToken, getAllUsers)
router.delete('/users/:email', authenticateToken, deleteUser)
router.put('/users/:email', authenticateToken, updateUser)

// Rutas para productos
router.post('/products/create', registerProduct)
router.get('/products/get-all-products', getAllProducts)
router.get('/products/:id', getProductById)
router.put('/products/:id', updateProduct)
router.delete('/products/:id', deleteProduct)

//Rutas para pacientes
router.post('/pacients/create', registerPacient)
router.get('/pacients/get-all-pacients', getAllPacients)
router.delete('/pacients/:email', deletePacient)
router.put('/pacients/:email', updatePacient)
router.get('/pacients/:email', getPacientById)

//Rutas para citas
router.post('/citas/create', registerCita)
router.get('/citas/get-all-citas', getAllCitas)
router.get('/citas/get-citas-por-dia/:dia', getCitasPorDia)
router.delete('/citas/:id', deleteCita)
router.put('/citas/:id', updateCita)

//Rutas para prescripciones
router.post('/prescripcion/create', registerPrescription)
router.get('/prescripcion/get-all-prescriptions', getAllPrescriptions)
router.get('/prescripcion/get-prescriptions-by-patient/:pacienteId', getPrescriptionsByPatientId)

//Rutas para checkups
router.post('/checkup/create', registerCheckup)
router.get('/checkup/get-all-checkups', getAllCheckups)
router.get('/checkup/get-checkups-by-patient/:pacienteId', getCheckupsByPatientId)
module.exports = router