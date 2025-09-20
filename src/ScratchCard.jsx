import React, { useRef, useEffect, useState } from "react";
import Confetti from "react-confetti";
import { motion, } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ScratchCard.css";


const ScratchCard = ({ orderId, onClose }) => {
  const canvasRef = useRef(null);
  const [isScratching, setIsScratching] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [coupon, setCoupon] = useState("");
  const width = 420;  // wider card
  const height = 220; // taller card

  const coupons = [
    "Flat 50% OFF on next order 🍔",
    "Flat 50% OFF on next order 🍕",
    "1 Month Free Delivery 🚀",
    "₹100 OFF on Next Order 🚀",
    "Buy 1 Get 1 Free 🍔",
    "Buy 1 Get 1 Free 🍕",
    "Buy 2 Get 1 Free 🍔",
    "Buy 2 Get 1 Free 🍕",
  ];

  // Setup foil
  useEffect(() => {
    const randomCoupon = coupons[Math.floor(Math.random() * coupons.length)];
    setCoupon(randomCoupon);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // silver foil gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#c0c0c0");
    gradient.addColorStop(0.5, "#e6e6e6");
    gradient.addColorStop(1, "#b0b0b0");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // sparkle effect
    for (let i = 0; i < 600; i++) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.4})`;
      ctx.fillRect(Math.random() * width, Math.random() * height, 1, 1);
    }

    ctx.globalCompositeOperation = "destination-out";
  }, []);

  useEffect(() => {
    if (revealed) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [revealed, onClose]);

  const scratch = (e) => {
    if (!isScratching) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();

    checkReveal();
  };

  const startScratching = (e) => {
    setIsScratching(true);
    scratch(e);
  };

  const stopScratching = () => {
    setIsScratching(false);
    checkReveal();
  };

  const checkReveal = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const pixels = ctx.getImageData(0, 0, width, height).data;

    let transparent = 0;
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparent++;
    }

    const percent = (transparent / (width * height)) * 100;
    if (percent > 25 && !revealed) {
      setRevealed(true);
    }
  };

  return (
    <div className="scratch-overlay">
      {revealed && <Confetti numberOfPieces={250} recycle={false} />}

     <motion.div
  initial={{ y: "100%", opacity: 0 }}
  animate={{
    y: 0,
    opacity: 1,
    x: [0, -4, 4, -4, 4, 0], // vibrate while entering
  }}
  transition={{
    duration: 0.8,
    ease: "easeOut",
  }}
  className="scratch-card shadow-lg"
>



        <h4 className="fw-bold text-dark mb-1">🎁Congratulations, You won a Scratch Card</h4>
        <p className="text-muted small mb-3">Order ID: {orderId}</p>

        <div className="scratch-container position-relative">
          <div
            className={`reward-box d-flex flex-column justify-content-center align-items-center rounded ${
              revealed ? "revealed" : ""
            }`}
          >
            {revealed ? (
              <>
                <h3 className="fw-bold text-success">{coupon}</h3>
                <span className="badge bg-warning text-dark mt-2">
                  Reward Unlocked
                </span>
              </>
            ) : (
              <p className="small opacity-75 text-white">
                Scratch to reveal your gift
              </p>
            )}
          </div>

          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className="scratch-canvas rounded"
            onMouseDown={startScratching}
            onMouseMove={scratch}
            onMouseUp={stopScratching}
            onMouseLeave={stopScratching}
            onTouchStart={(e) => startScratching(e.touches[0])}
            onTouchMove={(e) => scratch(e.touches[0])}
            onTouchEnd={stopScratching}
          />
        </div>

        <button className="btn btn-danger w-100 mt-3 fw-bold" onClick={onClose}>
          Close
        </button>
      </motion.div>
    </div>
  );
};

export default ScratchCard;
