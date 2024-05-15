const admin = require('../config/firebase');
const ICita = require('../interfaces/ICitas');
const Pacient = require('./Pacients')
const firestore = admin.firestore();

class Cita extends ICita {
    constructor(pacienteId, fecha, hora, motivo, doctor, consultorio) {
        super();
        this.pacienteId = pacienteId
        this.fecha = fecha
        this.hora = hora
        this.motivo = motivo
        this.doctor = doctor
        this.consultorio = consultorio
    }

    static async createCita(pacienteId, fecha, hora, motivo, doctor, consultorio) {
        try {
            await firestore.collection('citas').add({
                pacienteId,
                fecha,
                hora,
                motivo,
                doctor,
                consultorio
            });
            return new Cita(pacienteId, fecha, hora, motivo, doctor, consultorio);
        } catch (error) {
            throw new Error('Error creating cita');
        }
    }

    static async getAllCitas() {
        try {
            const citasSnapshot = await firestore.collection('citas').get();
            const citas = []
            await Promise.all(citasSnapshot.docs.map(async (doc) => {
                const citaData = doc.data();
                const paciente = await Pacient.getPacientById(citaData.pacienteId);
                if (paciente) {
                    citas.push({
                        id: doc.id,
                        paciente: {
                            email: paciente.email,
                            nombre: paciente.nombre,
                            apaterno: paciente.apaterno,
                            amaterno: paciente.amaterno,
                            direccion: paciente.direccion,
                            telefono: paciente.telefono,
                            edad: paciente.edad,
                            sexo: paciente.sexo,
                            archivos: paciente.archivo
                        },
                        fecha: citaData.fecha,
                        hora: citaData.hora,
                        motivo: citaData.motivo,
                        doctor: citaData.doctor,
                        consultorio: citaData.consultorio
                    });
                }
            }));
            return citas;
        } catch (error) {
            throw error;
        }
    }

    static async getAllCitasPorDia(dia) {
        try {
            // Obtener referencia a la colección 'citas'
            const citasRef = firestore.collection('citas');
            // Crear una consulta para filtrar las citas por el día especificado
            const query = citasRef.where('fecha', '==', dia);
            // Ejecutar la consulta
            const citasSnapshot = await query.get();
            const citas = [];
            // Iterar sobre los documentos obtenidos y mapear los datos de las citas
            await Promise.all(citasSnapshot.docs.map(async (doc) => {
                const citaData = doc.data();
                const paciente = await Pacient.getPacientById(citaData.pacienteId);
                if (paciente) {
                    citas.push({
                        id: doc.id,
                        paciente: {
                            email: paciente.email,
                            nombre: paciente.nombre,
                            apaterno: paciente.apaterno,
                            amaterno: paciente.amaterno,
                            direccion: paciente.direccion,
                            telefono: paciente.telefono,
                            edad: paciente.edad,
                            sexo: paciente.sexo,
                            archivos: paciente.archivo
                        },
                        fecha: citaData.fecha,
                        hora: citaData.hora,
                        motivo: citaData.motivo,
                        doctor: citaData.doctor,
                        consultorio: citaData.consultorio
                    });
                }
            }));
            return citas;
        } catch (error) {
            throw error;
        }
    }
    
    

    // Otros métodos estáticos para manejar citas pueden agregarse aquí
}

module.exports = Cita;
