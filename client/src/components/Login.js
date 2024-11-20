import React from'react';
import { Link , useNavigate } from "react-router-dom";
  
export default function Login(){
    //userVariables
    const [email,setEmail] = React.useState('')
    const [password,setPassword] = React.useState('')
    
     
    const navigate = useNavigate()


    async function HandleSubmit(e) {
        e.preventDefault();
        const data = {
            email: email,
            password: password
        };
    
        try {
            console.log(data)
            const res = await fetch("http://localhost:7000/login", {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(data)
            });
            const resData = await res.json();
            if(res.status === 200){
                const token = resData.token
                const relation = resData.relation
                console.log(token)
                localStorage.setItem("token" , token)
                localStorage.setItem("relation" , relation)
                navigate("/home")   
            }else{
                console.log(resData.message)
                alert(resData.message || "Unknown error occurred")
            }
            
        } catch (error) {  
            console.error(error);
        }
    }
    
    return(
        <form className='Login' onSubmit={HandleSubmit}>
            <div className='Login-Signup-logo'>
            </div>
            <div className='Title'>
                <span className='Title-heading'>Login</span>
                <span className='Title-content'>Don't have an account <span className="signuplink"><Link to="/signup">Signup</Link></span></span>
            </div>
            <div className='Form'>
                <span className='Form-element'>
                    <span>Email : </span>
                    <input required type="email" placeholder="Email.."onChange={(e)=>setEmail(e.target.value)}/>
                </span>
                <span className='Form-element'>
                    <span>Password : </span>
                    <input required type='password' placeholder='Password..' onChange={(e) => setPassword(e.target.value)}/>
                </span>
            </div>
            <div className='Login-Signup-button'>
                <button type='submit'>Login</button>
            </div>
        </form>
    )
    
}           
