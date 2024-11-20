import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from "../assets/headerlogo.svg";
import herologo from "../assets/LandingPage/heroImg.svg";
import beans from "../assets/products/beans.png";
import beetroot from "../assets/products/beetroot.png";
import onion from "../assets/products/onion.png";
import cabbage from "../assets/products/cabbage.png";
import tomato from "../assets/products/tomato.png";
import potato from "../assets/products/potato.png";
import carrot from "../assets/products/carrot.png";
import '../styles/LandingPage.css';
import Footer from "../components/Footer";
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {

  const navigate = useNavigate();
  const [islogged, setislogged] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setislogged(true);
    } else {
      setislogged(false);
    }
  }, [islogged]);

  return (
    <div>
      {islogged ? navigate("/home") : (
        <div className='landingPageContainer'>
          <header className="header">
            <div className="logo">
              <img src={logo} alt="TownTrolley Logo" />
            </div>
            <div className="search-bar">
              <input type="text" placeholder="Search for items..." />
              <button onClick={() => navigate("/login")}>Search</button>
            </div>
            <nav className="menu">
              <Link to="/wishlist">Wishlist</Link>
              <Link to="/cart">My cart</Link>
              <Link to="/login" className="login">Login / Signup</Link>
            </nav>
          </header>

          <section className="hero">
            <div className="content">
              <h1>Grocery Shopping Made Simple!</h1>
              <p>Save up to 10% off on your first order</p>
              <div className="subscribe">
                <input type="email" placeholder="Enter your email address" />
                <button>Subscribe</button>
              </div>
            </div>
            <div className="image">
              <img src={herologo} alt="Grocery Bag" />
            </div>
          </section>

          <section className="categories">
            <h2 className="explore-title">Explore Categories</h2>
            <div className="category-list">
              <div className="category">
                <img src={beans} alt="Beans"/>
                <p>Beans</p>
              </div>
              <div className="category">
                <img src={tomato} alt="Vegetables" />
                <p>Vegetables</p>
              </div>
              <div className="category">
                <img src={onion} alt="Onion" />
                <p>Onion</p>
              </div>
              <div className="category">
                <img src={cabbage} alt="Cabbage" />
                <p>Cabbage</p>
              </div>
              <div className="category">
                <img src={beetroot} alt="Orange" />
                <p>Orange</p>
              </div>
              <div className="category">
                <img src={potato} alt="Potato" />
                <p>Potato</p>
              </div>
              <div className="category">
                <img src={carrot} alt="Carrot" />
                <p>Carrot</p>
              </div>
            </div>
          </section>

          <section className="offers">
            <div className="offer">
              <h3>Free delivery over ₹2000</h3>
              <p>Shop ₹10000 product and get free delivery anywhere.</p>
              <Link to="/shop" className="cta">Shop Now</Link>
            </div>
            <div className="offer">
              <h3>Grocery</h3>
              <p>Save up to 10% off on your first order.</p>
              <Link to="/order" className="cta">Order Now</Link>
            </div>
          </section>

          <section className="benefits">
            <hr />
            <div className="benefit">
              <h3>Best Prices & Deals</h3>
              <p>Don't miss our daily amazing deals and prices.</p>
            </div>
            <hr />
            <div className="benefit">
              <h3>Trustable</h3>
              <p>Quality-checked, trusted products ensuring your satisfaction.</p>
            </div>
            <hr />
            <div className="benefit">
              <h3>Free Delivery</h3>
              <p>Do purchase over ₹2000 and get free delivery anywhere.</p>
            </div>
            <hr />
          </section>
          <Footer />
        </div>
      )}
    </div>
  );
}
