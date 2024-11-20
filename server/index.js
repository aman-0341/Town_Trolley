import express from "express"
import cors from "cors"
import  {createUser , findProducts , AddOrder ,partnerProfile, getCustomerProfile ,markQueryAsSolved,removeQuery ,getSellerProfile , getPartnerProfile ,fetchquery,setPartnerOrder,setquery}  from "./mongo.js"
import { jwtDecode } from "jwt-decode"
import {LoginMiddleware  , tokenCheck} from "./middleware.js"
import {checkExpire } from "./jwt.js"
import {AddProduct , SellerProfile} from "./mongo.js"


const app = express() 
app.use(cors())
app.use(express.json()) 
const PORT = 7000
   
app.setMaxListeners(20)
 
app.post("/login", LoginMiddleware, (req, res) => {
    const token = res.locals.Token
    const relation  = res.locals.relation
    res.status(200).send({"token" : token , "relation" : relation})
}); 

app.post("/submit",(req,res) => {
    const {email,password,username,relation} = req.body
    if(createUser(username,email,password,relation)){
        res.status(200).json({"feedback" : "User Created Sucessfully"})
    }else{
        res.status(401).json( {"feedback":"User already exists"})
    }
})   

app.post("/checkExpire", (req, res) => {
    console.log("checkExpire")
    const header = req.headers["authorization"]
    const token = header.split(" ")[1]
    const result = checkExpire(token)
    console.log(result)
    if (!result) {
        res.status(200).send("Token is valid")
    } else {
        res.status(401).send("Token is Expired")
    }
});

app.post("/paymentSuccess",tokenCheck, (req,res) => {

    const {cartData,cartTotal,name,phone,address,Date} = req.body
    const header = req.headers["authorization"]
    const token = header.split(" ")[1]
    const email = jwtDecode(token).email
    AddOrder(cartData,cartTotal,name,phone,address,email)
    res.status(200).send("Order Placed Sucessfully")
})
app.post("/addproduct",tokenCheck,(req,res)=>{
    const {productName, category , price , quantity , harvestDate ,location , address, description} = req.body
    const header = req.headers["authorization"]
    const token = header.split(" ")[1]
    const email = jwtDecode(token).email
    const result = AddProduct(email , productName, category , price , quantity , harvestDate ,location,address, description)
    if(result){
        res.status(200).send("Data Added Sucessfully")
    }else{
        res.status(500).send("Error")
    }
})
app.get("/Products" , tokenCheck , async (req,res)=>{
    const data = await findProducts()
    res.status(200).json(data)
})

app.get("/SellerProfile" , tokenCheck , async (req,res)=>{
    const email = res.locals.email
    const data = await SellerProfile(email)
    if(data){
        res.status(200).json(data)
    }else{
        res.status(401).json("Server Error")
    }
})
app.get("/getSellerProfile", tokenCheck , async(req , res)=>{
    const header = req.headers["authorization"]
    const token = header.split(" ")[1]
    const email = jwtDecode(token).email
    const data = await getSellerProfile(email)
    if(data){
        res.status(200).json(data)
    }else{
        res.status(401).json("server error")
    }
})
app.get("/getCustomerProfile" , tokenCheck , async (req,res)=> {
    const header = req.headers["authorization"]
    const token = header.split(" ")[1]
    const email = jwtDecode(token).email
    const data = await getCustomerProfile(email)
    if(data){
        res.status(200).json(data)
    }else{
        res.status(401).json("Server Error")
    }
})
app.get("/getParterProfile" , tokenCheck , async (req , res) => {
    const header = req.headers["authorization"]
    const token = header.split(" ")[1]
    const email = jwtDecode(token).email
    const data = await getPartnerProfile(email) 
    if(data){
        console.log(data)
        res.status(200).json(data)

    }else{
        res.status(401).json("Server Error")
    }
})
app.get("/partnerprofile",tokenCheck,async(req,res)=>{
    const header = req.headers["authorization"]
    const token = header.split(" ")[1]
    const email = jwtDecode(token).email
    const data = await partnerProfile(email) 
    if(data){
        console.log(data);
        res.status(200).json(data);
    }else{
        res.status(401).json("server error")
    }
})
app.post("/setPartnerOrder", tokenCheck, async (req, res) => {
    try {
        const header = req.headers["authorization"];
        const token = header.split(" ")[1];
        const email = jwtDecode(token).email;
        const { data } = req.body;
        await setPartnerOrder(email, data);
        res.status(200).send("data added")
    } catch (error) {
        console.error("Error in /setPartnerOrder route:", error);
        res.status(500)
    }
});

app.post('/support',(req, res) => {
    const { name, email, subject, message } = req.body;
   try{
    if(req.body){
        const result = setquery(name,email,subject,message)
        res.status(200).json({ message: 'Your request has been submitted successfully!' });
    }
    else{
        res.status(400).json({ message: 'Error While Submitting your Request!' });
    }
   }
   catch(err){
    console.log(err)
    res.status(400).json({ message: 'Server Error!' });
   }
  
});

app.get('/queries', async (req, res) => {
    try {
        const queriesData = await fetchquery(); // Call the fetchquery function to get the queries data
        res.json(queriesData); // Send the queries data as JSON response
    } catch (error) {
        console.error('Error fetching queries:', error);
        res.status(500).json({ error: 'Failed to fetch queries' }); // Send an error response if fetching fails
    }
});

app.post('/queries/:id/markAsSolved', markQueryAsSolved);
app.delete('/queries/:id', removeQuery);
  
app.listen(PORT,()=>{
    console.log(`Server Running on ${PORT}` )
}) 