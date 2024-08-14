import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../config/firebase-config";

/**
 * Registers a new user with the provided email and password.
 *
 * @param {string} email - The email address of the new user.
 * @param {string} password - The password for the new user.
 * @returns {Promise<UserCredential>} A promise that resolves with the user credential when registration is successful.
 * @throws {FirebaseError} Throws an error if registration fails.
 */
export const registerUser = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

/**
 * Logs in a user with the provided email and password.
 *
 * @param {string} email - The email address of the user.
 * @param {string} password - The password for the user.
 * @returns {Promise<UserCredential>} A promise that resolves with the user credential when login is successful.
 * @throws {FirebaseError} Throws an error if login fails.
 */
export const loginUser = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

/**
 * Logs out the currently authenticated user.
 *
 * @returns {Promise<void>} A promise that resolves when the user is successfully logged out.
 */
export const logoutUser = () => {
  return signOut(auth);
};
