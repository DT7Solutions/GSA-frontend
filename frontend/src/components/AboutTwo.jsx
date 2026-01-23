import React from "react";

const AboutTwo = () => {
  const styles = `


    .space-top {
      padding: 80px 20px;
      background-color: #f9fafb;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .row-about {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 60px;
      align-items: center;
    }

    /* Left Side - Founder Card */
    .founder-card-wrapper {
      display: flex;
      justify-content: center;
    }

    .founder-card {
      position: relative;
      width: 100%;
      max-width: 420px;
    }

    .card-bg {
      background: linear-gradient(135deg, #3f4e5e 0%, #2d3e48 100%);
      border-radius: 24px;
      padding: 40px 30px;
      text-align: center;
      position: relative;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
      min-height: 500px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .card-bg-light {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(148, 163, 184, 0.1) 0%, transparent 100%);
      border-radius: 24px;
    }

    .founder-image-circle {
      width: 180px;
      height: 180px;
      background: linear-gradient(135deg, #4a5f72 0%, #3f4e5e 100%);
      border: 4px solid #6b7f94;
      border-radius: 50%;
      margin: 0 auto 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 80px;
      font-weight: bold;
      color: white;
      position: relative;
      z-index: 1;
    }

    .founder-title {
      color: #c7d2dd;
      font-size: 14px;
      margin-top: 20px;
      letter-spacing: 0.5px;
    }

    .years-badge {
      position: absolute;
      bottom: 40px;
      right: -20px;
      background-color: white;
      border-radius: 16px;
      padding: 16px 24px;
      text-align: center;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
      z-index: 2;
    }

    .years-number {
      font-size: 32px;
      font-weight: bold;
      color: #0284c7;
      line-height: 1;
    }

    .years-text {
      font-size: 12px;
      color: #6b7280;
      margin-top: 4px;
      font-weight: 500;
    }

    /* Right Side - Content */
    .content-wrapper {
      padding: 0 20px;
    }

    .badge-blue {
      display: inline-block;
      background-color: #dbeafe;
      color: #0284c7;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 20px;
    }

    .content-wrapper h2 {
      font-size: 36px;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 20px;
      line-height: 1.3;
    }

    .content-wrapper p {
      font-size: 16px;
      color: #6b7280;
      margin-bottom: 20px;
      line-height: 1.8;
    }

    .quote-card {
      background-color: white;
      border: 2px solid #0284c7;
      border-radius: 16px;
      padding: 30px;
      margin-top: 40px;
      position: relative;
      overflow: hidden;
    }

    .quote-card::before {
      content: '"';
      position: absolute;
      top: -20px;
      right: 20px;
      font-size: 120px;
      color: rgba(2, 132, 199, 0.1);
      font-weight: bold;
    }

    .quote-icon {
      display: none;
    }

    .quote-text {
      font-size: 16px;
      color: #374151;
      font-style: italic;
      line-height: 1.8;
      margin-bottom: 20px;
      position: relative;
      z-index: 1;
    }

    .quote-author {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .author-avatar {
      width: 45px;
      height: 45px;
      background-color: #0284c7;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 18px;
    }

    .author-info h4 {
      font-size: 14px;
      color: #1f2937;
      margin: 0;
      font-weight: 600;
    }

    .author-info p {
      font-size: 12px;
      color: #6b7280;
      margin: 0;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .space-top {
        padding: 60px 20px;
      }

      .row-about {
        grid-template-columns: 1fr;
        gap: 40px;
      }

      .content-wrapper h2 {
        font-size: 28px;
      }

      .card-bg {
        padding: 30px 20px;
      }

      .founder-image-circle {
        width: 150px;
        height: 150px;
        font-size: 60px;
      }

      .years-badge {
        position: relative;
        right: 0;
        bottom: 0;
        margin-top: 20px;
        max-width: 200px;
        margin-left: auto;
        margin-right: auto;
      }

      .quote-card {
        padding: 20px;
      }
    }

    @media (max-width: 480px) {
      .space-top {
        padding: 40px 15px;
      }

      .row-about {
        gap: 30px;
      }

      .content-wrapper h2 {
        font-size: 24px;
      }

      .content-wrapper p {
        font-size: 14px;
      }

      .founder-image-circle {
        width: 120px;
        height: 120px;
        font-size: 48px;
      }

      .quote-text {
        font-size: 14px;
      }
    }
  `;

  return (
    <>
      <style>{styles}</style>

      <div className="space-top">
        <div className="container">
          <div className="row-about">
            {/* LEFT SIDE - FOUNDER CARD */}
            <div className="founder-card-wrapper">
              <div className="founder-card">
                <div className="card-bg">
                  <div className="card-bg-light"></div>
                  <div className="founder-image-circle">GS</div>
                  <p className="founder-title">Founder & Managing Director</p>
                </div>

                <div className="years-badge">
                  <div className="years-number">29+</div>
                  <div className="years-text">Years Leading the Industry</div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - CONTENT */}
            <div className="content-wrapper">
              <span className="badge-blue">Meet Our Founder</span>
              <h4>Rajesh Katakam</h4>
              <p style={{ color: "#0284c7", fontWeight: 600, marginBottom: 15 }}>
                Founder & Managing Director
              </p>

              <p>
                With a vision to revolutionize the automotive spare parts
                industry in Andhra Pradesh, Rajesh Katakam founded Gowrisankar
                Agencies in 1995. His deep understanding of the automotive
                sector and commitment to quality has been the cornerstone of our
                success.
              </p>

              <p>
                Starting from a small shop in Guntur, his dedication to customer
                satisfaction and genuine products transformed the business into
                one of the region's most trusted automotive parts suppliers. His
                philosophy of "Quality First, Customer Always" continues to guide
                every aspect of our operations.
              </p>

              {/* QUOTE CARD */}
              <div className="quote-card">
                <div className="quote-icon">"</div>
                <p className="quote-text">
                  "Our success is measured not by the parts we sell, but by the
                  trust we build with every customer who walks through our doors.
                  Quality and integrity are not just values – they are our
                  promise."
                </p>
                <div className="quote-author">
                  <div className="author-avatar">GS</div>
                  <div className="author-info">
                    <h4>Rajesh Katakam</h4>
                    <p>Founder, Gowrisankar Agencies</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutTwo;