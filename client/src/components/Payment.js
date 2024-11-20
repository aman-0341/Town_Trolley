import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';

/*var fetch = require('node-fetch');
var requestOptions = {
  method: 'GET',
};

fetch("https://api.geoapify.com/v1/geocode/autocomplete?text=Mosco&apiKey=5fbb3433d28849a5aea9e63a93c7ed5f", requestOptions)
  .then(response => response.json())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));*/
    
export default function Payment() {
    const [cartData, setCartData] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const location = useLocation();
    const [status, setstatus] = useState("")

    useEffect(() => {
        axios.post("http://localhost:7000/checkExpire", null, {
            headers: {
                "authorization": `Bearer ${token}`
            }
        }).then(res => {
            console.log(res);
            const response = res.data;
            if (response === "Token is valid") {
                const { cart, total } = location.state;
                setCartData(cart);
                setCartTotal(total);
                console.log(cart);
                console.log(total);
            } else {
                navigate("/login");
            }
        }).catch(error => {
            console.error("There was an error checking the token!", error);
            navigate("/login");
        });

    }, [token, location.state, navigate]);

    function handleDetailsSubmit(event) {
        event.preventDefault();
        const data = {
            cartData: cartData,
            cartTotal: cartTotal,
            name: document.getElementById("name").value,
            phone: document.getElementById("phone").value,
            address: document.getElementById("address").value,
        };
        console.log(data);
        axios.post("http://localhost:7000/paymentSuccess", data, {
            headers: {
                "authorization": `Bearer ${token}`
            }
        }).then(() => {
            setstatus("Ordered")
            navigate("/order-receipt", { state: { cartData: cartData, cartTotal: cartTotal} });

        }).catch(error => {
            console.error("There was an error processing the payment!", error);
        });
    }

    return (
        <section className='productsPagePayment'>
            <div className='productsPagePaymentLeft'>
                <div className="productsPagePaymentLeftLogoContainer">
                    <div className="productsPagePaymentLeftLogo"></div>
                </div>
                <div className='productsPagePaymentLeftHeading'>Enter Details to place order</div>
                <div className='productsPagePaymentLeftContainer'>
                    <form className='productsPagePaymentLeftContainerform' onSubmit={handleDetailsSubmit}>
                        <div className='productsPagePaymentLeftContainerformElement'>
                            <span>Name</span>
                            <input type='text' id='name' placeholder='name' required />
                        </div>
                        <div className='productsPagePaymentLeftContainerformElement'>
                            <span>Phone</span>
                            <input type='tel' id='phone' placeholder='phone' required />
                        </div>
                        <div className='productsPagePaymentLeftContainerformElementTextarea'>
                            <span>Address</span>
                            <textarea id='address' placeholder='address' required />
                        </div>
                        <div className='productsPagePaymentLeftContainerformElementButton'>
                            <button type='submit'>next →</button>
                        </div>
                    </form>
                </div>
            </div>
            <div className='productsPagePaymentRight'>

            </div>
        </section>
    );
}
