// PaymentPage.js
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import Swal from "sweetalert2";
import Confetti from "react-confetti";

function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { finalPrice, merchantUPI, merchantName } = location.state || {};

  const [showConfetti, setShowConfetti] = React.useState(false);

  if (!finalPrice) {
    return (
      <div className="container text-center mt-5">
        <h2>⚠️ No Payment Info Found!</h2>
        <button className="btn btn-primary mt-3" onClick={() => navigate("/")}>
          🔙 Back to Home
        </button>
      </div>
    );
  }

  // ✅ Confirm payment and redirect back
  const handleConfirmPayment = () => {
    setShowConfetti(true);
    Swal.fire("✅ Payment Successful!", "Your order has been confirmed 🎉", "success");
    setTimeout(() => setShowConfetti(false), 5000);
    navigate("/"); // redirect back to home or orders page
  };

  return (
    <div className="container text-center mt-5">
      <h2 className="mb-4">📱 Scan & Pay</h2>
      <p>
        Pay <b>₹{finalPrice}</b> to <b>{merchantName}</b>
      </p>
      <div className="d-flex justify-content-center mb-4">
        <QRCode
          value={`upi://pay?pa=${merchantUPI}&pn=${merchantName}&cu=INR&am=${finalPrice}`}
          size={200}
        />
      </div>
      <button
        className="btn btn-success px-4 py-2 fw-bold rounded-pill"
        onClick={handleConfirmPayment}
      >
        ✅ Confirm Payment
      </button>

      {showConfetti && <Confetti />}
    </div>
  );
}

export default PaymentPage;
