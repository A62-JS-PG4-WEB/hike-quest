import { useContext, useState } from "react"
import { registerUser } from "../../services/auth.service"
import { AppContext } from "../../state/app.context"
import { useNavigate } from "react-router-dom"
import { createUserHandle, getUserByEmail, getUserByHandle } from "../../services/users.service"


export default function Register() {
    const [user, setUser] = useState({
        handle: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });
    const { setAppState } = useContext(AppContext);
    const navigate = useNavigate();

    const updateUser = prop => e => {
        setUser({
            ...user,
            [prop]: e.target.value,
        })
    };

    const register = async () => {
        if (!user.email || !user.password) {
            return alert('No credentials provided!');
        }
        // if (user.firstName.length < MIN_THREAD_TITLE) {
        //     return alert('First name too short!');
        //   }
        //   if (user.firstName.length > MAX_THREAD_TITLE) {
        //     return alert('First name too long!');
        //   }
        //   if (thread.content.length < MIN_THREAD_CONTENT) {
        //     return alert('Last name too short!');
        //   }
      
        //   if (thread.content.length > MAX_THREAD_CONTENT) {
        //     return alert('Last name too long!');
        //   }
        try {
            const userDB = await getUserByEmail(user.email);
            if (userDB) {
                return alert(`User {${user.email}} already exists!`);
            }

            const userFromDB = await getUserByHandle(user.handle);
            if (userFromDB) {
                return alert(`User {${user.handle}} already exists!`);
            }
            const credential = await registerUser(user.email, user.password);
            await createUserHandle(user.handle, user.firstName, user.lastName, credential.user.uid, user.email);
            setAppState({ user: credential.user, userData: null });
            navigate('/');
        } catch (error) {
            alert(error.message);
        }
    };


    return (
        <>
            <h1>Register</h1>
            <label htmlFor="handle">Username: </label>
            <input value={user.handle} onChange={updateUser('handle')} type="text" name="handle" id="handle" /><br /><br />
            <label htmlFor="firstName">First name: </label>
            <input value={user.firstName} onChange={updateUser('firstName')} type="text" name="firstName" id="firstName" /><br /><br />
            <label htmlFor="lastName">Last name: </label>
            <input value={user.lastName} onChange={updateUser('lastName')} type="text" name="lastName" id="lastName" /><br /><br />
            <label htmlFor="email">Email: </label>
            <input value={user.email} onChange={updateUser('email')} type="text" name="email" id="email" /> <br /><br />
            <label htmlFor="password">Password: </label>
            <input value={user.password} onChange={updateUser('password')} type="password" name="password" id="password" /> <br />
            <button onClick={register}>Register</button>
        </>
    )


}