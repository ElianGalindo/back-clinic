const express = require('express')
const router = express.Router()
const { registerUser, loginUser, getAllUsers, deleteUser, updateUser, createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } = require('./../controller/userController')
const authenticateToken = require('./../auth/authMiddleware')
const { registerPacient, getAllPacients, deletePacient, updatePacient, getPacientById  } = require('./../controller/pacientController')
const { registerCita, getAllCitas, getCitasPorDia } = require('../controller/citasController');

//Rutas de usuarios
router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/get-all-users', authenticateToken, getAllUsers)
router.delete('/users/:email', authenticateToken, deleteUser)
router.put('/users/:email', authenticateToken, updateUser)

// Rutas para productos
router.post('/products/create', createProduct); // Crear un nuevo producto
router.get('/get-all-products', getAllProducts); // Obtener todos los productos
router.get('/products/:id', getProductById); // Obtener un producto por su ID
router.put('/products/:id', updateProduct); // Actualizar un producto
router.delete('/products/:id', deleteProduct); // Eliminar un producto

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

module.exports = router