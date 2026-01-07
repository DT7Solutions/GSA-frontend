import React from "react";
import TrackVisibility from "react-on-screen";
import CountUp from "react-countup";

const Aboutbreadcrumb = () => {
  const styles = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }

    /* About Header Section */
    .about-header {
      background: linear-gradient(to bottom, #475569, #1e293b);
      padding: 80px 20px;
      text-align: center;
      color: white;
    }

    .about-header .container {
      max-width: 900px;
    }

    .badge {
      display: inline-block;
      background-color: #64748b;
      color: white;
      padding: 10px 20px;
      border-radius: 50px;
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 30px;
      letter-spacing: 0.5px;
    }

    .about-header h1 {
      font-size: 60px;
      font-weight: bold;
      margin-bottom: 25px;
      line-height: 1.2;
    }

    .about-header h1 .highlight {
      color: #60a5fa;
    }

    .about-header p {
      font-size: 18px;
      color: #d1d5db;
      line-height: 1.8;
      max-width: 800px;
      margin: 0 auto;
    }

    /* Stats Section */
    .stats-section {
      background-color: #ffffff;
      padding: 60px 20px;
    }

    .stats-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 40px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .stat-card {
      text-align: center;
      padding: 20px;
    }

    .stat-card h3 {
      font-size: 48px;
      font-weight: bold;
      color: #0369a1;
      margin-bottom: 10px;
    }

    .stat-card p {
      font-size: 16px;
      color: #6b7280;
      font-weight: 500;
      letter-spacing: 0.3px;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .about-header {
        padding: 50px 20px;
      }

      .about-header h1 {
        font-size: 40px;
      }

      .about-header p {
        font-size: 16px;
      }

      .stats-container {
        grid-template-columns: repeat(2, 1fr);
        gap: 30px;
      }

      .stat-card h3 {
        font-size: 36px;
      }

      .stat-card p {
        font-size: 14px;
      }
    }

    @media (max-width: 480px) {
      .about-header h1 {
        font-size: 32px;
      }

      .about-header p {
        font-size: 14px;
      }

      .stats-container {
        grid-template-columns: 1fr;
        gap: 20px;
      }

      .stat-card h3 {
        font-size: 32px;
      }
    }
  `;

  return (
    <>
      <style>{styles}</style>

      {/* About Header Section */}
      <section className="about-header">
        <div className="container">
          <div className="badge">Est. 1995 • Guntur, Andhra Pradesh</div>

          <h1 className="text-white">
            About <span className="highlight">Gowrisankar Agencies</span>
          </h1>

          <p>
            Your trusted partner for quality car spare parts and accessories.
            Serving the automotive community with integrity and expertise since
            1995.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-container">
            <div className="stat-card">
               <h3><TrackVisibility once>
                                  {({ isVisible }) =>
                                    isVisible && (
                                      <span className="counter-number text-theme">
                                        <CountUp delay={0} start={0} end={29} />+
                                      </span>
                                    )
                                  }
                                </TrackVisibility></h3>
              <p>Years of Experience</p>
            </div>

            <div className="stat-card">
       <h3><TrackVisibility once>
                                  {({ isVisible }) =>
                                    isVisible && (
                                      <span className="counter-number text-theme">
                                        <CountUp delay={0} start={0} end={50} />+
                                      </span>
                                    )
                                  }
                                </TrackVisibility></h3>
              <p>Parts in Stock</p>
            </div>

            <div className="stat-card">
             <h3><TrackVisibility once>
                                  {({ isVisible }) =>
                                    isVisible && (
                                      <span className="counter-number text-theme">
                                        <CountUp delay={0} start={0} end={10000} />+
                                      </span>
                                    )
                                  }
                                </TrackVisibility></h3>
              <p>Happy Customers</p>
            </div>

            <div className="stat-card">
    <h3><TrackVisibility once>
                                  {({ isVisible }) =>
                                    isVisible && (
                                      <span className="counter-number text-theme">
                                        <CountUp delay={0} start={0} end={5} />+
                                      </span>
                                    )
                                  }
                                </TrackVisibility></h3>
              <p>Brands Available</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Aboutbreadcrumb;