import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import { Link } from 'react-router-dom';

const OrderReceipt = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  if (!localStorage.getItem("token")) {
    return null; // or a loading spinner, or a message indicating redirection
  }

  // Check if location.state and cart are available
  if (!location.state || !location.state.cart) {
    return <div className='emptycart' >Error: No cart data available</div>;
  }

  const { cart } = location.state;

  // Calculate total cost without shipping
  const totalCost = cart.reduce((acc, item) => acc + item.total, 0);

  const handleDownloadReceipt = () => {
    const receipt = document.getElementById('receipt');
    toPng(receipt)
      .then((dataUrl) => {
        const pdf = new jsPDF('landscape', 'px', [1920, 1080]);
        pdf.addImage(dataUrl, 'PNG', 0, 0, 1920, 1080);
        pdf.save('receipt.pdf');
      })
      .catch((error) => {
        console.error('Error generating receipt image:', error);
      });
  };

  return (
    <div className="fullscreen">
      <div className="order-receipt-container" id="receipt">
        <h1 className="order-receipt-header">Purchase Receipt</h1>
        <div className="order-details">
          <p><strong>Date:</strong><span>11-06-2024</span></p>
          <p><strong>Order No.:</strong> #0002</p>
        </div>
        <table className="order-receipt-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item, index) => (
              <tr key={index}>
                <td>{item.item}</td>
                <td>&#8377;{item.price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td>Total Cost:</td>
              <td className="order-receipt-total">&#8377;<span>{totalCost.toFixed(2)}</span></td>
            </tr>
          </tfoot>
        </table>

        <div className="help-section">
          <p>Want any help? <Link to="/support">Please contact us</Link></p>
        </div>
        <div className="download-button-container">
          <button className="download-button" onClick={() => navigate("/home")}>Continue Shopping...</button>
          <button className="download-button" onClick={handleDownloadReceipt}>Download Receipt</button>
        </div>
      </div>
    </div>
  );
};

export default OrderReceipt;

