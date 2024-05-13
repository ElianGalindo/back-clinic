//const bcrypt = require('bcrypt')
const admin = require('../config/firebase')
const IPacient = require('../interfaces/IPacient')
const firestore = admin.firestore()
const storage = admin.storage()

class Pacient extends IPacient {
    constructor (email, nombre, apaterno, amaterno, direccion, telefono, edad, sexo, image){
        super()
        this.email = email,
        this.nombre = nombre,
        this.apaterno = apaterno,
        this.amaterno = amaterno,
        this.direccion = direccion,
        this.telefono = telefono,
        this.edad = edad,
        this.sexo = sexo,
        this.image = image
    }
    static async createPacient (email, nombre, apaterno, amaterno, direccion, telefono, edad, sexo, image) {
        try {
            const pacient = firestore.collection('pacients').doc(email)
            const imageRef = storage.ref(`pacients/${email}/image`) // Create a reference to the image in Firebase Storage
            await imageRef.put(image) // Upload the image to Firebase Storage
            const imageUrl = await imageRef.getDownloadURL() 
            await pacient.set({
                email,
                nombre,
                apaterno,
                amaterno,
                direccion,
                telefono,
                edad,
                sexo,
                image: imageUrl
            })
            return new Pacient(email, nombre, apaterno, amaterno, direccion, telefono, edad, sexo, imageUrl)
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
                return new Pacient(pacientData.email, pacientData.nombre, pacientData.apaterno, pacientData.amaterno, pacientData.direccion, pacientData.telefono, pacientData.edad, pacientData.sexo)
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