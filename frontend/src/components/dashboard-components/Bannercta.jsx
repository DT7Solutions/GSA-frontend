import React from 'react';
import { ArrowRight } from 'lucide-react';

const Bannercta = () => {
  const styles = `
    .banner-cta-section {
      background: linear-gradient(135deg, #0068a5 0%, #004d7a 100%);
      padding: 30px 20px;
      margin: 0px 0;
    }

    .banner-cta-container {
      max-width: 1280px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 1fr;
      align-items: center;
      gap: 40px;
    }

    @media (max-width: 768px) {
      .banner-cta-section {
        padding: 40px 20px;
        margin: 30px 0;
      }

      .banner-cta-container {
        grid-template-columns: 1fr;
        gap: 24px;
      }
    }

    .banner-cta-content {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .banner-cta-subtitle {
      font-size: 14px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.8);
      text-transform: uppercase;
      letter-spacing: 1px;
      margin: 0 0 12px 0;
    }

    .banner-cta-title {
      font-size: 2.0rem!important;
      font-weight: 700;
      color: white;
      margin: 0 0 16px 0;
      line-height: 1.2;
    }

    @media (max-width: 768px) {
      .banner-cta-title {
        font-size: 1.75rem;
      }
    }

    .banner-cta-description {
      font-size: 16px;
      color: rgba(255, 255, 255, 0.9);
      margin: 0;
      line-height: 1.6;
      max-width: 500px;
    }

    @media (max-width: 768px) {
      .banner-cta-description {
        font-size: 15px;
      }
    }

    .banner-cta-button-wrapper {
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }

    @media (max-width: 768px) {
      .banner-cta-button-wrapper {
        justify-content: flex-start;
      }
    }

    .banner-cta-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      background: white;
      color: #0068a5;
      padding: 16px 40px;
      border: none;
      border-radius: 50px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
      text-decoration: none;
    }

    .banner-cta-button:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
      background: #f8f9fa;
    }

    .banner-cta-button:active {
      transform: translateY(-1px);
    }

    .banner-cta-icon {
      width: 20px;
      height: 20px;
      transition: transform 0.3s ease;
    }

    .banner-cta-button:hover .banner-cta-icon {
      transform: translateX(4px);
    }

    @media (max-width: 768px) {
      .banner-cta-button {
        padding: 14px 32px;
        font-size: 15px;
      }
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <section className="banner-cta-section">
        <div className="banner-cta-container">
          {/* Left Side - Text Content */}
          <div className="banner-cta-content">
            <p className="banner-cta-subtitle">Limited Time Offer</p>
            <h2 className="banner-cta-title">
              Get Genuine Car Parts at Best Prices
            </h2>
            <p className="banner-cta-description">
              Fast delivery and expert customer support available 24/7.
            </p>
          </div>

          {/* Right Side - Button */}
          <div className="banner-cta-button-wrapper">
            <a href="/shop/121">
  <button className="banner-cta-button">
    Shop Now
    <ArrowRight className="banner-cta-icon" size={20} />
  </button>
</a>

          </div>
        </div>
      </section>
    </>
  );
};

export default Bannercta;