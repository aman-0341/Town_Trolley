import React from "react";
import { useLocation } from "react-router-dom";
import Login from "../components/Login";
import Signup from "../components/Signup";
import "../styles/app.css";

export default function Auth() {

    const location = useLocation()
    return (
        <section className="auth-base">
            <section className="auth-container">
                <section className="auth-innercontainer">
                    {
                        location.pathname === "/login" || location.pathname ==="/" ? <Login /> : <Signup />
                    }
                </section>
            </section>
            <section className="auth-illustration">
                
            </section>
        </section>
    );
}