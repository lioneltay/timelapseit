const firebase = require("firebase/app")
require("firebase/firestore")
require("firebase/functions")
require("firebase/auth")

firebase.initializeApp({
  apiKey: "AIzaSyCRc0uxLhDmgl6x6PshIl6jmL8qott55is",
  authDomain: "onyamind-staging.firebaseapp.com",
  databaseURL: "https://onyamind-staging.firebaseio.com",
  projectId: "onyamind-staging",
  storageBucket: "onyamind-staging.appspot.com",
  messagingSenderId: "990926290122",
  appId: "1:990926290122:web:9bc7b229c4b13a9f3e8833",
  measurementId: "G-6G31QSBL1H",
})

const firestore = firebase.firestore()
const auth = firebase.auth()

console.log("emulating firestore")
// WORKAROUND: (experimentalForceLongPolling) Cypress is intercepting requests causing functions to fail https://github.com/cypress-io/cypress/issues/6350
firestore.settings({
  host: "localhost:8080",
  ssl: false,
  experimentalForceLongPolling: true,
})

console.log("emulating functions")
firebase.functions().useFunctionsEmulator("http://localhost:5001")

console.log("unpersisted auth")
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE)

async function doStuff() {
  const lists = await firestore
    .collection("taskList")
    .get()
    .then((res) => res.docs.map((doc) => doc.data()))

  console.log("lists: ", lists, lists.length)
}

doStuff()
