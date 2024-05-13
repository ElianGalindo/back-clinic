class ICheckup {
    /*
        Crear un nuevo usuario
        @param {string} email -> correo del usuario
        @param {string} password -> password del usuario
        @returns {Promise<User>}
        @trhows {error} sis hay un error en la creacion
    */ 
    static async createCheckup (pacienteId, fecha, hora, tratamiento, doctor, comentarios, archivos, pagos) {}
    static async getAllCitas () {}
} 

module.exports = ICheckup