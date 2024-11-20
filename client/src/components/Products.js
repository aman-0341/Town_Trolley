import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import Footer from "../components/Footer"

export default function Products({ searchItem, isCart, changeCart }) {
    const token = localStorage.getItem("token");
    const [products, setProducts] = useState([]);
    const [mappedData, setMappedData] = useState([]);
    const [quantity, setQuantity] = useState({});
    const [cartData, setCartData] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:7000/Products", {
            headers: {
                "authorization": `Bearer ${token}`
            }
        }).then((response) => {
            const decoded = jwtDecode(token);
            const relation = decoded.relation;
            if (relation === 'seller') {
                navigate("/home/SellerProfile");
            }
            const responseData = response.data;
            setProducts(responseData);
            console.log(responseData);
        }).catch((err) => console.log(err));
    }, [token, navigate]);

    useEffect(() => {
        const filteredData = products.filter(product => {
            if (!product) return false;

            const itemMatches = product.ProductName.toLowerCase().includes(searchItem.toLowerCase());
            const placeMatches = product.SellerLocation.toLowerCase().includes(searchItem.toLowerCase());

            return itemMatches || placeMatches || searchItem === '';
        });

        const newData = filteredData.map((element) => (
            <div className="productPageElements" key={element.OrderId}>
                <div className="productPageElementsContainer1">
                    <div className='productPageElementsImg' style={{ backgroundImage: `url(${require(`../assets/products/${element.ProductName.toLowerCase()}.png`)})` }}>
                    </div>
                    <div className="productPageElementsContent">
                        <div className='productpageElementsDivision'>
                            <span className="productPageElementsContentTitle1">Item  :</span>
                            <span className="productPageElementsContentBody1">{element.ProductName}</span>
                        </div>
                        <div className='productpageElementsDivision'>
                            <div>
                                <span className="productPageElementsContentTitle1">Price  :</span>
                                <span className="productPageElementsContentBody1">{element.Price}/kg</span>
                            </div>
                            <div className="productPageElementsContentQuantity">
                                <div className="productPageElementsContentQuantityButton" onClick={() => handleClickQuantity("+", element.ProductName, element.Price, element.OrderId)}>+</div>
                                <div className="productPageElementsContentQuantityNumber">
                                    {quantity[element.OrderId]?.quantity || 0}
                                </div>
                                <div className="productPageElementsContentQuantityButton" onClick={() => handleClickQuantity("-", element.ProductName, element.Price, element.OrderId)}>-</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="productsPageElementContainer2">
                    <div className='productpageElementsDivision'>
                        <span className="productPageElementsContentTitle2">SellerName  :</span>
                        <span className="productPageElementsContentBody2">{element.username}</span>
                    </div>
                    <div className='productpageElementsDivision'>
                        <span className="productPageElementsContentTitle2">Place  :</span>
                        <span className="productPageElementsContentBody2">{element.SellerLocation}</span>
                    </div>
                    <div className='productpageElementsDivision'>
                        <span className="productPageElementsContentTitle2">Availale Quantity  :</span>
                        <span className="productPageElementsContentBody2">{element.Quantity}</span>
                    </div>
                    <div className='productpageElementsDivision'>
                        <span className="productPageElementsContentTitle2">Product Category  :</span>
                        <span className="productPageElementsContentBody2">{element.Category}</span>
                    </div>
                    <div className='productpageElementsDivision'>
                        <span className="productPageElementsContentTitle2">Description  :</span>
                        <span className="productPageElementsContentBody2">{element.ProductDescription}</span>
                    </div>
                </div>
            </div>
        ));
        setMappedData(newData);
    }, [searchItem, products, quantity]);

    useEffect(() => {
        const total = cartData.reduce((acc, item) => acc + item.total, 0);
        setCartTotal(total);
        console.log(cartData);
    }, [cartData]);

    function handleClickQuantity(operation, item, price, id) {
        const oldValue = quantity[id]?.quantity || 0;
        const newQuantity = operation === "+" ? oldValue + 1 : Math.max(oldValue - 1, 0);
        const total = newQuantity * parseFloat(price);
        setQuantity(prevQuantity => {
            const updatedQuantity = { ...prevQuantity, [id]: { quantity: newQuantity, price: parseFloat(price), item: item, total: total } };
            updateCartData(updatedQuantity);
            return updatedQuantity;
        });
    }

    function updateCartData(updatedQuantity) {
        const updatedCartData = Object.keys(updatedQuantity).map(id => {
            const productDetails = updatedQuantity[id];
            return { id, ...productDetails };
        }).filter(item => item.quantity > 0);

        setCartData(updatedCartData);
    }

    function renderQuantityButtons(item, price, id) {
        return (
            <div className='productsPageCartContentElementUpdate'>
                <div className="productPageElementsContentQuantityButton" onClick={() => handleClickQuantity("+", item, price, id)}>+</div>
                <div className="productPageElementsContentQuantityNumber">
                    {quantity[id]?.quantity || 0}
                </div>
                <div className="productPageElementsContentQuantityButton" onClick={() => handleClickQuantity("-", item, price, id)}>-</div>
            </div>
        );
    }

    function handleProceedToPayment() {
        navigate("/payment", { state: { cart: cartData, total: cartTotal } });;
    }

    const renderCartData = cartData.length > 0 ? (
        cartData.map(item => (
            <div className="productsPageCartContentElement" key={item.id}>
                <div className='productsPageCartContentElementLeft'>
                    <div className='productsPageCartContentElementImg'
                        style={{ backgroundImage: `url(${require(`../assets/products/${item.item.toLowerCase()}.png`)})` }}
                    >
                    </div>
                    <div className='productsPageCartContentElementContent'>
                        <div className="cartItemTitle"><span style={{ fontWeight: "700" }}>Item: </span>{item.item}</div>
                        <div className="cartItemQuantity"><span style={{ fontWeight: "700" }}>Quantity: </span>{item.quantity}</div>
                        <div className="cartItemPrice"><span style={{ fontWeight: "700" }}>Price: </span>{item.price} /kg</div>
                    </div>
                </div>
                <div className='productsPageCartContentElementRight'>
                    <div className="cartItemTotal">Total: {item.total}</div>
                    <div className='productsPageCartContentElementUpdate'>
                        {renderQuantityButtons(item.item, item.price, item.id)}
                    </div>
                </div>
            </div>
        ))
    ) : (
        <div className="productsPageCartEmpty"><div>Cart is empty</div></div>
    );
    return (
        <section>
            <section className="productsPage">
                {isCart === false ? (
                    <section className='productsPageContainer'>
                        <section className='productsPageContentHeaderContainer'>
                            <section className='productsPageContentBanner'>
                                <div className="productsPageContentBannerArrow">
                                    <div className="productsPageContentBannerArrowContainerLeft"></div>
                                </div>
                                <div className='productsPageContnetBannerImg'></div>
                                <div className="productsPageContentBannerArrow">
                                    <div className="productsPageContentBannerArrowContainerRight"></div>
                                </div>
                            </section>
                            <section className='productsPageContentScroll'>
                                <div>
                                    Explore Products
                                </div>
                            </section>
                        </section>
                        <section className='productsPageContent'>
                            
                            {mappedData}

                        </section>
                        
                    </section>
                ) : (
                    <section className='productsPageCart'>
                        <section className='productsPageCartHeader'>
                            <div className='productsPageCartHeaderLeft'>
                                <span className='productsPageCartHeaderLogo'></span>
                                <span className='productsPageCartHeaderTitle'>My Cart</span>
                            </div>
                            <div className='productsPageCartHeaderRight' onClick={() => changeCart(false)}></div>
                        </section>
                        <section className='productsPageCartContent'>
                            {renderCartData}
                        </section>
                        <section className='productsPageCrtFooter'>
                            {cartData.length > 0 && (
                                <>
                                    <div className='productsPageCartFooterHeading'>
                                        Head to the payment <span className='productsPageCartFooterHeadingArrow'>→</span>
                                    </div>
                                    <div className='productsPageCartFooterButton'>
                                        <button onClick={handleProceedToPayment}>Total : Rs. {cartTotal}</button>
                                    </div>
                                </>
                            )}
                        </section>

                    </section>
                )}


            </section>
            <Footer />
        </section>
    );
}
