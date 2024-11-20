// Home.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Header from '../components/Header';
import SellerProfile from '../components/SellerProfile';
import Sell from '../components/Sell';
import BecomeBuyer from '../components/BecomeBuyer';
import Options from '../components/Options';
import Products from '../components/Products';
import Orders from '../components/Orders';
import BecomeSeller from '../components/BecomeSeller';
import Footer from "../components/Footer"
import About from "../components/About"
import Partner from "../components/Partner"

const componentsMap = {
  SellerProfile,
  Sell,
  BecomeBuyer,
  Options,
  Products,
  Orders,
  BecomeSeller,
  Partner,
};

export default function Home() {

  const navigate = useNavigate();
  const location = useLocation();
  const { section } = useParams();
  const [searchItem, setSearchItem] = useState('');
  const [isCart, changeCart] = useState(false);
  const [isProfile, changeProfile] = useState(false);

  let token = localStorage.getItem('token');
  let relation = localStorage.getItem('relation');
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp < Date.now() / 1000) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      navigate('/login');
    }
  }, [token, navigate]);

  useEffect(() => {

    if (location.pathname === "/home") {
      if (relation === "seller") {
        navigate("/home/SellerProfile");
      } else if(relation === "customer") {
        navigate("/home/Products");
      }else{
        navigate("/home/Partner")
      }
    }
  }, [location.pathname, navigate]);

  const SectionComponent = relation === "seller" ? SellerProfile : relation === "customer" ? Products : Partner ;

  return (
    <section className="home" >
      <section className='home-header'>

        <div className="header-title" onClick={() => changeCart(false)}>
          <div className='header-title-logo' onClick={() => window.location.reload()}>
          </div>
        </div>
        <div className="headerSearch">
          <div className="headerSearchBase">
            <div className="headerSearchLogo">
            </div>
            <div className="headerSearchBar">
              <input
                className="headerSearchBarInput"
                onChange={(e) => setSearchItem(e.target.value)}
                placeholder="search something..."
              />
            </div>
          </div>
        </div>
        <div className="headerAddonContent" >
          {localStorage.getItem("relation") === "customer" ? <div className="headerAddonContentCart" onClick={() => { isCart ? changeCart(false) : changeCart(true) }}></div> : <div></div>}
          <div className="headerAddonContentProfile" onClick={() => changeProfile(!isProfile)}></div>
        </div>
      </section>

      <section className="home-content">
        {
          isProfile ?
            <About />
            :
            <SectionComponent searchItem={searchItem} isCart={isCart} changeCart={changeCart} />
        }

      </section>
    </section>


  );

}

