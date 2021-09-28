import "./login.css"
import {Room,Cancel} from "@material-ui/icons"
import { useRef,useState } from "react";
import axios from "axios"

export default function Login({setShowLogin,myStorage,setCurrentUser}) {
    const [error,setError] = useState(false);
    const userRef = useRef();
    const passwordRef = useRef();

    const handleSubmit = async (e) =>{
        e.preventDefault();
        const user = {
            username:userRef.current.value,
            password:passwordRef.current.value
        }
        try{
            const res = await axios.post("/users/login",user)
            myStorage.setItem("user",res.data.username);
            setCurrentUser(res.data.username);
            setShowLogin(false);
            setError(false)
        }catch(err){
            setError(true)
        }
    }
    
    return (
        <div className="loginContainer">
            <div className="logo">
                <Room />
                Luther Pin
            </div>
                <form onSubmit={(e)=>{handleSubmit(e)}}>
                <input type="text" placeholder="Username" ref={userRef}/>
                <input type="password" placeholder="Password" ref={passwordRef}/>
                <button className="loginBtn">Login</button> 
                {error && <span className="failure">Something went wrong!</span>}
            </form>
            <Cancel className="loginCancel" onClick={()=>setShowLogin(false)}/>
        </div>
    )
}
