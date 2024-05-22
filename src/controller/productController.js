const Product = require('../models/Products')
const User = require('../models/User')
const multer = require('multer')
const admin = require('../config/firebase')
const storage = multer.memoryStorage()
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limitar tamaño de archivo a 5MB
    fileFilter: function(req, file, cb) {
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG, and PDF files are allowed.'));
        }
    }
}).single('archivo')

const registerProduct = async (req, res) => {
    try {
        upload(req, res, async function (err) {
            if (err) {
                console.error(err);
                return res.status(400).json({ message: 'Error uploading file' });
            }
            const {nombre, precio, descripcion} = req.body
            let archivoURL = null;
            if (req.file) {
                // Subir el archivo a Firebase Storage y obtener su URL
                const bucket = admin.storage().bucket();
                const file = bucket.file(req.file.originalname);
                await file.save(req.file.buffer, { contentType: req.file.mimetype });
                archivoURL = await file.getSignedUrl({ action: 'read', expires: '01-01-2100' });
            }

            const newProduct = await Product.createProducto(nombre, precio, descripcion, archivoURL);
            res.status(201).json({ message: 'Product Registered Successfully', product: newProduct });
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}
const getAllProducts = async (req, res) => {
    try {
        const productos = await Product.getAllProducts()
        res.json({
            productos,
            message: 'success'
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

const deleteProduct = async (req, res) => {
    const productId = req.params.id
    try {
        await Product.deleteProduct(productId)
        res.status(204).send()
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

const updateProduct = async (req, res) => {
    const productId = req.params.id
    const productData = req.body
    try {
        const productUpdate = await Product.updateProduct(productId, productData)
        res.json({
            productUpdate,
            message: 'success'
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

const getProductById = async (req, res) => {
    try {
        const productId = req.params.id
        const product = await Product.getProductById(productId);
        if (product) {
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

module.exports = {registerProduct, getAllProducts, getProductById, updateProduct, deleteProduct}