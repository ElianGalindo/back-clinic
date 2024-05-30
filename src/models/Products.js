const admin = require('../config/firebase')
const firestore = admin.firestore()
const IProduct = require('../interfaces/IProduct')
const User = require('../models/User')

class Product extends IProduct {
    constructor(doctorId, nombre, precio, descripcion, archivos) {
        super()
        this.doctorId = doctorId
        this.nombre = nombre,
        this.precio = precio,
        this.descripcion = descripcion,
        this.archivo = archivos
    }

    static async createProducto(doctorId, nombre, precio, descripcion, archivos) {
        try {
            await firestore.collection('products').add({
                doctorId,
                nombre,
                precio,
                descripcion,
                archivos
            });
            return new Product(doctorId, nombre, precio, descripcion, archivos)
        } catch (error) {
            throw error
        }
    }

    static async getAllProducts() {
        try {
            const productos = await firestore.collection('products').get()
            const products = []
            productos.forEach(doc => {
                products.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            return products
        } catch (error) {
            throw error
        }
    }
    static async getProductsByDoctorId(doctorId) {
        try {
            const productsSnapshot = await firestore.collection('products').where('doctorId', '==', doctorId).get()
            const productos = []
            await Promise.all(productsSnapshot.docs.map(async (doc) => {
                const productoData = doc.data();
                const doctor = await User.findByEmail(productoData.doctorId)
                if (doctor) {
                    productos.push({
                        id: doc.id,
                        doctor: {
                            email: doctor.email,
                            nombre: doctor.nombre,
                            apaterno: doctor.apaterno,
                            amaterno: doctor.amaterno,
                            direccion: doctor.direccion,
                            telefono: doctor.telefono,
                            archivos: doctor.archivo
                        },
                        nombre: productoData.nombre,
                        precio: productoData.precio,
                        descripcion: productoData.descripcion,
                        archivos: productoData.archivos
                    })
                }
            }))
            return productos
        } catch (error) {
            throw error
        }
    }
    static async getProductById(productId) {
        try {
            const productDoc = await firestore.collection('products').doc(productId).get()
            if (productDoc.exists) {
                const productData = productDoc.data()
                return new Product(productData.productId, productData.nombre, productData.precio, productData.descripcion, productData.archivo)
            }
            return null
        } catch (error) {
            throw error;
        }
    }

    static async updateProduct(productId, productData) {
        try {
            await firestore.collection('products').doc(productId).update(productData)
        } catch (error) {
            throw error
        }
    }

    static async deleteProduct(productId) {
        try {
            await firestore.collection('products').doc(productId).delete();
        } catch (error) {
            throw error
        }
    }
}

module.exports = Product
