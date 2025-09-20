import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  const handleOrderNow = () => {
    const lastCategory = localStorage.getItem("lastCategory") || "/veg"; 
    navigate(lastCategory);
  };

  return (
    <div className="home-container">
      {/* Background Video/Image */}
      <video autoPlay loop muted className="home-bg-video">
        <source src="/public/igloo.mp4" type="video/mp4" />
        {/* fallback image if video fails */}
      </video>

      {/* Overlay for dark effect   𝖧𝖺𝗒𝖺𝗆, 𝖺𝗋𝗋𝗂𝗏𝖾𝖽 𝗐𝗂𝗍𝗁 𝗁𝗎𝗇𝗀𝖾𝗋 !, 𝖤𝗑𝗉𝗅𝗈𝗋𝖾𝖳𝗒𝗉𝖾 𝗌𝗈𝗆𝖾𝗍𝗁𝗂𝗇𝗀 𝗍𝗈 𝗌𝗍𝖺𝗋𝗍 */}
      <div className="overlay"></div>

      {/* Content */}
      <div className="home-content">
        <h1 className="home-title">𝖧𝖺𝗒𝖺𝗆</h1>
        <p className="home-subtitle">𝖺𝗋𝗋𝗂𝗏𝖾𝖽 𝗐𝗂𝗍𝗁 𝗁𝗎𝗇𝗀𝖾𝗋 !</p>
        <button className="home-btn" onClick={handleOrderNow}>
          𝖤𝗑𝗉𝗅𝗈𝗋𝖾
        </button>
      </div>
    </div>
  );
}

export default Home;
