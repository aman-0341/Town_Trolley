import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function About() {
    const navigate = useNavigate();
    const [data, setData] = useState({ userData: {}, orderDetails: { Orders: [] } });
    const relation = localStorage.getItem('relation');
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (relation === "customer" && token) {
            axios.get("http://localhost:7000/getCustomerProfile", {
                headers: {
                    "authorization": `Bearer ${token}`
                }
            })
                .then(res => {
                    const fetchedData = res.data;
                    console.log(fetchedData);
                    setData(fetchedData);
                })
                .catch(error => {
                    console.error("There was an error fetching the customer profile!", error);
                });
        }
        if ( relation === "seller" && token){
            axios.get("http://localhost:7000/getSellerProfile",{
                headers:{
                    "authorization": `Bearer ${token}`
                }
            }).then(res => {
                const fetchedData = res.data;
                console.log(fetchedData);
                setData(fetchedData);
            })
            .catch(error => {
                console.error("There was an error fetching the customer profile!", error);
            });
        }
        if(relation==="partner" && token){
            axios.get("http://localhost:7000/partnerprofile",{
                headers:{
                    "authorization": `Bearer ${token}`
                }
            }).then(res => {
                const fetchedData = res.data;
                console.log(fetchedData);
                setData(fetchedData);
            })
            .catch(error => {
                console.error("There was an error fetching the customer profile!", error);
            });
        }
    }, [relation, token]);

    function handleLogout() {
        localStorage.removeItem('token');
        localStorage.removeItem('relation');
        window.location.reload();
    }

    function handleOrderClick(order) {
        navigate('/viewSummary', { state: { cart: order.CartData, total: order.CartTotal } });
    }

    const { userData, orderDetails } = data;

    return (
        <section className='homePageProfile'>
            {relation === "customer" && userData ? (
                <section className='homePageProfileBase'>
                    <section className='homePageProfileHeader'>
                        <section className='homePageProfileContainer'>
                            <div className='homePageProfileHeaderPicture'>
                            </div>
                            <div className='homePageProfileHeaderContent'>
                                <div className='homePageProfileHeaderContentElement'>
                                    <span>UserName :</span>
                                    <div>{userData.username}</div>
                                </div>
                                <div className='homePageProfileHeaderContentElement'>
                                    <span>Email : </span>
                                    <div>{userData.email}</div>
                                </div>
                                <div className='homePageProfileHeaderContentElement'>
                                    <span>UserId : </span>
                                    <div>{userData.userId}</div>
                                </div>
                                <div className='homePageProfileHeaderContentElement'>
                                    <span>Relation : </span>
                                    <div>{userData.relation}</div>
                                </div>
                                <div className='homePageProfileHeaderContentElement'>
                                    <button onClick={handleLogout}>Logout</button>
                                </div>
                            </div>
                        </section>
                    </section>
                    <div className='homePageProfileOrders'>
                        <div className='homePageProfileOrdersHeading'>
                            Your Orders
                        </div>
                        <div className='homePageProfileOrdersContent'>
                            {orderDetails.Orders.length > 0 ? orderDetails.Orders.map((order, index) => (
                                <div key={index} className='orderItem' onClick={() => handleOrderClick(order)}>
                                    <div><span className='orderItemElement'>Order Date: </span><span>{new Date(order.Date).toLocaleDateString()}</span></div>
                                    <div><span className='orderItemElement'>Status: </span><span>{order.Pending ? 'Pending' : 'Completed'}</span></div>
                                    <div><span className='orderItemElement'>Total Amount:</span> <span>Rs.{order.CartTotal}</span></div>
                                </div>
                            )) : (
                                <div>No orders found</div>
                            )}
                        </div>
                    </div>
                </section>
            ) : (
                <section>
                    <section className='homePageProfileBaseSeller'>
                    <section className='homePageProfileHeaderSeller'>
                        <section className='homePageProfileContainerSeller'>
                            <div className='homePageProfileHeaderPicture'>
                            </div>
                            <div className='homePageProfileHeaderContent'>
                                <div className='homePageProfileHeaderContentElement'>
                                    <span>UserName :</span>
                                    <div>{userData.username}</div>
                                </div>
                                <div className='homePageProfileHeaderContentElement'>
                                    <span>Email : </span>
                                    <div>{userData.email}</div>
                                </div>
                                <div className='homePageProfileHeaderContentElement'>
                                    <span>UserId : </span>
                                    <div>{userData.userId}</div>
                                </div>
                                <div className='homePageProfileHeaderContentElement'>
                                    <span>Relation : </span>
                                    <div>{userData.relation}</div>
                                </div>
                                <div className='homePageProfileHeaderContentElement'>
                                    <button onClick={handleLogout}>Logout</button>
                                </div>
                            </div>
                        </section>
                    </section>
                </section>
                </section>
            )}
        </section>
    );
}
