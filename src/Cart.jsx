import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  clearCart,
} from "./store";
import { calculateButtonDiscount, calculateTotal } from "./dicountUtils";
import emailjs from "@emailjs/browser";
import Confetti from "react-confetti";
import QRCode from "react-qr-code";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "./Cart.css";
import { useNavigate } from "react-router-dom";
import ScratchCard from "./ScratchCard";

const getCouponDiscount = (code, total) => {
  let discountPerc = 0;
  switch (code.toUpperCase()) {
    case "FLAT10":
      discountPerc = 10;
      break;
    case "FLAT20":
      discountPerc = 20;
      break;
    case "FLAT30":
      discountPerc = 30;
      break;
  }
  const discountAmount = (total * discountPerc) / 100;
  return {
    isValid: discountPerc > 0,
    discountPerc,
    discountAmount,
    finalPrice: total - discountAmount,
  };
};

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showScratch, setShowScratch] = useState(false);
  const [scratchOrderId, setScratchOrderId] = useState(null);

  const cartItems = useSelector((state) => state.Cart);

  const merchantUPI = "7989291892@jio";
  const merchantName = "Hayam Store";

  const [showConfetti, setShowConfetti] = useState(false);
  const [buttonDiscount, setButtonDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [couponResult, setCouponResult] = useState({
    isValid: false,
    discountPerc: 0,
    discountAmount: 0,
    finalPrice: 0,
  });
  const [customerEmail, setCustomerEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(null);

  let totalAmount = calculateTotal(cartItems);
  let buttonDiscountAmount = calculateButtonDiscount(totalAmount, buttonDiscount);
  let afterButtonDiscount = totalAmount - buttonDiscountAmount;
  let finalPrice = couponResult.isValid
    ? couponResult.finalPrice - buttonDiscountAmount
    : afterButtonDiscount;

  const handleCoupon = () => {
    const result = getCouponDiscount(couponCode, totalAmount);
    setCouponResult(result);

    if (result.isValid) {
      setShowConfetti(true);
      toast.success(`🎉 Congrats! ${result.discountPerc}% OFF coupon applied!`, {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
      });
      setTimeout(() => setShowConfetti(false), 5000);
    } else {
      toast.error("❌ Invalid coupon code!", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
      });
    }
  };

  const confirmOrder = (paymentMethod) => {
    if (cartItems.length === 0) {
      Swal.fire("Cart Empty", "Please add items before placing an order!", "warning");
      return;
    }

    // Order details
    const now = new Date();
    const newOrder = {
      id: Date.now(),
      date: now.toISOString(), // save full timestamp
      status: "Pending",
      items: cartItems,
      subtotal: calculateTotal(cartItems),
      shipping: 40,
      tax: 18,
      manualDiscount: buttonDiscountAmount,
      couponDiscount: couponResult.discountAmount,
      totalDiscount: buttonDiscountAmount + couponResult.discountAmount,
      finalPrice: finalPrice,
      paymentMethod,
    };

    // Save order
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    localStorage.setItem("orders", JSON.stringify([newOrder, ...orders]));

    // Email params
    const templateParams = {
      order_id: newOrder.id,
      order_date: newOrder.date,
      email: customerEmail,
      items: newOrder.items.map((item) => ({
        name: item.name,
        qty: item.quantity,
        price: item.price,
        image_url: item.image,
      })),
      cost: {
        shipping: newOrder.shipping,
        tax: newOrder.tax,
        discount: newOrder.totalDiscount,
        total: newOrder.finalPrice,
      },
    };

    // Send email
    emailjs
      .send("service_hb0i6a9", "template_olni9wf", templateParams, "9sTIa1QgxqfcPR6e-")
      .then(() => {
        setShowConfetti(true);
        Swal.fire("✅ Success!", "Order placed & email sent 🎉", "success");
        dispatch(clearCart());
        setScratchOrderId(newOrder.id);
        setTimeout(() => setShowScratch(true), 1200);
      })
      .catch(() => {
        Swal.fire("⚠️ Warning", "Order saved but email failed!", "warning");
        dispatch(clearCart());
        setScratchOrderId(newOrder.id);
        setTimeout(() => setShowScratch(true), 1200);
      });
  };

  const handlePlaceOrder = () => {
    // 🔑 Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      toast.error("⚠️ Please login before checkout", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
      });
      navigate("/login");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("❌ Cart is empty!", { position: "top-center" });
      return;
    }
    if (!customerEmail) {
      toast.error("❌ Please enter your email before placing order", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
      });
      return;
    }

    Swal.fire({
      title: "Choose Payment Method",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "💳 Card",
      denyButtonText: "📱 QR Code",
    }).then((result) => {
      if (result.isConfirmed) {
        setPaymentMethod("card");
        confirmOrder("Card");
      } else if (result.isDenied) {
        setPaymentMethod("qr"); // 👈 show overlay
      }
    });
  };

  return (
    <div className="container py-5" style={{ marginTop: "80px" }}>
      {cartItems.length === 0 ? (
        <div className="text-center py-5">
          <img
            src="/cart.svg"
            alt="Empty Cart"
            style={{ width: "280px", maxWidth: "100%", marginBottom: "20px" }}
          />
          <h2 className="text-muted">🛒 Your cart is empty..</h2>
        </div>
      ) : (
        <div className="row">
          {/* Left side - Items */}
          <div className="col-lg-7 col-md-12 mb-4">
            <div className="card shadow-sm p-4 rounded-4">
              <h3 className="mb-3 text-gradient">🛍️ Items in Cart</h3>
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="d-flex align-items-center mb-3 border-bottom pb-3 cart-item-card"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-img me-3"
                    style={{
                      width: "90px",
                      height: "70px",
                      objectFit: "cover",
                    }}
                  />
                  <div className="flex-grow-1 text-start">
                    <h5 className="mb-1">{item.name}</h5>
                    <p className="mb-1">
                      ₹{item.price} × {item.quantity}
                    </p>
                    <div>
                      <button
                        onClick={() => dispatch(incrementQuantity(item.id))}
                        className="btn btn-sm btn-outline-success me-2"
                      >
                        +
                      </button>
                      <button
                        onClick={() => dispatch(decrementQuantity(item.id))}
                        className="btn btn-sm btn-outline-secondary me-2"
                      >
                        -
                      </button>
                      <button
                        onClick={() => dispatch(removeFromCart(item.id))}
                        className="btn btn-sm btn-outline-danger"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Summary */}
          <div className="col-lg-5 col-md-12">
            <div className="card shadow-lg p-4 rounded-4">
              <h3 className="fw-bold mb-3">📋 Order Summary</h3>
              <p>Total: <b>₹{totalAmount}</b></p>
              {buttonDiscount !== 0 && (
                <p>Manual Discount: -₹{buttonDiscountAmount}</p>
              )}
              {couponResult.isValid && (
                <p className="text-success">
                  Coupon "{couponCode}" ({couponResult.discountPerc}%): -₹
                  {couponResult.discountAmount.toFixed(2)}
                </p>
              )}
              <h3 className="fw-bold text-danger mt-3">
                Final Amount: ₹{finalPrice}
              </h3>

              {/* Coupon Section */}
              <div className="coupon-section mt-4 d-flex">
                <input
                  type="text"
                  placeholder="Enter Coupon Code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="form-control me-2"
                />
                <button onClick={handleCoupon} className="btn btn-info rounded-3">
                  Apply
                </button>
              </div>

              {/* Discount Buttons */}
              <div className="mt-3 text-center">
                <button
                  onClick={() => setButtonDiscount(10)}
                  className="btn btn-primary me-2"
                >
                  10% OFF
                </button>
                <button
                  onClick={() => setButtonDiscount(20)}
                  className="btn btn-primary me-2"
                >
                  20% OFF
                </button>
                <button
                  onClick={() => setButtonDiscount(30)}
                  className="btn btn-primary me-2"
                >
                  30% OFF
                </button>
                <button
                  onClick={() => setButtonDiscount(0)}
                  className="btn btn-secondary"
                >
                  Reset
                </button>
              </div>

              {/* Email Input */}
              <div className="mt-4 text-start">
                <label className="form-label fw-semibold">Enter your Email:</label>
                <input
                  type="email"
                  placeholder="your@gmail.com"
                  className="form-control"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                />
              </div>

              {/* Checkout */}
              <button
                className="btn btn-success w-100 mt-4 py-2"
                onClick={handlePlaceOrder}
              >
                ✅ Checkout
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfetti && <Confetti />}

      {/* 🎯 QR Overlay */}
      {paymentMethod === "qr" && (
        <div
          className="qr-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            className="qr-card bg-white p-4 rounded-4 shadow-lg text-center"
            style={{ width: "350px", maxWidth: "90%", position: "relative" }}
          >
            <button
              onClick={() => setPaymentMethod(null)}
              className="btn-close position-absolute"
              style={{ top: "15px", right: "15px" }}
            ></button>
            <h4 className="fw-bold mb-3">📱 Scan to Pay</h4>
            <QRCode
              value={`upi://pay?pa=${merchantUPI}&pn=${merchantName}&cu=INR&am=${finalPrice}`}
              size={220}
              className="mb-3"
            />
            <p className="text-muted">
              Use any UPI app (PhonePe, GPay, Paytm) to complete your payment.
            </p>
            <button
              className="btn btn-success w-100 mt-3 rounded-pill fw-bold"
              onClick={() => {
                confirmOrder("QR");
                setPaymentMethod(null); // 👈 close overlay after confirming
              }}
            >
              ✅ Confirm Payment
            </button>
          </div>
        </div>
      )}

      {/* 🎯 Scratch Card Popup */}
      {showScratch && scratchOrderId && (
        <ScratchCard
          orderId={scratchOrderId}
          onClose={() => {
            setShowScratch(false);
            navigate("/orders");
          }}
        />
      )}
    </div>
  );
}

export default Cart;