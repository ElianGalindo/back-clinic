class IProduct {
    /*
        Crear un nuevo usuario
        @param {string} email -> correo del usuario
        @param {string} password -> password del usuario
        @returns {Promise<User>}
        @trhows {error} sis hay un error en la creacion
    */ 
    static async createProducto (nombre, precio, descripcion, archivos) {}
    static async getProductById(productId) {}
    static async getAllProducts(){}
    static async deleteProduct(productId){}
    static async updateProduct (productId, productData) {}
} 

module.exports = IProduct