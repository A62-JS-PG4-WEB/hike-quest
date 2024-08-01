import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getDatabase } from "firebase/database"


export const firebaseConfig = {
    apiKey: "AIzaSyD-sQjcTOVBa9yEv6FXNreM9nJCu91-254",
    authDomain: "hike-quest-8d75b.firebaseapp.com",
    projectId: "hike-quest-8d75b",
    storageBucket: "hike-quest-8d75b.appspot.com",
    messagingSenderId: "745286466348",
    appId: "1:745286466348:web:c7afdaa28929c87c3f8a89",
    databaseURL: "https://hike-quest-8d75b-default-rtdb.europe-west1.firebasedatabase.app/"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);