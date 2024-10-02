# Welcome to My Instagram
***
## Demo
You can check out the demo of this Dropbox clone [here](https://my-dropbox-app.vercel.app/).

## Task
Development of a serverless file synchronization application using ReactJS and Firebase that allows users to authenticate, upload files, and manage folders. The application should feature modern file sharing and storage functionalities.

## Description
This Dropbox-like app aims to replicate key features of popular file hosting services like Dropbox. The main features include:

- **User Authentication**: User authentication with Firebase for secure login and signup.
- **File Uploads**:Users can upload files and organize them into folders.
- **File Sharing**: Generate links to share files with others.
- **Folder Management**: Create, delete, and navigate through folders.
- **Profile Customization**: Edit profiles.
- **Responsive Design**:User-friendly interface that adapts to various screen sizes.

You can check out the demo of this Dropbox clone [here](https://my-dropbox-app.vercel.app/).

## Firebase Configuration  
To connect the application to Firebase, follow these steps:

    - 1. **Create a Firebase project** on [Firebase Console](https://console.firebase.google.com/).
    - 2. **Add a web app** to the Firebase project and obtain your Firebase configuration object.
    - 4. Enable Authentication: Go to Firebase Console, navigate to Authentication, and enable Email/Password sign-in.
    - 4. Set Up Firestore Database: Create necessary collections for users and posts.
    - 5. Set Up Storage: Use Firebase Storage to upload images and media for posts.
    - 6. Replace the placeholder in your project with the actual Firebase configuration in `firebase.js`:

        // firebase.js
        import firebase from 'firebase/compat/app';
        import 'firebase/compat/auth';
        import 'firebase/compat/firestore';
        import 'firebase/compat/storage';

        const app = firebase.initializeApp({
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_PROJECT_ID.appspot.com",
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
        appId: "YOUR_APP_ID",
        });

        const firestore = app.firestore();
        const storage = app.storage();
        const auth = app.auth();

        export { firestore, auth, storage };


## Installation

  1. Clone the repository:
        - `cd my_dropbox`  
  2. Install dependencies:
        - `npm install`
  3. Start the development server:
        - `npm start`

## Usage
 1. Login and Signup: Create an account or log in using your credentials.
 2. Upload Files: Click the "Upload File" button to add new files.
 3. Share Files: Generate shareable links for files to copy to the clipboard.
 4. Manage Folders: Create, delete, and navigate through folders to organize your files.

### The Core Team


<span><i>Made at <a href='https://qwasar.io'>Qwasar SV -- Software Engineering School</a></i></span>
<span><img alt='Qwasar SV -- Software Engineering Schools Logo' src='https://storage.googleapis.com/qwasar-public/qwasar-logo_50x50.png' width='20px' /></span>
