import React from "react";
import Auth from "./pages/Auth";
import {Routes, Route} from "react-router-dom"
import Home from "./pages/Home"
import LandingPage from "../src/pages/LandingPage";
import Payment from "./components/Payment";
import ErrorPage from "./pages/404";
import OrderPlaced from "./components/ordersuccess"
import OrderReceipt from "./components/reciept";
import Support from "./components/support";
import CustomerCare from "./components/customercare.js";

export default function App(){
    return(
        <section>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/signup" element={<Auth />} />
                <Route path="/login" element={<Auth/>} />
                <Route path="/home" element={<Home />}/>
                <Route path="/home/:section" element={<Home />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/order-receipt" element={<OrderPlaced />} />
                <Route path="/viewSummary" element={<OrderReceipt />} />
                <Route path="/support" element={<Support />} />
                <Route path="/customercare" element={<CustomerCare />} />
                <Route path="*" element={<ErrorPage />} />
            </Routes>   
        </section>
    ) 
}