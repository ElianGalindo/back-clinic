const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Product = require('../models/Products')
const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body
        //Buascar el usuario para verificar que existe el correo electronico en la bd
        //ahora con firebase-admin solo lo podemos poner asi 
        const userDoc = await User.findByEmail(email)

        //Si no existe el usuario
        if(!userDoc) {
            return res.status(404).json({
                message: 'USER NOT FOUND'
            })
        } 

        //Verificar si el password coincide 
        const isValidPass = await userDoc.verifyPassword(password)
        if(!isValidPass) {
            return res.status(401).json({
                message: 'INAVLID CREDENTIALS'
            })
        }

        //Generar el TOKEN
        const token = jwt.sign({email: userDoc.email}, process.env.SECRET, { expiresIn: '1h' })
        res.status(200).json({
            message: 'success',
            token
        })
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error'
        })
    }
}

const registerUser = async (req, res) => {
    try {
        const {email, password, nombre, apaterno, amaterno, direccion, telefono} = req.body
        const existingUser = await User.findByEmail(email)
        if(existingUser){
            return res.status(404).json({
                message: 'User alredy exists'
            })
        }
        const newUser = await User.createUser(email, password, nombre, apaterno, amaterno, direccion, telefono)
        res.status(201).json({
            message: 'User Registered Successfully',
            user: newUser
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}
const getAllUsers = async (req, res) => {
    try {
        const users = await User.getAllUsers()
        res.json({
            users,
            message: 'success'
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

const deleteUser = async (req, res) => {
    const userEmail = req.params.email
    try {
        await User.deleteUser(userEmail)
        res.status(204).send()
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

const updateUser = async (req, res) => {
    const userEmail = req.params.email
    const userData = req.body
    try {
        const userUpdate = await User.updateUser(userEmail, userData)
        res.json({
            userUpdate,
            message: 'success'
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

//Productos_________________
const createProduct = async (req, res) => {
    try {
        const { image, name, price, description } = req.body;
        const newProduct = await Product.createProduct(image, name, price, description);
        res.status(201).json({
            message: 'Product created successfully',
            product: newProduct
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error'
        });
    }
}

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.getAllProducts();
        res.json({
            products,
            message: 'Success'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error'
        });
    }
}

const getProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.getProductById(productId);
        if (product) {
            res.json({
                product,
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

const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const newData = req.body;
        await Product.updateProduct(productId, newData);
        res.json({
            message: 'Product updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error'
        });
    }
}

const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        await Product.deleteProduct(productId);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error'
        });
    }
}

module.exports = {registerUser, loginUser, getAllUsers, deleteUser, updateUser, createProduct, getAllProducts, getProductById, updateProduct, deleteProduct}