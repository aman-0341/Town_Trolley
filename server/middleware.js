import { generateToken } from "./jwt.js"
import { loginUser } from "./mongo.js";
import { checkExpire } from "./jwt.js"
import { jwtDecode } from "jwt-decode"

export async function LoginMiddleware(req, res, next) {
    const { email, password } = req.body;
    const { checkUser, value, message } = await loginUser(email, password);

    if (checkUser) {
        const Token = generateToken(email, value.relation);
        res.locals.Token = Token;
        res.locals.relation = value.relation;
        console.log(Token);
        next();
    } else {

        res.status(401).json({message})
        console.log(message);
    }
}


export function tokenCheck(req, res, next) {
    const header = req.headers["authorization"]
    const token = header.split(" ")[1]
    const email = jwtDecode(token).email
    if (checkExpire(token) === false) {
        res.locals.email = email
        next()
    } else {
        res.status(401).send("unauthorized")
    }
}