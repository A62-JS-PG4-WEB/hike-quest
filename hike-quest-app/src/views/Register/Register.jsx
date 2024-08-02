import { useContext, useState } from "react"
import { registerUser } from "../../services/auth.service"
import { AppContext } from "../../state/app.context"
import { useNavigate } from "react-router-dom"

export default function Register() {

    const [user, setUser] = useState({
        email: '',
        password: ''
    })

    const {setAppState} = useContext(AppContext)
    const navigate = useNavigate()


    const updateUser = prop => e => {
        setUser({
            ...user,
            [prop]: e.target.value,
        })
    }

    const register = async () => {
        if(!user.email || !user.password) {
            return alert('No credentials provided!')
        }

        

        try {
            const credential = await registerUser(user.email, user.password)
            setAppState({user: credential.user , userData: null})
            navigate('/')
        } catch (error) {
            alert(error.message)
        }


    }

    return (
        <>
        <h1>Register</h1>
        <label htmlFor="email">Email: </label>
        <input value={user.email} onChange={updateUser('email')} type="text" name="email" id="email" /> <br /><br />
        <label htmlFor="password">Password: </label>
        <input value={user.password} onChange={updateUser('password')} type="password" name="password" id="password" /> <br />
        <button onClick={register}>Register</button>
        </>


    )


}