import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { Checkmark } from 'react-checkmark';
import { useNavigate , useLocation} from 'react-router-dom';
import OrderReceipt from './reciept';

function OrderPlaced({ fadeOut }) {
  return (
    <div className={`order-container ${fadeOut ? 'fade-out' : ''}`}>
      <div className={`order-message ${fadeOut ? 'fade-out' : ''}`}>
        <span>Order Placed</span>
        <Checkmark size='xLarge' />
      </div> 
    </div>
  );
}

function App() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setShowConfetti(true);
    const timer1 = setTimeout(() => {
      setFadeOut(true);
    }, 2000); 
    const timer2 = setTimeout(() => {
      setShowConfetti(false);
      setFadeOut(false);
      const { cartData, cartTotal } = location.state;
      console.log(cartData, cartTotal);
      navigate("/viewSummary", { state: { cart: cartData, total: cartTotal } });
    }, 6000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [navigate]);

  return (
    <div className="App">
      <OrderPlaced fadeOut={fadeOut} />
      {showConfetti && (
        <>
          <Confetti className={`confetti ${fadeOut ? 'fade-out' : ''}`} />
        </>
      )}
    </div>
  );
}

export default App;
