import React, { useState } from "react";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import API_BASE_URL from "../config";


const ContactPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.subject) {
      newErrors.subject = "Please select enquiry type";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Please enter your message";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please fill in all required fields correctly.",
        confirmButtonColor: "#0284c7",
      });
      return;
    }

    setIsSubmitting(true);
    const startTime = Date.now();

    try {
      // Log request details (matching previous API call format)
      const requestURL = `${API_BASE_URL}api/home/contactus/`;
      const requestHeaders = {
        "Content-Type": "application/json",
      };

      console.log("\n" + "=".repeat(70));
      console.log("📧 CONTACT FORM SUBMISSION - REQUEST");
      console.log("=".repeat(70));
      console.log("Endpoint:", requestURL);
      console.log("Method: POST");
      console.log("Headers:", requestHeaders);
      console.log("Payload:", formData);
      console.log("Timestamp:", new Date().toLocaleString());
      console.log("=".repeat(70) + "\n");

      // Make API call using axios (same format as your previous code)
      const response = await axios.post(requestURL, formData, {
        headers: requestHeaders,
      });

      const duration = Date.now() - startTime;

      // Log response details
      console.log("\n" + "=".repeat(70));
      console.log("✅ CONTACT FORM SUBMISSION - RESPONSE");
      console.log("=".repeat(70));
      console.log("Status Code:", response.status);
      console.log("Response Data:", response.data);
      console.log("Duration:", `${duration}ms`);
      console.log("Timestamp:", new Date().toLocaleString());
      console.log("=".repeat(70) + "\n");

      // Log summary


      if (response.data.success) {
        // Success Alert
        Swal.fire({
          icon: "success",
          title: "Message Sent!",
          text: "Thank you for contacting us! We'll get back to you soon.",
          confirmButtonColor: "#0284c7",
          confirmButtonText: "Great!",
        });

        // Reset form
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
        setErrors({});
      } else {
        // Server returned error
        console.warn("Server returned unsuccessful response:", response.data);

        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: response.data.message || "Failed to send message. Please try again.",
          confirmButtonColor: "#0284c7",
        });

        // Handle backend validation errors
        if (response.data.errors) {
          setErrors(response.data.errors);
        }
      }
    } catch (error) {
      const duration = Date.now() - startTime;

      console.error("\n" + "=".repeat(70));
      console.error("❌ ERROR IN CONTACT FORM SUBMISSION");
      console.error("=".repeat(70));
      console.error("Error Type:", error.name);
      console.error("Duration:", `${duration}ms`);
      console.error("Timestamp:", new Date().toLocaleString());

      let errorMessage = "Network error. Please check your connection and try again.";

      if (error.response) {
        // Server responded with error status
        console.error("Response Status:", error.response.status);
        console.error("Response Data:", error.response.data);
        errorMessage = error.response.data.message || errorMessage;

        // Handle backend validation errors
        if (error.response.data.errors) {
          setErrors(error.response.data.errors);
          console.error("Validation Errors:", error.response.data.errors);
        }
      } else if (error.request) {
        // Request made but no response
        console.error("Request Error: No response from server");
        console.error("Request:", error.request);
        errorMessage = "No response from server. Please try again later.";
      } else {
        // Error in request setup
        console.error("Error Message:", error.message);
        console.error("Full Error:", error);
      }

      console.error("=".repeat(70) + "\n");

      // Log summary
      

      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        confirmButtonColor: "#0284c7",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const styles = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f3f4f6;
      line-height: 1.6;
      color: #333;
    }

    .contact-section {
      padding: 60px 20px;
      background-color: #f3f4f6;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .contact-wrapper {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-bottom: 40px;
    }

    .form-section {
      background-color: white;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .form-section h2 {
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 30px;
      color: #1f2937;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 20px;
    }

    .form-row.full {
      grid-template-columns: 1fr;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group label {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 8px;
      color: #1f2937;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
      padding: 12px 16px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      font-size: 14px;
      font-family: inherit;
      transition: all 0.3s ease;
      background-color: #f9fafb;
    }

    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #0284c7;
      background-color: white;
      box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.1);
    }

    .form-group input.error-input,
    .form-group select.error-input,
    .form-group textarea.error-input {
      border-color: #ef4444;
    }

    .form-group textarea {
      resize: vertical;
      min-height: 150px;
      font-family: inherit;
    }

    .error {
      color: #ef4444;
      font-size: 12px;
      margin-top: 4px;
      font-weight: 500;
    }

    .submit-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
      padding: 14px 20px;
      background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      margin-top: 20px;
    }

    .submit-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(2, 132, 199, 0.3);
    }

    .submit-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .submit-btn:active:not(:disabled) {
      transform: translateY(0);
    }

    .info-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .info-card {
      background-color: white;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      text-align: center;
    }

    .info-icon {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
      font-size: 28px;
      color: white;
    }

    .info-card h3 {
      font-size: 18px!important;
      font-weight: 700;
      margin-bottom: 15px;
      color: #1f2937;
    }

    .info-card p {
      font-size: 16px;
      color: #6b7280;
      line-height: 1.8;
    }

    .info-card a {
      color: #0284c7;
      text-decoration: none;
      transition: color 0.3s ease;
    }

    .info-card a:hover {
      color: #0369a1;
    }

    .map-section {
      background-color: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      height: 400px;
    }

    .map-container {
      width: 100%;
      height: 100%;
    }

    .map-container iframe {
      width: 100%;
      height: 100%;
      border: none;
    }

    @media (max-width: 1024px) {
      .contact-wrapper {
        grid-template-columns: 1fr;
        gap: 30px;
      }

      .info-section {
        grid-template-columns: 1fr 1fr;
      }

      .form-section {
        padding: 30px;
      }
    }

    @media (max-width: 768px) {
      .contact-section {
        padding: 40px 15px;
      }

      .form-section {
        padding: 25px;
      }

      .form-row {
        grid-template-columns: 1fr;
        gap: 15px;
      }

      .info-section {
        grid-template-columns: 1fr 1fr;
        gap: 15px;
      }

      .info-card {
        padding: 20px;
      }

      .info-card h3 {
        font-size: 16px!important;
      }

      .info-card p {
        font-size: 13px;
      }

      .form-section h2 {
        font-size: 24px;
      }

      .map-section {
        height: 350px;
      }
    }

    @media (max-width: 600px) {
      .contact-section {
        padding: 30px 12px;
      }

      .contact-wrapper {
        gap: 20px;
      }

      .form-section {
        padding: 20px;
      }

      .form-section h2 {
        font-size: 22px;
        margin-bottom: 20px;
      }

      .form-group label {
        font-size: 13px;
      }

      .form-group input,
      .form-group select,
      .form-group textarea {
        padding: 10px 12px;
        font-size: 13px;
      }

      .form-group textarea {
        min-height: 120px;
      }

      .submit-btn {
        font-size: 14px;
        padding: 12px 16px;
      }

      .info-section {
        grid-template-columns: 1fr;
        gap: 15px;
      }

      .info-card {
        padding: 20px;
      }

      .info-icon {
        width: 50px;
        height: 50px;
        font-size: 24px;
      }

      .info-card h3 {
        font-size: 15px!important;
      }

      .info-card p {
        font-size: 12px;
      }

      .map-section {
        height: 300px;
      }
    }

    @media (max-width: 480px) {
      .contact-section {
        padding: 25px 10px;
      }

      .form-section {
        padding: 18px;
      }

      .form-section h2 {
        font-size: 20px;
      }

      .form-row {
        gap: 12px;
      }

      .submit-btn {
        font-size: 13px;
        gap: 6px;
      }

      .info-section {
        grid-template-columns: 1fr;
      }

      .info-card {
        padding: 16px;
      }

      .info-icon {
        width: 45px;
        height: 45px;
        font-size: 20px;
        margin-bottom: 12px;
      }

      .info-card h3 {
        font-size: 14px!important;
      }

      .info-card p {
        font-size: 11px;
      }

      .map-section {
        height: 250px;
      }
    }
  `;

  return (
    <>
      <style>{styles}</style>

      <section className="contact-section">
        <div className="container">
          <div className="contact-wrapper">
            <div className="form-section">
              <h6>Send us a Message</h6>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group  mb-1">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Your name"
                      value={formData.fullName}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className={errors.fullName ? "error-input" : ""}
                    />
                    {errors.fullName && (
                      <small className="error">{errors.fullName}</small>
                    )}
                  </div>
                  <div className="form-group mb-1">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className={errors.email ? "error-input" : ""}
                    />
                    {errors.email && (
                      <small className="error">{errors.email}</small>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group  mb-1">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Your phone number"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className={errors.phone ? "error-input" : ""}
                    />
                    {errors.phone && (
                      <small className="error">{errors.phone}</small>
                    )}
                  </div>
                  <div className="form-group  mb-1">
                    <label>Type of Enquiry *</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className={errors.subject ? "error-input" : ""}
                    >
                      <option value="">Select enquiry type</option>
                      <option value="Spare Parts">Spare Parts</option>
                      <option value="General Enquiry">General Enquiry</option>
                    </select>
                    {errors.subject && (
                      <small className="error">{errors.subject}</small>
                    )}
                  </div>
                </div>

                <div className="form-row full">
                  <div className="form-group">
                    <label>Message *</label>
                    <textarea
                      name="message"
                      placeholder="Tell us how we can help..."
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      disabled={isSubmitting}
                      className={errors.message ? "error-input" : ""}
                    ></textarea>
                    {errors.message && (
                      <small className="error">{errors.message}</small>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "⏳ Sending..." : "🚀 Send Message"}
                </button>
              </form>
            </div>

            <div className="info-section">
              <div className="info-card">
                <div className="info-icon">
                  <FaMapMarkerAlt />
                </div>
                <h3>Our Location</h3>
                <p>
                  Auto Nagar, Guntur,
                  <br />
                  Andhra Pradesh 522001
                </p>
              </div>

              <div className="info-card">
                <div className="info-icon">
                  <FaPhone />
                </div>
                <h3>Phone</h3>
                <p>
                  <a href="tel:+919876543210">+91 98765 43210</a>
                  <br />
                  <a href="tel:+918630012345">+91 86300 12345</a>
                </p>
              </div>

              <div className="info-card">
                <div className="info-icon">
                  <FaEnvelope />
                </div>
                <h3>Email</h3>
                <p>
                  <a href="mailto:info@gowrisankar.com">info@gowrisankar.com</a>
                  <br />
                  <a href="mailto:sales@gowrisankar.com">
                    sales@gowrisankar.com
                  </a>
                </p>
              </div>

              <div className="info-card">
                <div className="info-icon">
                  <FaClock />
                </div>
                <h3>Business Hours</h3>
                <p>
                  Monday - Friday: 9:00 AM - 7:00 PM
                  <br />
                  Saturday: 9:00 AM - 5:00 PM
                  <br />
                  Sunday: Closed
                </p>
              </div>
            </div>
          </div>

          <div className="map-section">
            <div className="map-container">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3844.5436444149746!2d80.63272!3d16.1895!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a4a1d7d7d7d7d7d%3A0x7d7d7d7d7d7d7d7d!2sAuto%20Nagar%2C%20Guntur%2C%20Andhra%20Pradesh%20522001!5e0!3m2!1sen!2sin!4v1234567890"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;