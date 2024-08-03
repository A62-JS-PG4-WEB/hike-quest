import { signInWithEmailAndPassword, signOut } from "firebase/auth"
import { auth } from "../config/firebase-config"

export const loginUser = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
}

export const logoutUser = () => {
  return signOut(auth);
};
