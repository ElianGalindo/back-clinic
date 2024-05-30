//const bcrypt = require('bcrypt')
const admin = require('../config/firebase')
const IPacient = require('../interfaces/IPacient')
const firestore = admin.firestore()
const User = require('./User')
class Pacient extends IPacient {
    constructor (email, nombre, apaterno, amaterno, direccion, telefono, edad, sexo, archivos, doctorId){
        super()
        this.email = email,
        this.nombre = nombre,
        this.apaterno = apaterno,
        this.amaterno = amaterno,
        this.direccion = direccion,
        this.telefono = telefono,
        this.edad = edad,
        this.sexo = sexo,
        this.archivo = archivos,
        this.doctorId = doctorId
    }
    static async createPacient (email, nombre, apaterno, amaterno, direccion, telefono, edad, sexo, archivos, doctorId) {
        try {
            const pacient = firestore.collection('pacients').doc(email)
            await pacient.set({
                email,
                nombre,
                apaterno,
                amaterno,
                direccion,
                telefono,
                edad,
                sexo,
                archivos,
                doctorId
            })
            return new Pacient(email, nombre, apaterno, amaterno, direccion, telefono, edad, sexo, archivos, doctorId)
        } catch (error) {
            console.log('Error => ', error)
            throw new Error('Error creating user')
        }
    }
    static async getPacientById(email){
        try {
            const pacient = firestore.collection('pacients').doc(email)
            const pacientDoc = await pacient.get()
            if(pacientDoc.exists){
                const pacientData = pacientDoc.data()
                return new Pacient(pacientData.email, pacientData.nombre, pacientData.apaterno, pacientData.amaterno, pacientData.direccion, pacientData.telefono, pacientData.edad, pacientData.sexo, pacientData.archivos, pacientData.doctorId)
            }
            return null
        } catch (error) {
            console.log('Error => ', error)
            throw new Error('Error finding user')
        }
    }

    static async getAllPacients(){
        try {
            const pacients = await firestore.collection('pacients').get()
            const foundPacients = []
            pacients.forEach(doc => {
                foundPacients.push({
                    email: doc.email,
                    ...doc.data()
                })
            })
            return foundPacients
        } catch (error) {
            throw error
        }
    }

    static async getPacientsByDoctorId(doctorId) {
        try {
            const pacientesSnapshot = await firestore.collection('pacients').where('doctorId', '==', doctorId).get()
            const pacientes = []
            await Promise.all(pacientesSnapshot.docs.map(async (doc) => {
                const pacienteData = doc.data()
                const doctor = await User.findByEmail(pacienteData.doctorId)
                if (doctor) {
                    pacientes.push({
                        email: doc.id,
                        doctor: {
                            email: doctor.email,
                            nombre: doctor.nombre,
                            apaterno: doctor.apaterno,
                            amaterno: doctor.amaterno,
                            direccion: doctor.direccion,
                            telefono: doctor.telefono,
                            archivos: doctor.archivos,
                        },
                        nombre: pacienteData.nombre,
                        apaterno: pacienteData.apaterno,
                        amaterno: pacienteData.amaterno,
                        consultorio: pacienteData.consultorio,
                        direccion: pacienteData.direccion,
                        telefono: pacienteData.telefono,
                        edad: pacienteData.edad,
                        sexo: pacienteData.sexo,
                        archivos: pacienteData.archivos
                    })
                }
            }))
            return pacientes
        } catch (error) {
            throw error
        }
    }
    static async deletePacient(pacientEmail) {
        try {
            await firestore.collection('pacients').doc(pacientEmail).delete()
        } catch (error) {
            throw error
        }
    }

    static async updatePacient (pacientEmail, pacientData){
        try {
            await firestore.collection('pacients').doc(pacientEmail).update(pacientData)
            const pacientUpdated = firebase.collection('pacients').doc(pacientEmail).get()
            return{
                pacientUpdated: pacientUpdated.data()
            }
        } catch (error) {
            throw error
        }
    }
}

module.exports = Pacient