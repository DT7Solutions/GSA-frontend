import React, { useState, useEffect } from "react";
import { Phone, MapPin } from "lucide-react";

const CTAAreaTwo = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkOpenStatus = () => {
      const now = new Date();
      const day = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      const hours = now.getHours();
      
      // Check if it's Monday to Saturday (1-6) and between 9 AM (9) and 8 PM (20)
      if (day >= 1 && day <= 6 && hours >= 9 && hours < 20) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    checkOpenStatus();
    // Check every minute
    const interval = setInterval(checkOpenStatus, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleCallNow = () => {
    window.location.href = "tel:+919876543210"; // Replace with actual phone number
  };

  const handleGetDirections = () => {
    window.open("https://maps.google.com/?q=Auto+Nagar+Guntur", "_blank");
  };

  const styles = `
    @keyframes gsa-cta-blink-open {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }

    @keyframes gsa-cta-blink-closed {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }

    

    .gsa-cta-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: hsl(210 15% 25% / 0.85);
      z-index: 1;
    }

    .gsa-cta-container {
      position: relative;
      z-index: 2;
      max-width: 900px;
      margin: 0 auto;
      text-align: center;
    }

    .gsa-cta-heading {
      font-size: 2.5rem;
      font-weight: bold;
      color: white;
      margin-bottom: 24px;
      line-height: 1.2;
    }

    @media (min-width: 768px) {
      .gsa-cta-heading {
        font-size: 3.5rem;
      }
    }

    .gsa-cta-paragraph {
      font-size: 1.125rem;
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: 40px;
      line-height: 1.8;
      max-width: 700px;
      margin-left: auto;
      margin-right: auto;
    }

    .gsa-cta-buttons {
      display: flex;
      flex-direction: column;
      gap: 16px;
      justify-content: center;
      margin-bottom: 40px;
    }

    @media (min-width: 640px) {
      .gsa-cta-buttons {
        flex-direction: row;
      }
    }

    .gsa-cta-btn {
      padding: 16px 32px;
      font-size: 1.125rem;
      font-weight: 600;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      text-decoration: none;
    }

    .gsa-cta-btn-primary {
      background: #0068a4;
      color: white;
      box-shadow: 0 10px 25px rgba(245, 158, 11, 0.3);
    }

    .gsa-cta-btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 15px 35px rgba(245, 158, 11, 0.4);
    }

    .gsa-cta-btn-secondary {
      background: white;
      color: #1e293b;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }

    .gsa-cta-btn-secondary:hover {
      transform: translateY(-2px);
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
      background: #f8fafc;
    }

    .gsa-cta-status {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      padding: 16px 32px;
      border-radius: 50px;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .gsa-cta-status-indicator {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      animation-duration: 2s;
      animation-iteration-count: infinite;
    }

    .gsa-cta-status-open {
      background: #22c55e;
      box-shadow: 0 0 15px rgba(34, 197, 94, 0.6);
      animation-name: gsa-cta-blink-open;
    }

    .gsa-cta-status-closed {
      background: #ef4444;
      box-shadow: 0 0 15px rgba(239, 68, 68, 0.6);
      animation-name: gsa-cta-blink-closed;
    }

    .gsa-cta-status-text {
      color: white;
      font-size: 1rem;
      font-weight: 600;
    }

    .gsa-cta-status-time {
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.875rem;
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="gsa-cta-section">
        <div className="gsa-cta-overlay"></div>
        
        <div className="gsa-cta-container">
          <h5 className="gsa-cta-heading">
            Get Genuine Spare Parts at the Best Prices
          </h5>
          
          <p className="gsa-cta-paragraph">
            Visit our showroom in Auto Nagar, Guntur or call us for expert assistance with your car parts requirements
          </p>

          <div className="gsa-cta-buttons">
            <button 
              className="gsa-cta-btn gsa-cta-btn-primary"
              onClick={handleCallNow}
            >
              <Phone size={24} />
              Call Us Now
            </button>
            
            <button 
              className="gsa-cta-btn gsa-cta-btn-secondary"
              onClick={handleGetDirections}
            >
              <MapPin size={24} />
              Get Directions
            </button>
          </div>

          <div className="gsa-cta-status">
            <div className={`gsa-cta-status-indicator ${isOpen ? 'gsa-cta-status-open' : 'gsa-cta-status-closed'}`}></div>
            <div>
              <div className="gsa-cta-status-text">
                {isOpen ? 'Open Now' : 'Closed'}    Mon-Sat, 9:00 AM - 8:00 PM
              </div>
              {/* <div className="gsa-cta-status-time">
              
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CTAAreaTwo;