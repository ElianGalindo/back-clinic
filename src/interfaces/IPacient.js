class IPacient {
    /*
        Crear un nuevo usuario
        @param {string} email -> correo del usuario
        @param {string} password -> password del usuario
        @returns {Promise<User>}
        @trhows {error} sis hay un error en la creacion
    */ 
    static async createPacient (email, nombre, apaterno, amaterno, direccion, telefono, edad, sexo) {}
    static async findByEmail(email) {}
    static async getAllPacients(){}
    static async deletePacient(pacientEmail){}
    static async updatePacient (pacientEmail, pacientData) {}
} 

module.exports = IPacient