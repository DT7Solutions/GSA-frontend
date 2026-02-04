import React from 'react';
import { CheckCircle, Award, Truck, Headphones, BadgeCheck } from 'lucide-react';

const WhyChooseUs = () => {
  const features = [
    {
      icon: <CheckCircle className="w-10 h-10" />,
      title: "100% Genuine Parts",
      description: "Only authentic parts from trusted manufacturers.",
    },
    {
      icon: <Truck className="w-10 h-10" />,
      title: "Fast Delivery",
      description: "Quick delivery when you need it most.",
    },
    {
      icon: <Award className="w-10 h-10" />,
      title: "Best Prices",
      description: "Competitive pricing without compromising quality.",
    },
    {
      icon: <Headphones className="w-10 h-10" />,
      title: "Expert Support",
      description: "Knowledgeable team ready to assist you.",
    },
    {
      icon: <BadgeCheck className="w-10 h-10" />,
      title: "Trusted Since 1985",
      description: "Three decades of excellence and integrity.",
    },
  ];

  return (
    <section style={{ padding: '80px 0', background: '#f0f2f5' }}>
      <style>{`
        .why-choose-card {
          background: white;
          border-radius: 16px;
          padding: 32px 24px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          height: 100%;
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .why-choose-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }
        
        .card-bg-circle {
          position: absolute;
          width: 120px;
          height: 120px;
          background: linear-gradient(135deg, #ecf5fa 0%, #d4e9f7 100%);
          border-radius: 50%;
          top: -30px;
          right: -30px;
          opacity: 0.5;
        }
        
        .icon-box {
          background: linear-gradient(135deg, #0068a5 0%, #004d7a 100%);
          color: white;
          width: 60px;
          height: 60px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 104, 165, 0.3);
        }
        
        .feature-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 12px;
          line-height: 1.4;
        }
        
        .feature-description {
          font-size: 14px;
          color: #6b7280;
          line-height: 1.6;
          margin: 0;
        }
      `}
      
      </style>
      {/* Responsive CSS */}
<style>{`
  @media (max-width: 768px) {
    .why-choose-wrapper {
      flex-wrap: wrap !important;
    }

    .why-choose-item {
      flex: 0 0 100% !important;
      max-width: 100% !important;
    }
  }
`}</style>

      
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h5 style={{  fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>
            Why Choose <span className='highlight-text'> Gowrisankar Agencies</span>
          </h5>
          <p style={{ fontSize: '1.125rem', color: '#6b7280', maxWidth: '700px', margin: '0 auto' }}>
            Experience excellence in every aspect of our service. We're committed
            to providing you with the best Car Spare  parts and support.
          </p>
        </div>

        {/* Feature Cards - All in One Row */}
        <div
  className="why-choose-wrapper"
  style={{
    display: "flex",
    gap: "24px",
    justifyContent: "center",
    flexWrap: "nowrap",
    alignItems: "stretch",
  }}
>
  {features.map((feature, index) => (
    <div
      key={index}
      className="why-choose-item"
      style={{ flex: "1", minWidth: "0", maxWidth: "280px" }}
    >
              <div className="why-choose-card">
                {/* Decorative Background */}
                <div className="card-bg-circle" />
                
                {/* Content */}
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'flex-start',
                  position: 'relative',
                  zIndex: 1,
                }}>
                  {/* Icon */}
                  <div style={{ marginBottom: '20px' }}>
                    <div className="icon-box">
                      {feature.icon}
                    </div>
                  </div>

                  {/* Title */}
                  <h6 className="feature-title">
                    {feature.title}
                  </h6>

                  {/* Description */}
                  <p className="feature-description">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;