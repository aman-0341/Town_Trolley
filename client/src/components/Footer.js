import React from 'react';
import { Link } from 'react-router-dom';
import logo from "../assets/headerlogo.svg"
import logo2 from "../assets/fruits-and-vegetables.png"

const Footer = () => {
  return (
    <div>
    <footer className="footer">
        <div className="column">
          <div className='footerlogocontainer'>
          <img className='footerlogo' src={logo2} alt='logo'></img>
          <h3 className='footerlogotitle'>TownTrolley<br></br>Grocery</h3>
          </div>
          <p>Address: xxx</p>
          <p>Call Us: 123456789</p>
          <p>Email: towntrolley@contact.com</p>
        </div>
        <div className="column">
          <h3>Account</h3>
          <ul>
            <li><Link to="/wishlist">Wishlist</Link></li>
            <li><Link to="/cart">Cart</Link></li>
            <li><Link to="/track-order">Track Order</Link></li>
            <li><Link to="/shipping-details">Shipping Details</Link></li>
          </ul>
        </div>
        <div className="column">
          <h3>Useful links</h3>
          <ul>
            <li><Link to="/about-us">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/new-products">New products</Link></li>
          </ul>
        </div>
        <div className="column">
          <h3>Help Center</h3>
          <ul>
            <li><Link to="/payments">Payments</Link></li>
            <li><Link to="/refund">Refund</Link></li>
            <li><Link to="/checkout">Checkout</Link></li>
            <li><Link to="/shipping">Shipping</Link></li>
            <li><Link to="/qa">Q&A</Link></li>
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
          </ul>
        </div>
        <div className="social">
          {["facebook", "linkedin", "instagram", "twitter"].map((platform, index) => (
            <Link to={`/${platform}`} key={index}>
              < img src={require(`../assets/LandingPage/icons8-${platform}.svg`)} alt={platform} />
            </Link>
          ))}
        </div>
      </footer>

      <div className="footer-bottom">
        &copy; 2024, All rights reserved
      </div>
    </div >
  )
}
export default Footer;
