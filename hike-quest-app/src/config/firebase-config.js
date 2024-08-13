import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

/**
 * Firebase configuration object containing the necessary parameters
 * to initialize a Firebase app.
 *
 * @type {object}
 * @property {string} apiKey - The API key for Firebase authentication.
 * @property {string} authDomain - The domain used for Firebase authentication.
 * @property {string} projectId - The Firebase project ID.
 * @property {string} storageBucket - The Cloud Storage bucket for Firebase.
 * @property {string} messagingSenderId - The sender ID for Firebase Cloud Messaging.
 * @property {string} appId - The unique identifier for the app.
 * @property {string} databaseURL - The URL of the Firebase Realtime Database.
 */
export const firebaseConfig = {
    apiKey: "AIzaSyD-sQjcTOVBa9yEv6FXNreM9nJCu91-254",
    authDomain: "hike-quest-8d75b.firebaseapp.com",
    projectId: "hike-quest-8d75b",
    storageBucket: "hike-quest-8d75b.appspot.com",
    messagingSenderId: "745286466348",
    appId: "1:745286466348:web:c7afdaa28929c87c3f8a89",
    databaseURL: "https://hike-quest-8d75b-default-rtdb.europe-west1.firebasedatabase.app/"
};

/**
 * Initializes the Firebase app with the provided configuration.
 * Exports the initialized Firebase Authentication and Realtime Database instances.
 */
const app = initializeApp(firebaseConfig);

/**
 * Firebase Authentication instance initialized with the app configuration.
 *
 * @type {import("firebase/auth").Auth}
 */
export const auth = getAuth(app);

/**
 * Firebase Realtime Database instance initialized with the app configuration.
 *
 * @type {import("firebase/database").Database}
 */
export const db = getDatabase(app);
