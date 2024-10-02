// import firebase from 'firebase/compat/app';
// import 'firebase/compat/auth';
// import 'firebase/compat/firestore';
// import 'firebase/compat/storage';


// const app = firebase.initializeApp({
   
//     apiKey: "AIzaSyBo-qBnzLcxDdgF6mrTwVpPmGHGK8uL9e8",
//     authDomain: "box-app-73ed3.firebaseapp.com",
//     projectId: "box-app-73ed3",
//     storageBucket: "box-app-73ed3.appspot.com",
//     messagingSenderId: "986606498885",
//     appId: "1:986606498885:web:ebcc85ecf09da78d309f2c"
      
// });
// const firestore = app.firestore();

// export const database = {
//     folders: firestore.collection("folders"),
//     files: firestore.collection("files"),
//     formatDoc: doc => {
//         return {
//             id: doc.id,
//             ...doc.data()
//         }
//     },
//     getCurrentTimestamp: firebase.firestore.FieldValue.serverTimestamp
// }

// export const storage = app.storage();
// export const auth = app.auth();
// export default app;

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const app = firebase.initializeApp({
    apiKey: "AIzaSyBo-qBnzLcxDdgF6mrTwVpPmGHGK8uL9e8",
    authDomain: "box-app-73ed3.firebaseapp.com",
    projectId: "box-app-73ed3",
    storageBucket: "box-app-73ed3.appspot.com",
    messagingSenderId: "986606498885",
    appId: "1:986606498885:web:ebcc85ecf09da78d309f2c"
});

const firestore = app.firestore();

// Make sure you export a reference to the 'users' collection
export const database = {
    users: firestore.collection("users"), // Add this line
    folders: firestore.collection("folders"),
    files: firestore.collection("files"),
    formatDoc: doc => {
        return {
            id: doc.id,
            ...doc.data()
        }
    },
    getCurrentTimestamp: firebase.firestore.FieldValue.serverTimestamp
};

export const storage = app.storage();
export const auth = app.auth();
export default app;
