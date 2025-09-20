import React, { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";
import "./ContactUs.css";

function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const messageRef = useRef(null);

  const validateField = (name, value) => {
    let error = "";

    if (name === "name") {
      if (!value.trim()) error = "Name is required.";
      else if (!/^[A-Za-z ]+$/.test(value))
        error = "No special characters or numbers allowed.";
    }

    if (name === "email") {
      if (!value.trim()) error = "Email is required.";
      else if (!/\S+@\S+\.\S+/.test(value))
        error = "Enter a valid email with '@'.";
    }

    if (name === "message") {
      if (!value.trim()) error = "Message is required.";
      else if (value.length < 20)
        error = "Message should be at least 20 characters.";
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {
      name: validateField("name", formData.name),
      email: validateField("email", formData.email),
      message: validateField("message", formData.message),
    };
    setErrors(newErrors);

    if (newErrors.name) {
      nameRef.current.focus();
      return;
    }
    if (newErrors.email) {
      emailRef.current.focus();
      return;
    }
    if (newErrors.message) {
      messageRef.current.focus();
      return;
    }

    setLoading(true);

    emailjs
      .send(
        "YOUR_SERVICE_ID",
        "YOUR_TEMPLATE_ID",
        formData,
        "YOUR_PUBLIC_KEY"
      )
      .then(() => {
        setLoading(false);
        toast.success("✅ Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
        setErrors({});
      })
      .catch(() => {
        setLoading(false);
        toast.error("⚠️ Failed to send message, try again!");
      });
  };

  return (
    <div className="contact-us container" style={{marginTop:"80px"}}>
      <div className="text-center mb-5">
        <h2 className="contact-title">📞 Contact Us</h2>
        <p className="contact-subtitle">
          Have questions? We'd love to hear from you. Reach out and we’ll respond as soon as possible.
        </p>
      </div>

      <div className="row g-5 align-items-stretch">
        {/* Contact Form */}
        <div className="col-lg-6">
          <div className="contact-card shadow-lg rounded-4 p-4">
            <form onSubmit={handleSubmit} noValidate>
              {/* Name */}
              <div className="mb-4">
                <label className="form-label fw-semibold">Full Name</label>
                <input
                  type="text"
                  name="name"
                  ref={nameRef}
                  className={`form-control ${
                    errors.name ? "is-invalid" : formData.name ? "is-valid" : ""
                  }`}
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter name.."
                />
                {errors.name && (
                  <small className="text-danger">{errors.name}</small>
                )}
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="form-label fw-semibold">Email Address</label>
                <input
                  type="email"
                  name="email"
                  ref={emailRef}
                  className={`form-control ${
                    errors.email ? "is-invalid" : formData.email ? "is-valid" : ""
                  }`}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter mail.."
                />
                {errors.email && (
                  <small className="text-danger">{errors.email}</small>
                )}
              </div>

              {/* Message */}
              <div className="mb-4">
                <label className="form-label fw-semibold">Message</label>
                <textarea
                  name="message"
                  ref={messageRef}
                  className={`form-control ${
                    errors.message
                      ? "is-invalid"
                      : formData.message
                      ? "is-valid"
                      : ""
                  }`}
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                ></textarea>
                {errors.message && (
                  <small className="text-danger">{errors.message}</small>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-gradient w-100 py-2 fw-bold"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>

            <div className="contact-info mt-4 text-center">
              <p>📧 <strong>Email:</strong> support@Hayam.com</p>
              <p>📞 <strong>Phone:</strong> +91 7989291892</p>
              <p>📍 <strong>Location:</strong> SR Nagar,Hyderabad</p>
            </div>
          </div>
        </div>

       {/* Google Map Section */}
<div className="col-lg-6">
  <div className="map-wrapper shadow-lg rounded-4">
    <div className="map-header text-center py-2">
      <h5 className="fw-bold text-primary">📍Location</h5>
      <p className="text-muted small">Come visit us in SR Nagar, Hyderabad.</p>
    </div>
    <iframe
      title="Store Location"
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.2315879611595!2d79.14119217476468!3d18.43854628742359!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a33f4cf1268b5db%3A0x3ef89b1b4f6f0a6c!2sKarimnagar!5e0!3m2!1sen!2sin!4v1695012345678!5m2!1sen!2sin"
      width="100%"
      height="100%"
      style={{ border: 0, minHeight: "420px" }}
      allowFullScreen=""
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className="map-frame"
    ></iframe>
  </div>
</div>

      </div>
    </div>
  );
}

export default ContactUs;
