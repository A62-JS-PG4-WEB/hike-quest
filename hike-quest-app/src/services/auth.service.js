import { signInWithPopup } from "firebase/auth"
import { auth } from "../config/firebase-config"

export const loginUser = (email, password) => {
    return signInWithPopup(auth, email, password)
}