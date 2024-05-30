const admin = require('../config/firebase')
const IPrescription = require('../interfaces/IPrescription')
const Pacient = require('./Pacients')
const firestore = admin.firestore()

class Prescription extends IPrescription {
    constructor(pacienteId, fecha, hora, nota, doctor) {
        super()
        this.pacienteId = pacienteId
        this.fecha = fecha
        this.hora = hora
        this.nota = nota
        this.doctor = doctor
    }

    static async createPrescription(pacienteId, fecha, hora, nota, doctor) {
        try {
            await firestore.collection('prescripciones').add({
                pacienteId,
                fecha,
                hora,
                nota,
                doctor
            })
            return new Prescription(pacienteId, fecha, hora, nota, doctor);
        } catch (error) {
            throw new Error('Error creating prescription');
        }
    }

    static async getAllPrescriptions() {
        try {
            const prescripcionesSnapshot = await firestore.collection('prescripciones').get()
            const prescripciones = []
            await Promise.all(prescripcionesSnapshot.docs.map(async (doc) => {
                const prescripcionData = doc.data()
                const paciente = await Pacient.getPacientById(prescripcionData.pacienteId)
                if (paciente) {
                    prescripciones.push({
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
                        fecha: prescripcionData.fecha,
                        hora: prescripcionData.hora,
                        nota: prescripcionData.nota,
                        doctor: prescripcionData.doctor
                    })
                }
            }))
            return prescripciones
        } catch (error) {
            throw error
        }
    }
    
    static async getPrescriptionsByPatientId(pacienteId) {
        try {
            const prescriptionsSnapshot = await firestore.collection('prescripciones').where('pacienteId', '==', pacienteId).get()
            const prescriptions = []
            prescriptionsSnapshot.forEach(doc => {
                const prescriptionData = doc.data()
                prescriptions.push({
                    id: doc.id,
                    fecha: prescriptionData.fecha,
                    hora: prescriptionData.hora,
                    nota: prescriptionData.nota,
                    doctor: prescriptionData.doctor
                })
            })
            return prescriptions
        } catch (error) {
            throw new Error('Error fetching prescriptions by patient ID')
        }
    }
    static async deletePrescription(prescriptionId) {
        try {
            await firestore.collection('prescripciones').doc(prescriptionId).delete()
        } catch (error) {
            throw error
        }
    }
    
}

module.exports = Prescription