const admin = require('../config/firebase')
const firestore = admin.firestore()

class Product {
    constructor(id, image, name, price, description) {
        this.id = id,
        this.image = image,
        this.name = name,
        this.price = price,
        this.description = description
    }

    static async createProduct(image, name, price, description) {
        try {
            const productRef = await firestore.collection('products').add({
                image,
                name,
                price,
                description
            });
            return new Product(productRef.id, image, name, price, description);
        } catch (error) {
            throw error;
        }
    }

    static async getAllProducts() {
        try {
            const productsSnapshot = await firestore.collection('products').get();
            const products = [];
            productsSnapshot.forEach(doc => {
                products.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            return products;
        } catch (error) {
            throw error;
        }
    }

    static async getProductById(productId) {
        try {
            const productDoc = await firestore.collection('products').doc(productId).get();
            if (productDoc.exists) {
                const productData = productDoc.data();
                return new Product(productId, productData.image, productData.name, productData.price, productData.description);
            }
            return null;
        } catch (error) {
            throw error;
        }
    }

    static async updateProduct(productId, newData) {
        try {
            await firestore.collection('products').doc(productId).update(newData);
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
