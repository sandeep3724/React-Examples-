import React, { useRef, useEffect, useState } from "react";

const Rewards = ({ orderId, onClose, isOpen }) => {
  const canvasRef = useRef(null);
  const [isScratching, setIsScratching] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [progress, setProgress] = useState(0);
  const width = 350;
  const height = 200;

  // Available coupons
  const coupons = [
    "70% OFF on any restaurant",
    "Buy 1 Get 1 Free on main course",
    "Free delivery for 1 month",
    "50% OFF on beverages",
    "30% OFF up to ₹150",
    "Flat ₹200 OFF on orders above ₹500"
  ];

  useEffect(() => {
    if (!isOpen) return;
    
    // Select a random coupon
    const randomCoupon = coupons[Math.floor(Math.random() * coupons.length)];
    setCoupon(randomCoupon);
    setRevealed(false);
    setProgress(0);

    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");

    // Create a silver foil effect for the scratch card
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#d4d4d4");
    gradient.addColorStop(0.5, "#f5f5f5");
    gradient.addColorStop(1, "#d4d4d4");
    
    // Fill canvas with gradient
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw realistic scratch pattern (brushed metal effect)
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const length = Math.random() * 30 + 10;
      const opacity = Math.random() * 0.3 + 0.1;
      
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + length, y + length * (Math.random() - 0.5));
      ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.lineWidth = Math.random() * 2 + 1;
      ctx.stroke();
    }

    // Draw hint text with shadow
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.fillStyle = "#333";
    ctx.font = "bold 16px 'Poppins', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Scratch downward to reveal your reward", width / 2, 30);
    
    // Reset shadow
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Draw coupon text (hidden until scratched)
    ctx.globalCompositeOperation = "source-over";
    
    // Background for text
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.fillRect(width/2 - 140, height/2 - 30, 280, 60);
    
    // Text
    ctx.fillStyle = "#e74c3c";
    ctx.font = "bold 20px 'Poppins', sans-serif";
    ctx.fillText("YOU WON!", width / 2, height / 2 - 10);
    ctx.fillStyle = "#2c3e50";
    ctx.font = "16px 'Poppins', sans-serif";
    ctx.fillText(randomCoupon, width / 2, height / 2 + 15);

    // Erase mode for scratching
    ctx.globalCompositeOperation = "destination-out";
  }, [isOpen]);

  const startScratching = (e) => {
    setIsScratching(true);
    scratch(e);
  };

  const stopScratching = () => {
    setIsScratching(false);
    checkReveal();
  };

  const scratch = (e) => {
    if (!isScratching) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Create a more realistic scratch effect with varying pressure
    ctx.beginPath();
    
    // Simulate different pressure based on speed
    const pressure = Math.random() * 5 + 10;
    
    // Create a scratch with texture
    ctx.arc(x, y, pressure, 0, Math.PI * 2);
    
    // Add some randomness to the scratch shape
    for (let i = 0; i < 3; i++) {
      const offsetX = (Math.random() - 0.5) * pressure;
      const offsetY = (Math.random() - 0.5) * pressure;
      ctx.lineTo(x + offsetX, y + offsetY);
    }
    
    ctx.closePath();
    ctx.fill();

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
    setProgress(percent);
    
    if (percent > 50 && !revealed) {
      setRevealed(true);
      // Auto-close after 4 seconds
      setTimeout(() => {
        onClose();
      }, 4000);
    }
  };

  // Inline styles for the component
  const styles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.85)",
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-end",
      zIndex: 1000,
      fontFamily: "'Poppins', sans-serif",
      opacity: isOpen ? 1 : 0,
      pointerEvents: isOpen ? 'all' : 'none',
      transition: 'opacity 0.3s ease'
    },
    card: {
      background: "linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)",
      borderRadius: "20px 20px 0 0",
      padding: "25px 20px 20px",
      width: "100%",
      maxWidth: "450px",
      textAlign: "center",
      boxShadow: "0 -5px 25px rgba(0, 0, 0, 0.2)",
      transform: isOpen ? "translateY(0)" : "translateY(100%)",
      transition: "transform 0.5s cubic-bezier(0.18, 1.25, 0.4, 1)",
      position: "relative",
      overflow: "hidden"
    },
    container: {
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      padding: "15px",
      borderRadius: "12px",
      display: "inline-block",
      margin: "15px 0",
      backdropFilter: "blur(5px)",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      position: "relative"
    },
    progressBar: {
      height: "5px",
      width: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.2)",
      borderRadius: "5px",
      marginTop: "10px",
      overflow: "hidden"
    },
    progressFill: {
      height: "100%",
      backgroundColor: "#27ae60",
      borderRadius: "5px",
      transition: "width 0.3s ease",
      width: `${progress}%`
    },
    canvas: {
      backgroundColor: "transparent",
      borderRadius: "8px",
      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.15)",
      cursor: "pointer",
      touchAction: "none",
      display: "block"
    },
    rewardText: {
      fontSize: "1.2rem",
      color: "#2d3436",
      margin: "15px 0",
      padding: "12px",
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      borderRadius: "8px",
      animation: "fadeIn 0.5s ease-in",
      fontWeight: "600",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
    },
    closeBtn: {
      backgroundColor: "#fff",
      color: "#ff7e5f",
      border: "none",
      padding: "10px 25px",
      borderRadius: "25px",
      cursor: "pointer",
      fontWeight: "600",
      transition: "all 0.3s ease",
      marginTop: "10px",
      boxShadow: "0 3px 8px rgba(0, 0, 0, 0.1)",
      fontSize: "14px"
    },
    orderId: {
      color: "#2d3436",
      marginBottom: "10px",
      fontSize: "14px",
      fontWeight: "500"
    },
    title: {
      color: "#2d3436",
      marginBottom: "8px",
      fontSize: "24px",
      fontWeight: "700"
    },
    instructions: {
      color: "#2d3436",
      fontSize: "12px",
      marginTop: "8px",
      opacity: 0.8
    },
    // Keyframes as inline styles
    keyframes: `
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(10px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
    `
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <style>{styles.keyframes}</style>
      <div style={styles.card}>
        <h2 style={styles.title}>🎉 Congratulations!</h2>
        <p style={styles.orderId}>
          Order ID: <b>{orderId}</b>
        </p>

        <div style={styles.container}>
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            style={styles.canvas}
            onMouseDown={startScratching}
            onMouseUp={stopScratching}
            onMouseMove={scratch}
            onMouseLeave={stopScratching}
            onTouchStart={(e) => startScratching(e.touches[0])}
            onTouchMove={(e) => scratch(e.touches[0])}
            onTouchEnd={stopScratching}
          />
          <div style={styles.progressBar}>
            <div style={styles.progressFill}></div>
          </div>
          <p style={styles.instructions}>Scratch {Math.round(progress)}% complete</p>
        </div>

        {revealed && (
          <div style={styles.rewardText}>
            🎁 You Won: <b>{coupon}</b>
          </div>
        )}

        <button 
          style={styles.closeBtn} 
          onClick={onClose}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = "#ff7e5f";
            e.target.style.color = "white";
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = "#fff";
            e.target.style.color = "#ff7e5f";
          }}
        >
          {revealed ? "Use Coupon" : "Close"}
        </button>
      </div>
    </div>
  );
};

export default Rewards;