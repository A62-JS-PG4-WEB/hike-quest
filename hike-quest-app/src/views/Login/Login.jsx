import { useContext, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../../state/app.context";
import { loginUser } from "../../services/auth.service";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Login component handles user authentication.
 *
 * This component provides a login form where users can enter their email and password.
 * If successful, it updates the application state with the user's information and navigates
 * the user to the previous page or the homepage.
 *
 * @component
 * @example
 * // Example usage:
 * // <Login />
 *
 * @returns {JSX.Element} The Login component
 */
export default function Login() {
    const [user, setUser] = useState({
        email: '',
        password: '',
    });
    const { setAppState } = useContext(AppContext);
    const navigate = useNavigate();
    const location = useLocation();

    /**
     * Handles input changes and updates the user state.
     *
     * @param {string} prop - The property of the user object to update (e.g., 'email', 'password').
     * @returns {function} A function that updates the user state based on the input value.
     */
    const updateUser = prop => e => {
        setUser({
            ...user,
            [prop]: e.target.value,
        });
    };

    /**
     * Handles the login process by validating the user's credentials and updating the app state.
     */
    const login = async () => {
        if (!user.email || !user.password) {
            return toast.error('No credentials provided!');
        }

        try {
            const credentials = await loginUser(user.email, user.password);
            setAppState({
                user: credentials.user,
                userData: null,
            });
            navigate(location.state?.from.pathname ?? '/');
            toast.success('Successfully logged in');

        } catch (error) {
            toast.error(error.message);
        }
    }

    return (
        <div className="loginContainer">
            <div className="loginItems">
                <h1 className="loginTitle">Login</h1>

                <label className="loginLabel" htmlFor="email">Email: </label>
                <input className="loginInput" placeholder='Enter your email...' value={user.email} onChange={updateUser('email')} type="text" name="email" id="email" t /><br />

                <label className="loginLabel" htmlFor="password">Password: </label>
                <input className="loginInput" placeholder='Enter your password' value={user.password} onChange={updateUser('password')} type="password" name="password" id="password" /><br />

                <button className="loginButton" onClick={login}>Login</button>
            </div>
        </div>

    )
}