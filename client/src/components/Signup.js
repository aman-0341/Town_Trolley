import React from 'react';
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [username, setUsername] = React.useState('');
    const [relation, setRelation] = React.useState('');
    const [error, setError] = React.useState('');
    const navigate = useNavigate();

    async function HandleSubmit(e) {
        e.preventDefault();
        if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }
        const data = {
            email: email,
            password: password,
            username: username,
            relation: relation
        };
        try {
            const res = await fetch("http://localhost:7000/submit", {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(data)
            });
            const result = await res.json();
            console.log(result);
            navigate("/login");
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <form className='Signup' onSubmit={HandleSubmit}>
            <div className='Login-Signup-logo'>
            </div>
            <div className='Title'>
                <span className='Title-heading'>Signup</span>
                <span className='Title-content'>Already have an account <span className="loginlink"><Link to="/login">Login</Link></span></span>
            </div>
            <div className='Form'>
                <span className='Form-element'>
                    <span>Username : </span>
                    <input required type="text" placeholder="Username.." onChange={(e) => setUsername(e.target.value)} />
                </span>
                <span className='Form-element'>
                    <span>Email : </span>
                    <input required type="email" placeholder="Email.." onChange={(e) => setEmail(e.target.value)} />
                </span>
                <span className='Form-element'>
                    <span>Password : </span>
                    <input required type='password' placeholder='Password..' onChange={(e) => setPassword(e.target.value)} />
                </span>
                {error && <p style={{color:"red"}} className="error-message">{error}</p>}
                <span className='Form-element-relation'>
                    <label>
                        <input required type='radio' name='relation' value="customer" checked={relation === 'customer'} onChange={() => setRelation('customer')} />
                        Customer
                    </label>
                    <label>
                        <input required type='radio' name='relation' value="seller" checked={relation === 'seller'} onChange={() => setRelation('seller')} />
                        Seller
                    </label>
                    <label>
                        <input required type='radio' name='relation' value="partner" checked={relation === 'partner'} onChange={() => setRelation('partner')} />
                        Transportation
                    </label>
                </span>
            </div>
            <div className='Login-Signup-button'>
                <button type='submit'>Signup</button>
            </div>
        </form>
    );
}
