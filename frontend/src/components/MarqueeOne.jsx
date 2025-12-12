import React from "react";

const MarqueeOne = () => {
  const styles = `
    .gsa-marquee-container {
      background-color: #0068a5;
      overflow: hidden;
      padding: 10px 0;
    }

    .gsa-marquee-wrapper {
      display: flex;
      align-items: center;
      white-space: nowrap;
      animation: gsa-marquee-scroll 40s linear infinite;
    }

    .gsa-marquee-item {
      display: inline-flex;
      align-items: center;
      color: white;
      font-size: 1.0rem;
      font-weight: 500;
      padding: 0 10px;
    }

    .gsa-marquee-separator {
      color: #fbbf24;
      font-weight: bold;
      margin: 0 12px;
      font-size: 1.5rem;
    }

    .gsa-marquee-wrapper:hover {
      animation-play-state: paused;
    }

    @keyframes gsa-marquee-scroll {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(-50%);
      }
    }

    @media (max-width: 768px) {
      .gsa-marquee-item {
        font-size: 1rem;
        padding: 0 20px;
      }
    }
  `;

  const messages = [
    "Gowrisankar Agencies – Your Trusted Car Spare Parts Dealer",
    "Authorized Hyundai, Toyota, Ford Parts in Guntur",
    "Fast Delivery Across Andhra Pradesh",
    "100% Genuine Parts Guaranteed",
    "Gowrisankar Agencies – Your Trusted Car Spare Parts Dealer",
    "Authorized Hyundai, Toyota, Ford Parts in Guntur",
    "Fast Delivery Across Andhra Pradesh",
    "100% Genuine Parts Guaranteed"
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="gsa-marquee-container">
        <div className="gsa-marquee-wrapper">
          {messages.map((message, index) => (
            <React.Fragment key={index}>
              <span className="gsa-marquee-item">{message}</span>
              <span className="gsa-marquee-separator">•</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
};

export default MarqueeOne;