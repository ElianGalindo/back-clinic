const admin = require('../config/firebase')
const ICheckup = require('../interfaces/ICheckup')
const Pacient = require('./Pacients')
const firestore = admin.firestore()
const { Storage } = require('@google-cloud/storage')
const storage = new Storage()

class Checkup extends ICheckup {
    constructor(pacienteId, fecha, hora, tratamiento, doctor, comentarios, archivos, pagos) {
        super()
        this.pacienteId = pacienteId
        this.fecha = fecha
        this.hora = hora
        this.tratamiento = tratamiento
        this.doctor = doctor
        this.comentarios = comentarios
        this.archivo = archivos
        this.pagos = pagos
    }

    static async createCheckup(pacienteId, fecha, hora, tratamiento, doctor, comentarios, archivos, pagos) {
        try {
            await firestore.collection('checkups').add({
                pacienteId,
                fecha,
                hora,
                tratamiento,
                doctor,
                comentarios,
                archivos,
                pagos
            });
            return new Checkup(pacienteId, fecha, hora, tratamiento, doctor, comentarios, archivos, pagos)
        } catch (error) {
            throw new Error('Error creating checkup')
        }
    }

    static async getAllCheckups() {
        try {
            const checkupsSnapshot = await firestore.collection('checkups').get()
            const checkups = []
            await Promise.all(checkupsSnapshot.docs.map(async (doc) => {
                const checkupData = doc.data()
                const paciente = await Pacient.getPacientById(checkupData.pacienteId)
                if (paciente) {
                    checkups.push({
                        id: doc.id,
                        paciente: {
                            email: paciente.email,
                            nombre: paciente.nombre,
                            apaterno: paciente.apaterno,
                            amaterno: paciente.amaterno,
                            direccion: paciente.direccion,
                            telefono: paciente.telefono,
                            edad: paciente.edad,
                            sexo: paciente.sexo
                        },
                        fecha: checkupData.fecha,
                        hora: checkupData.hora,
                        tratamiento: checkupData.tratamiento,
                        doctor: checkupData.doctor,
                        comentarios: checkupData.comentarios,
                        archivos: checkupData.archivos,
                        pagos: checkupData.pagos

                    })
                }
            }))
            return checkups
        } catch (error) {
            throw error
        }
    }
    static async getCheckupsByPatientId(pacienteId) {
        try {
            const checkupsSnapshot = await firestore.collection('checkups').where('pacienteId', '==', pacienteId).get()
            const checkups = []
            checkupsSnapshot.forEach(doc => {
                const checkupsData = doc.data()
                checkups.push({
                    id: doc.id,
                    fecha: checkupsData.fecha,
                    hora: checkupsData.hora,
                    tratamiento: checkupsData.tratamiento,
                    doctor: checkupsData.doctor,
                    comentarios: checkupsData.comentarios,
                    archivos: checkupsData.archivos,
                    pagos: checkupsData.pagos

                })
            })
            return checkups
        } catch (error) {
            throw new Error('Error fetching prescriptions by patient ID')
        }
    }
}

module.exports = Checkup