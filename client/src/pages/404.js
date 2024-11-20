import React from "react"
import svg from "../assets/404 Error Page not Found with people connecting a plug-bro.svg"

function ErrorPage(){

    return(
        <div style={{width:"100vw",height:"100vh",display:"flex",justifyContent:"center",alignContent:"center"}}>
            <img src={svg} alt="<h1>404-Not Found</h1>" style={{
                width:"100%",height : "100%"
            }}></img>
        </div>
    )
}

export default ErrorPage