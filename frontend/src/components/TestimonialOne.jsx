import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: "Ramesh Kumar",
      designation: "Customer",
      rating: 5,
      text: "I bought a Hyundai bumper and mirror from Gowrisankar Agencies. The quality was top-notch and delivery was very fast. Highly recommend for genuine auto parts in Guntur!"
    },
    {
      id: 2,
      name: "Priya Sharma",
      designation: "Car Owner",
      rating: 5,
      text: "Their customer service is excellent. I needed a Toyota tail lamp urgently, and they helped me with the right part and guidance. Very reliable team."
    },
    {
      id: 3,
      name: "Arvind Raj",
      designation: "Workshop Owner",
      rating: 5,
      text: "I regularly purchase Hyundai and Toyota parts from them. Genuine products, great prices, and the staff is knowledgeable. My go-to supplier in Guntur."
    },
    {
      id: 4,
      name: "Venkat Reddy",
      designation: "Customer",
      rating: 5,
      text: "Best place for car spare parts in Guntur. Quality products at competitive prices. The owner is very helpful and provides honest advice. I always come here for my car maintenance."
    },
    {
      id: 5,
      name: "Anitha Devi",
      designation: "Business Owner",
      rating: 5,
      text: "Outstanding service! They have a wide range of spare parts and accessories. Very prompt delivery and excellent customer support. Will definitely recommend to friends and family."
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const cardsPerView = isMobile ? 1 : 3;

  // Auto-slide on mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isMobile) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => 
        prev + cardsPerView >= testimonials.length ? 0 : prev + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [isMobile, cardsPerView, testimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => 
      prev + cardsPerView >= testimonials.length ? 0 : prev + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? Math.max(0, testimonials.length - cardsPerView) : prev - 1
    );
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const visibleTestimonials = testimonials.slice(currentIndex, currentIndex + cardsPerView);

  const styles = `
    .gsa-testimonial-section {
      background: #edf0f3;
      padding: 64px 16px;
    }

    .gsa-testimonial-container {
      max-width: 1280px;
      margin: 0 auto;
    }

    .gsa-testimonial-header {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 48px;
      gap: 16px;
    }

    @media (min-width: 768px) {
      .gsa-testimonial-header {
        flex-direction: row;
      }
    }

    .gsa-testimonial-title {
      font-size: 2.25rem;
      font-weight: bold;
      color: #1e293b;
      margin: 0;
      text-align: center;
    }

    @media (min-width: 768px) {
      .gsa-testimonial-title {
        font-size: 3rem;
        text-align: left;
      }
    }

    .gsa-testimonial-nav {
      display: flex;
      gap: 12px;
    }

    .gsa-testimonial-nav-btn {
      background: white;
      color: #475569;
      padding: 16px;
      border: none;
      border-radius: 50%;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .gsa-testimonial-nav-btn:hover {
      background: #0068a4;
      color: white;
      transform: scale(1.1);
    }

    .gsa-testimonial-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 24px;
    }

    @media (min-width: 768px) {
      .gsa-testimonial-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (min-width: 1024px) {
      .gsa-testimonial-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .gsa-testimonial-card {
      background: white;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }

    .gsa-testimonial-card:hover {
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      transform: translateY(-4px);
    }

    .gsa-testimonial-quote-icon {
      color: #0068a4;
      margin-bottom: 16px;
    }

    .gsa-testimonial-rating {
      display: flex;
      gap: 4px;
      margin-bottom: 16px;
    }

    .gsa-testimonial-star {
      width: 18px;
      height: 18px;
      fill: #fbbf24;
      color: #fbbf24;
    }

    .gsa-testimonial-text {
      color: #475569;
      line-height: 1.625;
      margin-bottom: 24px;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .gsa-testimonial-divider {
      border-top: 1px solid #e2e8f0;
      padding-top: 16px;
    }

    .gsa-testimonial-user {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .gsa-testimonial-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: #0068a4;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 1.125rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .gsa-testimonial-user-info {
      flex: 1;
    }

    .gsa-testimonial-user-name {
      font-weight: 600;
      color: #1e293b;
      font-size: 1.125rem;
      margin: 0 0 4px 0;
    }

    .gsa-testimonial-user-designation {
      color: #64748b;
      font-size: 0.875rem;
      margin: 0;
    }

    .gsa-testimonial-dots {
      display: flex;
      justify-content: center;
      gap: 8px;
      margin-top: 32px;
    }

    .gsa-testimonial-dot {
      height: 8px;
      border-radius: 9999px;
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;
      padding: 0;
    }

    .gsa-testimonial-dot-active {
      width: 32px;
      background: #0068a4;
    }

    .gsa-testimonial-dot-inactive {
      width: 8px;
      background: #cbd5e1;
    }

    .gsa-testimonial-dot-inactive:hover {
      background: #94a3b8;
    }

    @media (max-width: 767px) {
      .gsa-testimonial-nav {
        display: none;
      }
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <section className="gsa-testimonial-section">
        <div className="gsa-testimonial-container">
          {/* Header with Navigation */}
          <div className="gsa-testimonial-header">
            <div>
              <h4 className="gsa-testimonial-title">
                What Our <span style={{ color: '#0068a4' }}>Customers Say</span>
              </h4>
            </div>
            
            {/* Navigation Arrows - Hidden on Mobile */}
            <div className="gsa-testimonial-nav">
              <button
                onClick={prevTestimonial}
                className="gsa-testimonial-nav-btn"
                aria-label="Previous testimonials"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={nextTestimonial}
                className="gsa-testimonial-nav-btn"
                aria-label="Next testimonials"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

          {/* Testimonial Cards */}
          <div className="gsa-testimonial-grid">
            {visibleTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="gsa-testimonial-card">
                {/* Quote Icon */}
                <div className="gsa-testimonial-quote-icon">
                  <Quote size={40} fill="rgba(59, 130, 246, 0.1)" />
                </div>

                {/* Star Rating */}
                <div className="gsa-testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="gsa-testimonial-star" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="gsa-testimonial-text">
                  {testimonial.text}
                </p>

                {/* Border */}
                <div className="gsa-testimonial-divider">
                  {/* User Info */}
                  <div className="gsa-testimonial-user">
                    {/* Avatar with Initials */}
                    <div className="gsa-testimonial-avatar">
                      {getInitials(testimonial.name)}
                    </div>
                    
                    {/* Name and Designation */}
                    <div className="gsa-testimonial-user-info">
                      <h6 className="gsa-testimonial-user-name">
                        {testimonial.name}
                      </h6>
                      <p className="gsa-testimonial-user-designation">
                        {testimonial.designation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots Indicator */}
          <div className="gsa-testimonial-dots">
            {Array.from({ length: Math.ceil(testimonials.length / cardsPerView) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index * cardsPerView)}
                className={`gsa-testimonial-dot ${
                  Math.floor(currentIndex / cardsPerView) === index
                    ? 'gsa-testimonial-dot-active'
                    : 'gsa-testimonial-dot-inactive'
                }`}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default TestimonialsSection;