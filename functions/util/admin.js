const admin = require('firebase-admin');

admin.initializeApp();

const db = admin.firestore();

module.exports = { admin, db };

// export GOOGLE_APPLICATION_CREDENTIALS="/home/nithin/Downloads/dcstudies-8306c-firebase-adminsdk-x7nl7-d62eda2dfc.json"