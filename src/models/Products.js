const admin = require('../config/firebase')
const firestore = admin.firestore()
const IProduct = require('../interfaces/IProduct')

class Product extends IProduct {
    constructor(nombre, precio, descripcion, archivos) {
        super()
        this.nombre = nombre,
        this.precio = precio,
        this.descripcion = descripcion,
        this.archivo = archivos
    }

    static async createProducto(nombre, precio, descripcion, archivos) {
        try {
            await firestore.collection('products').add({
                nombre,
                precio,
                descripcion,
                archivos
            });
            return new Product(nombre, precio, descripcion, archivos)
        } catch (error) {
            throw error;
        }
    }

    static async getAllProducts() {
        try {
            const productos = await firestore.collection('products').get();
            const products = []
            productos.forEach(doc => {
                products.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            return products
        } catch (error) {
            throw error;
        }
    }

    static async getProductById(productId) {
        try {
            const productDoc = await firestore.collection('products').doc(productId).get();
            if (productDoc.exists) {
                const productData = productDoc.data();
                return new Product(productData.productId, productData.nombre, productData.precio, productData.descripcion, productData.archivo);
            }
            return null;
        } catch (error) {
            throw error;
        }
    }

    static async updateProduct(productId, productData) {
        try {
            await firestore.collection('products').doc(productId).update(productData);
        } catch (error) {
            throw error;
        }
    }

    static async deleteProduct(productId) {
        try {
            await firestore.collection('products').doc(productId).delete();
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Product;
