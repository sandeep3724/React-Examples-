import React from "react";
import "./AboutUs.css";

function AboutUs() {
  const sections = [
    {
      title: "🌟 About Us",
      text: "Welcome to Hayam Store! We are passionate about providing the best products for our customers. Our mission is to deliver quality, reliability, and exceptional service.",
    },
    {
      title: "Our Vision",
      text: "To become a trusted brand where every customer finds exactly what they need with confidence and satisfaction.",
    },
    {
      title: "Our Mission",
      text: "We strive to offer high-quality products, seamless shopping experience, and excellent customer service at all times.",
    },
    {
      title: "Our Values",
      text: "Customer satisfaction, integrity, innovation, and community involvement are at the core of everything we do.",
    },
    {
      title: "Why Choose Us?",
      text: "We focus on customer-first solutions, premium quality, and continuous improvement to give you the best shopping experience.",
    },
    {
      title: "Commitment",
      text: "Every product is carefully selected, and our team is committed to delivering only excellence.",
    },
    {
      title: "Innovation",
      text: "We embrace change and implement innovative solutions to serve our customers better every day.",
    },
    {
      title: "Community",
      text: "We believe in giving back and supporting the communities we are a part of.",
    },
    {
      title: "Sustainability",
      text: "Eco-friendly practices are a key part of our operations to ensure a better future.",
    },
    {
      title: "Teamwork",
      text: "Our dedicated team works collaboratively to ensure the best results for our customers.",
    },
    {
      title: "Trust",
      text: "Building long-term relationships with our customers through honesty and transparency.",
    },
    {
      title: "Future Goals",
      text: "To expand globally while maintaining the same quality and customer-first approach.",
    },
  ];

  return (
    <div className="about-container mt-5">
      <h2 className="main-title text-center">About Hayam Store</h2>
      <p className="main-subtitle text-center">
        Discover who we are, what we stand for, and why our customers trust us.
      </p>

      <div className="about-grid">
        {sections.map((sec, index) => (
          <div key={index} className="about-card">
            <h4>{sec.title}</h4>
            <p>{sec.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AboutUs;
