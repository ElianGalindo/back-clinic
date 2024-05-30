const express = require('express')
const router = express.Router()
const { registerUser, loginUser, getAllUsers, deleteUser, updateUser } = require('./../controller/userController')
const authenticateToken = require('./../auth/authMiddleware')
const { registerPacient, getAllPacients, deletePacient, updatePacient, getPacientById  } = require('./../controller/pacientController')
const { registerCita, getAllCitas, getCitasPorDia, deleteCita, updateCita } = require('../controller/citasController')
const { registerPrescription, getAllPrescriptions, getPrescriptionsByPatientId, deletePrescription } = require('../controller/prescriptionController')
const { registerCheckup, getAllCheckups, getCheckupsByPatientId, deleteCheckup } = require('../controller/checkupController')
const { registerProduct, getAllProducts, getProductById, updateProduct, deleteProduct } = require('../controller/productController')
const {createCheckoutSession} = require('../controller/pagoController')
//Rutas de usuarios
router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/get-all-users', authenticateToken, getAllUsers)
router.delete('/users/:email', authenticateToken, deleteUser)
router.put('/users/:email', authenticateToken, updateUser)

// Rutas para productos
router.post('/products/create', authenticateToken, registerProduct)
router.get('/products/get-all-products', authenticateToken, getAllProducts)
router.get('/products/:id', authenticateToken, getProductById)
router.put('/products/:id', authenticateToken, updateProduct)
router.delete('/products/:id', authenticateToken, deleteProduct)

//Ruta de pago con stripe
router.post('/create-stripe-session', createCheckoutSession)

//Rutas para pacientes
router.post('/pacients/create', authenticateToken, registerPacient)
router.get('/pacients/get-all-pacients', authenticateToken, getAllPacients)
router.delete('/pacients/:email', authenticateToken, deletePacient)
router.put('/pacients/:email', authenticateToken, updatePacient)
router.get('/pacients/:email', authenticateToken, getPacientById)

//Rutas para citas
router.post('/citas/create', authenticateToken, registerCita)
router.get('/citas/get-all-citas', authenticateToken, getAllCitas)
router.get('/citas/get-citas-por-dia/:dia', authenticateToken, getCitasPorDia)
router.delete('/citas/:id', authenticateToken, deleteCita)
router.put('/citas/:id', authenticateToken, updateCita)

//Rutas para prescripciones
router.post('/prescripcion/create', registerPrescription)
router.get('/prescripcion/get-all-prescriptions', getAllPrescriptions)
router.get('/prescripcion/get-prescriptions-by-patient/:pacienteId', getPrescriptionsByPatientId)
router.delete('/prescripcion/:id', authenticateToken, deletePrescription)

//Rutas para checkups
router.post('/checkup/create', registerCheckup)
router.get('/checkup/get-all-checkups', getAllCheckups)
router.get('/checkup/get-checkups-by-patient/:pacienteId', getCheckupsByPatientId)
router.delete('/checkup/:id', authenticateToken, deleteCheckup)
module.exports = router