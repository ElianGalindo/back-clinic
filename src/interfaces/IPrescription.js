class IPacient {
    /*
        Crear un nuevo usuario
        @param {string} email -> correo del usuario
        @param {string} password -> password del usuario
        @returns {Promise<User>}
        @trhows {error} sis hay un error en la creacion
    */ 
    static async createPrescription(pacienteId, fecha, hora, nota, doctor){}
    getAllPrescriptions(){}
} 

module.exports = IPacient
