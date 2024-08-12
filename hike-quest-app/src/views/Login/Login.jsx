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
        } catch (error) {
            toast.error(error.message);
        }
    }

    return (
        <div>
            <h1>Login</h1>
            <label htmlFor="email">Email: </label>
            <input value={user.email} onChange={updateUser('email')} type="text" name="email" id="email" /><br /><br />
            <label htmlFor="password">Password: </label>
            <input value={user.password} onChange={updateUser('password')} type="password" name="password" id="password" /><br />
            <button onClick={login}>Login</button>
        </div>
    )
}