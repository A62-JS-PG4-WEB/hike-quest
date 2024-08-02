import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useContext, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import { auth } from "../../config/firebase-config";


export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] =useState("")

    const signin = async() =>{
await signInWithPopup(auth, email, password)
    }

  return (
    <div>
      <input placeholder="Email..."
      onChange={(e) => setEmail(e.target.value)}/>
      <input placeholder="Password..."
      type="password"
       onChange={(e) => setPassword(e.target.value)}/>
      <button onClick={signin}> Sign in</button>
    </div>
  )
}