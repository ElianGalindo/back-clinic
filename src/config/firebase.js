const admin = require ('firebase-admin')
const serviceAccount = require('./serviceAccountKeys.json')

//Inicializar Firebase Admin SDK
admin. initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "clinicacn-a1405.appspot.com"
})


module.exports = admin