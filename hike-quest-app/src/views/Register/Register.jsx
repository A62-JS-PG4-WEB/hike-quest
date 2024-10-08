import { useContext, useState } from "react"
import { registerUser } from "../../services/auth.service"
import { AppContext } from "../../state/app.context"
import { useNavigate } from "react-router-dom"
import { createUserHandle, getUserByEmail, getUserByHandle } from "../../services/users.service"
import { MAX_FIRSTNAME, MAX_LASTNAME, MIN_FIRSTNAME, MIN_LASTNAME } from "../../common/constants"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Register.css'

/**
 * Register component handles user registration by validating user input, 
 * checking for existing users, and creating a new user account.
 *
 * @component
 * @example
 * return (
 *   <Register />
 * )
 *
 * @returns {JSX.Element} The rendered Register component.
 *
 * @typedef {Object} User
 * @property {string} handle - The user's unique handle.
 * @property {string} firstName - The user's first name.
 * @property {string} lastName - The user's last name.
 * @property {string} email - The user's email address.
 * @property {string} password - The user's password.
 * @property {string} confirmPassword - Confirmation of the user's password.
 * @property {boolean} isAdmin - Whether the user has admin privileges.
 * @property {boolean} isBlocked - Whether the user is blocked.
 *
 * @typedef {Object} AppState
 * @property {User|null} user - The authenticated user.
 * @property {Object|null} userData - Additional user data.
 */
export default function Register() {
    const [user, setUser] = useState({
        handle: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        isAdmin: false,
        isBlocked: false
    });
    const { setAppState } = useContext(AppContext);
    const navigate = useNavigate();

    /**
     * Updates the user state with the value from the input field.
     *
     * @param {string} prop - The property of the user object to update.
     * @returns {function} A function that updates the user state.
     */
    const updateUser = prop => e => {
        setUser({
            ...user,
            [prop]: e.target.value,
        });
    };

    /**
     * Handles the registration process by validating inputs, checking 
     * for existing users, and creating a new user account.
     *
     * @async
     * @function
     * @returns {Promise<void>} 
     */

    const register = async () => {

        if (!user.email.trim() || !user.password) {
            return toast.error('No credentials provided!');
        }
        if (user.password !== user.confirmPassword) {
            toast.info("Passwords do not match!");
            return;
        }

        if (user.firstName.length < MIN_FIRSTNAME) {
            return toast.error('First name too short!');
        }
        if (user.firstName.length > MAX_FIRSTNAME) {
            return toast.error('First name too long!');
        }
        if (user.lastName.length < MIN_LASTNAME) {
            return toast.error('Last name too short!');
        }

        if (user.lastName.length > MAX_LASTNAME) {
            return toast.error('Last name too long!');
        }
        try {
            const userDB = await getUserByEmail(user.email.trim());
            if (userDB) {
                return toast.error(`User {${user.email}} already exists!`);
            }

            const userFromDB = await getUserByHandle(user.handle);
            if (userFromDB) {
                return toast.error(`User {${user.handle}} already exists!`);
            }
            const credential = await registerUser(user.email.trim(), user.password.trim());
            await createUserHandle(user.handle, user.firstName, user.lastName, credential.user.uid, user.email, user.isAdmin, user.isBlocked);
            setAppState({ user: credential.user, userData: null });
            navigate('/');
            toast.success('Successfully registered');
        } catch (error) {
            toast.error(error.message);
        }
    };


    return (
        <>
            <div className="registerContainer">
                <h1 className="registerTitle">Register</h1>

                <label className="registerLabel" htmlFor="handle">Username: </label>
                <input className="registerInput" placeholder='Create a username...' value={user.handle} onChange={updateUser('handle')} type="text" name="handle" id="handle" /><br />

                <label className="registerLabel" htmlFor="firstName">First name: </label>
                <input className="registerInput" placeholder='Create a first name...' value={user.firstName} onChange={updateUser('firstName')} type="text" name="firstName" id="firstName" /><br />

                <label className="registerLabel" htmlFor="lastName">Last name: </label>
                <input className="registerInput" placeholder='Create a last name...' value={user.lastName} onChange={updateUser('lastName')} type="text" name="lastName" id="lastName" /><br />

                <label className="registerLabel" htmlFor="email">Email: </label>
                <input className="registerInput" placeholder='Create email...' value={user.email} onChange={updateUser('email')} type="text" name="email" id="email" /><br />

                <label className="registerLabel" htmlFor="password">Password: </label>
                <input className="registerInput" placeholder='Create a password...' value={user.password} onChange={updateUser('password')} type="password" name="password" id="password" /><br />

                <label className="registerLabel" htmlFor="confirmPassword">Confirm Password: </label>
                <input className="registerInput" placeholder='Confirm the password...' value={user.confirmPassword} onChange={updateUser('confirmPassword')} type="password" name="confirmPassword" id="confirmPassword" /><br />

                <button className="registerButton" onClick={register}>Register</button>
            </div>
        </>

    );
}