class ICitas {
    /*
        Crear un nuevo usuario
        @param {string} email -> correo del usuario
        @param {string} password -> password del usuario
        @returns {Promise<User>}
        @trhows {error} sis hay un error en la creacion
    */ 
    static async createCita (pacienteId, fecha, hora, motivo, doctor, consultorio) {}
    static async getAllCitas () {}
} 

module.exports = ICitas