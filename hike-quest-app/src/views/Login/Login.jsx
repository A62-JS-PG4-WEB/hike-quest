import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useContext, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import { auth } from "../../config/firebase-config";
import { AppContext } from "../../state/app.context";
import { loginUser } from "../../services/auth.service";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
    const [user, setUser] = useState({
        email: '',
        password: '',
    });
    const { setAppState } = useContext(AppContext);
    const navigate = useNavigate();
    const location = useLocation();

    const updateUser = prop => e => {
        setUser({
            ...user,
            [prop]: e.target.value,
        })
    };


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