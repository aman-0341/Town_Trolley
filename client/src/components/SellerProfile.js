import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import axios from "axios";
import Footer from "../components/Footer";

export default function SellerProfile() {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const [ratingImage, setRatingImage] = useState(null);
    const [rating, setRating] = useState(0);
    const [responseData, setResponseData] = useState(null);
    const [isPlaceOrder, setPlaceOrder] = useState(true);
    const [historyOptions, sethistoryOptions] = useState(1);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        axios.get("http://localhost:7000/SellerProfile", {
            headers: {
                "authorization": `Bearer ${token}`
            }
        }).then(response => {
            const decoded = jwtDecode(token);
            const relation = decoded.relation;
            if (relation === 'customer') {
                navigate('/home/SellerProfile');
            } else {
                setResponseData(response.data);
                console.log(response.data);
            }
        }).catch(error => {
            console.error("There was an error fetching the seller profile!", error);
        });
    }, [token, navigate]);

    useEffect(() => {
        if (responseData && responseData.ReviewData) {
            setRatingImage(<div className="sellerProfileOverviewRatingImage"
                style={{ backgroundImage: `url(${require(`../assets/sellerPage/${responseData.ReviewData.Rating}star.png`)})` }}
            ></div>);
            setRating(responseData.ReviewData.Rating);
        }
    }, [responseData]);

    useEffect(() => {
        if (responseData && responseData.OrdersData) {
            let filteredOrders = [];
            switch (historyOptions) {
                case 1:
                    filteredOrders = responseData.OrdersData;
                    break;
                case 2:
                    filteredOrders = responseData.OrdersData.filter(order => order.Status === 'completed');
                    break;
                case 3:
                    filteredOrders = responseData.OrdersData.filter(order => order.Status === 'pending');
                    break;
                default:
                    filteredOrders = responseData.OrdersData;
            }
            setHistory(filteredOrders.map(order => (
                <div key={order.OrderId} className="sellerProfileContentHistoryDetailsRow">
                    <div className="sellerProfileContentHistoryDetailsRowSerialNo">{order.OrderId}</div>
                    <div className="sellerProfileContentHistoryDetailsRowProduct">{order.ProductName}</div>
                    <div className="sellerProfileContentHistoryDetailsRowDate">{order.HarvestDate}</div>
                    <div className="sellerProfileContentHistoryDetailsRowStatus">{order.Status}</div>
                </div>
            )));
        }
    }, [historyOptions, responseData]);

    function getTotalOrders() {
        return responseData?.ReviewData?.Total_Orders || 0;
    }

    function getCompletedOrders() {
        return responseData?.ReviewData?.Completed_Orders || 0;
    }

    function getPendingOrders() {
        const total = responseData?.ReviewData?.Total_Orders || 0;
        const completed = responseData?.ReviewData?.Completed_Orders || 0;
        return total - completed;
    }

    function getCriteriaOrder() {
        const total = responseData?.ReviewData?.Total_Orders || 0;
        return `${total}/500`;
    }

    function getCriteriaRating() {
        return `${rating}/5`;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const data = {
            productName: document.getElementById("productName").value,
            category: document.getElementById("catogory").value,
            price: document.getElementById("price").value,
            quantity: document.getElementById("quantity").value,
            harvestDate: document.getElementById("harvestDate").value,
            location: document.getElementById("location").value,
            address: document.getElementById("address").value,
            description: document.getElementById("description").value,
        };
        console.log(data);
        try {
            const response = await axios.post("http://localhost:7000/addProduct", data, {
                headers: {
                    "authorization": `Bearer ${token}`
                }
            });
            console.log("Data added successfully:", response);
        } catch (error) {
            console.log("Error:", error);
        }
    };

    return (
        <section className="sellerProfile">
            <section className="sellerProfileOverview">
                <div className="sellerProfileOverviewRating">
                    {ratingImage}
                    <div className="sellerProfileOverviewRatingNumber">
                        {rating}/5
                    </div>
                </div>
                <div className="sellerProfileOverviewContent">
                    <div className="sellerProfileOverviewLeft">
                        <div className="sellerProfileOverviewLeftElements">
                            <span style={{ fontWeight: "600 " }}>Total Orders : </span>
                            {getTotalOrders()}
                        </div>
                        <div className="sellerProfileOverviewLeftElements">
                            <span style={{ fontWeight: "600 " }}>Completed Orders : </span>
                            {getCompletedOrders()}
                        </div>
                        <div className="sellerProfileOverviewLeftElements">
                            <span style={{ fontWeight: "600 " }}>Pending Orders : </span>
                            {getPendingOrders()}
                        </div>
                    </div>
                    <div className="sellerProfileOverviewRight">
                        <div className="sellerProfileOverviewRightHeading">
                            <span style={{ fontWeight: "600 " }}>Verification Criteria</span>
                        </div>
                        <div className="sellerProfileOverviewRightContent">
                            <div className="sellerProfileOverviewRightContentElements">
                                {getCriteriaOrder()}
                            </div>
                            <div className="sellerProfileOverviewRightContentElements">
                                {getCriteriaRating()}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="sellerProfileNavigation">
                <div className="sellerProfileNavigationElement">
                    <button onClick={() => setPlaceOrder(true)}>
                        Sell Product
                    </button>
                </div>
                <div className="sellerProfileNavigationCenter">
                    |
                </div>
                <div className="sellerProfileNavigationElement">
                    <button onClick={() => setPlaceOrder(false)}>
                        Order History and Reviews
                    </button>
                </div>
            </section>
            <section className="sellerProfileContent">
                {isPlaceOrder ? (
                    <section className="sellerProfileContentPlaceOrder">
                        <div className="sellerProfileContnetPlaceOrderFormHeading">Sell Product</div>
                        <section className="sellerProfileContentPlaceOrderContainer">
                            <form className="sellerProfileContnetPlaceOrderForm" onSubmit={handleSubmit}>
                                <div className="sellerProfileContnetPlaceOrderFormElement">
                                    <span className="sellerProfileContnetPlaceOrderFormElementHeading">
                                        Product
                                    </span>
                                    <input required id="productName" type="text" placeholder="product.." />
                                </div>
                                <div className="sellerProfileContnetPlaceOrderFormElement">
                                    <span className="sellerProfileContnetPlaceOrderFormElementHeading">
                                        Category
                                    </span>
                                    <input id="catogory" type="text" placeholder="Category.." />
                                </div>
                                <div className="sellerProfileContnetPlaceOrderFormElement">
                                    <span className="sellerProfileContnetPlaceOrderFormElementHeading">
                                        Price
                                    </span>
                                    <input id="price" type="number" placeholder="price.." />
                                </div>
                                <div className="sellerProfileContnetPlaceOrderFormElement">
                                    <span className="sellerProfileContnetPlaceOrderFormElementHeading">
                                        Quantity
                                    </span>
                                    <input required id="quantity" type="number" placeholder="Quantity.. in Kg" />
                                </div>
                                <div className="sellerProfileContnetPlaceOrderFormElement">
                                    <span className="sellerProfileContnetPlaceOrderFormElementHeading">
                                        Harvest date
                                    </span>
                                    <input required id="harvestDate" type="date" placeholder="Harvest Date.." />
                                </div>
                                <div className="sellerProfileContnetPlaceOrderFormElement">
                                    <span className="sellerProfileContnetPlaceOrderFormElementHeading">
                                        City
                                    </span>
                                    <input required id="location" type="text" placeholder="City.." />
                                </div>
                                <div className="sellerProfileContnetPlaceOrderFormElement">
                                    <span className="sellerProfileContnetPlaceOrderFormElementHeading">
                                        Address
                                    </span>
                                    <input required id="address" type="text" placeholder="Address.." />
                                </div>
                                <div className="sellerProfileContnetPlaceOrderFormElementTextArea">
                                    <span className="sellerProfileContnetPlaceOrderFormElementHeading">
                                        Description
                                    </span>
                                    <textarea required id="description" placeholder="Description.." />
                                </div>
                                <div className="sellerProfileContnetPlaceOrderFormButton">
                                    <button type="submit">Sell</button>
                                </div>
                            </form>
                            <div className="sellerProfileContentPlaceOrderIllustration"></div>
                        </section>
                    </section>
                ) : (
                    <section className="sellerProfileContentHistory">
                        <div className="sellerProfileContentHistoryHeader">
                            Order History
                        </div>
                        <div className="sellerProfileContentHistoryChoice">
                            <button style={{ cursor: "pointer" }} onClick={() => sethistoryOptions(1)}>All</button>
                            <button style={{ cursor: "pointer" }} onClick={() => sethistoryOptions(2)}>Completed</button>
                            <button style={{ cursor: "pointer" }} onClick={() => sethistoryOptions(3)}>Pending</button>
                        </div>
                        <div className="sellerProfileContentHistoryDetails">
                            <div className="sellerProfileContentHistoryDetailsHeading">
                                <div className="sellerProfileContentHistoryDetailsHeadingSerialNo">
                                    Order ID
                                </div>
                                <div className="sellerProfileContentHistoryDetailsHeadingProduct">
                                    Product Name
                                </div>
                                <div className="sellerProfileContentHistoryDetailsHeadingDate">
                                    Harvest Date
                                </div>
                                <div className="sellerProfileContentHistoryDetailsHeadingStatus">
                                    Status
                                </div>
                            </div>
                            <div className="sellerProfileContentHistoryDetailsInformation">
                                {history}
                            </div>
                        </div>
                    </section>
                )}
            </section>
            <Footer />
        </section>
    );
}
