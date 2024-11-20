import React from "react";
import { Link } from "react-router-dom";

export default function Header(props){
    return(
        <section className="header-items">
            <Link to={`/home/${props.S1}`}  >{props.S1}</Link>
            <Link to={`/home/${props.S2}`}  >{props.S2}</Link>
            <Link to={`/home/${props.S3}`}  >{props.S3}</Link>
            <Link to={`/home/${props.S4}`}  >{props.S4}</Link>
        </section>
    )
}