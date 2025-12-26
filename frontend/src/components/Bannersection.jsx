import React from 'react';

const TwoBannerSection = () => {
  const banners = [
    {
      id: 1,
      heading: "Premium Quality Auto Parts",
      paragraph: "Get the best genuine parts for vehicles",
      buttonText: "Shop Now",
      buttonLink: "#shop",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      buttonHoverColor: "#667eea",
      backgroundImage: "url('assets/img/bg/Homepage-banner-one.png')",
    },
    {
      id: 2,
      heading: "Expert Service You Trust",
      paragraph: "Professional support for all your automotive needs",
      buttonText: "Learn More",
      buttonLink: "#learn",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      buttonHoverColor: "#f5576c",
      backgroundImage: "url('assets/img/bg/Homepage-banner-two.png')",
    }
  ];

  const styles = {
    bannerSection: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 20px',
    },
    bannerRow: {
      display: 'flex',
      gap: '30px',
      flexWrap: 'wrap',
    },
    bannerCol: {
      flex: '1',
      minWidth: '300px',
    },
    bannerCard: {
      position: 'relative',
      height: '300px',
      borderRadius: '7px',
      overflow: 'hidden',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      cursor: 'pointer',
    },
    bannerBackground: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      opacity: 0.15,
    },
    bannerContent: {
      position: 'relative',
      zIndex: 2,
      padding: '50px 40px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      color: 'white',
    },
    bannerHeading: {
      fontSize: '15px!important',
      fontWeight: '700',
      marginBottom: '20px',
      lineHeight: '1.2',
      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
    },
    bannerParagraph: {
      fontSize: '16px',
      lineHeight: '1.6',
      marginBottom: '30px',
      opacity: 0.95,
      maxWidth: '350px',
    },
    bannerButton: {
      display: 'inline-block',
      padding: '14px 32px',
      background: 'white',
      color: '#333',
      textDecoration: 'none',
      borderRadius: '50px',
      fontWeight: '600',
      fontSize: '15px',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
      width: 'fit-content',
      border: 'none',
      cursor: 'pointer',
    },
  };

  const handleCardHover = (e, isHovering) => {
    if (isHovering) {
      e.currentTarget.style.transform = 'translateY(-5px)';
      e.currentTarget.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.25)';
    } else {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.15)';
    }
  };

  const handleButtonHover = (e, isHovering, hoverColor) => {
    if (isHovering) {
      e.currentTarget.style.transform = 'scale(1.05)';
      e.currentTarget.style.background = hoverColor;
      e.currentTarget.style.color = 'white';
      e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
    } else {
      e.currentTarget.style.transform = 'scale(1)';
      e.currentTarget.style.background = 'white';
      e.currentTarget.style.color = '#333';
      e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
    }
  };

  return (
    <div  className='col-12' style={{background:"#f0f2f5"}}>
      <div className='container' style={styles.bannerRow}>
        {banners.map((banner) => (
          <div key={banner.id} style={styles.bannerCol}>
            <div
              style={{
                ...styles.bannerCard,
                backgroundImage: banner.backgroundImage,
              }}
              onMouseEnter={(e) => handleCardHover(e, true)}
              onMouseLeave={(e) => handleCardHover(e, false)}
            >
                
              <div style={styles.bannerBackground}></div>
              <div style={styles.bannerContent}>
                <h2 className="text-white  heading-banner-section" style={styles.bannerHeading}>{banner.heading}</h2>
                <p  className="text-white" style={styles.bannerParagraph}>{banner.paragraph}</p>
                {/* <a
                  href={banner.buttonLink}
                  style={styles.bannerButton}
                  onMouseEnter={(e) => handleButtonHover(e, true, banner.buttonHoverColor)}
                  onMouseLeave={(e) => handleButtonHover(e, false, banner.buttonHoverColor)}
                  onClick={(e) => {
                    e.preventDefault();
                    console.log(`Clicked: ${banner.buttonText}`);
                  }}
                >
                  {banner.buttonText}
                </a> */}
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .banner-col {
            min-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
};

export default TwoBannerSection;