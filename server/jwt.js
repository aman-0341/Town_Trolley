import jwt from "jsonwebtoken"
const Key = "77b02b54a1f5abf66d2a890971a82e66b72ef3e4b92e778ab5f6ae380d530afa"

export function generateToken(email , relation){
    return jwt.sign({email , relation} , Key , {expiresIn : "30m"})
}         
export function decodeToken(token){
    return jwt.decode(token)
}   
export function checkExpire(token){
    const decoded = decodeToken(token)
    const time = decoded.exp
    console.log(time)
    if( time > Date.now() / 1000){
        console.log("token accepted")
        return false
        
    }else{
        console.log("token exp")
        return true
    }
} 