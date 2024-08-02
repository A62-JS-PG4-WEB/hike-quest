import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../config/firebase-config"

export const loginUser = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
}