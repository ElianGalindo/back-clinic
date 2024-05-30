const admin = require('../config/firebase')
const ICita = require('../interfaces/ICitas')
const Pacient = require('./Pacients')
const User = require('./User')
const firestore = admin.firestore()

class Cita extends ICita {
    constructor(pacienteId, doctorId, fecha, hora, motivo, consultorio) {
        super()
        this.pacienteId = pacienteId
        this.doctorId = doctorId
        this.fecha = fecha
        this.hora = hora
        this.motivo = motivo
        this.consultorio = consultorio
    }

    static async createCita(pacienteId, doctorId, fecha, hora, motivo, consultorio) {
        try {
            await firestore.collection('citas').add({
                pacienteId,
                doctorId,
                fecha,
                hora,
                motivo,
                consultorio
            });
            return new Cita(pacienteId, doctorId, fecha, hora, motivo, consultorio)
        } catch (error) {
            throw new Error('Error creating cita')
        }
    }

    static async getAllCitas() {
        try {
            const citasSnapshot = await firestore.collection('citas').get()
            const citas = []
            await Promise.all(citasSnapshot.docs.map(async (doc) => {
                const citaData = doc.data();
                const paciente = await Pacient.getPacientById(citaData.pacienteId)
                const doctor = await User.findByEmail(citaData.doctorId)
                if (paciente && doctor) {
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
                        doctor: {
                            email: doctor.email,
                            nombre: doctor.nombre,
                            apaterno: doctor.apaterno,
                            amaterno: doctor.amaterno,
                            direccion: doctor.direccion,
                            telefono: doctor.telefono,
                            archivos: doctor.archivo
                        },
                        fecha: citaData.fecha,
                        hora: citaData.hora,
                        motivo: citaData.motivo,
                        doctor: citaData.doctor,
                        consultorio: citaData.consultorio
                    })
                }
            }))
            return citas
        } catch (error) {
            throw error
        }
    }

    static async getAllCitasPorDia(dia) {
        try {
            const citasRef = firestore.collection('citas')
            const query = citasRef.where('fecha', '==', dia)
            const citasSnapshot = await query.get()
            const citas = []
            await Promise.all(citasSnapshot.docs.map(async (doc) => {
                const citaData = doc.data()
                const paciente = await Pacient.getPacientById(citaData.pacienteId)
                const doctor = await User.findByEmail(citaData.doctorId)
                if (paciente && doctor) {
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
                        doctor: {
                            email: doctor.email,
                            nombre: doctor.nombre,
                            apaterno: doctor.apaterno,
                            amaterno: doctor.amaterno,
                            direccion: doctor.direccion,
                            telefono: doctor.telefono,
                            archivos: doctor.archivo
                        },
                        fecha: citaData.fecha,
                        hora: citaData.hora,
                        motivo: citaData.motivo,
                        consultorio: citaData.consultorio
                    })
                }
            }))
            return citas
        } catch (error) {
            throw error
        }
    }
    static async getCitasByDoctorId(doctorId) {
        try {
            const citasSnapshot = await firestore.collection('citas').where('doctorId', '==', doctorId).get()
            const citas = []
            await Promise.all(citasSnapshot.docs.map(async (doc) => {
                const citaData = doc.data()
                const paciente = await Pacient.getPacientById(citaData.pacienteId)
                const doctor = await User.findByEmail(citaData.doctorId)
                if (paciente && doctor) {
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
                        doctor: {
                            email: doctor.email,
                            nombre: doctor.nombre,
                            apaterno: doctor.apaterno,
                            amaterno: doctor.amaterno,
                            direccion: doctor.direccion,
                            telefono: doctor.telefono,
                            archivos: doctor.archivo
                        },
                        fecha: citaData.fecha,
                        hora: citaData.hora,
                        motivo: citaData.motivo,
                        consultorio: citaData.consultorio
                    })
                }
            }))
            return citas
        } catch (error) {
            throw error
        }
    }
    static async deleteCita(citaId) {
        try {
            await firestore.collection('citas').doc(citaId).delete()
        } catch (error) {
            throw error
        }
    }
    static async updateCita (citaId, citaData){
        try {
            await firestore.collection('citas').doc(citaId).update(citaData)
            const citaUpdated = firebase.collection('citas').doc(citaId).get()
            return{
                citaUpdated: citaUpdated.data()
            }
        } catch (error) {
            throw error
        }
    }
    
    
}

module.exports = Cita
