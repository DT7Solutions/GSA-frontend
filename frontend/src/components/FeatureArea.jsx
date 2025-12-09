import React from 'react';
import { CheckCircle, Award, Truck, Headphones } from 'lucide-react';

const WhyChooseUs = () => {
  const features = [
    {
      icon: <CheckCircle className="w-10 h-10" />,
      title: "100% Customer Satisfaction",
      description:
        "Your happiness is our priority.",
    },
    {
      icon: <Award className="w-10 h-10" />,
      title: "100% Quality Car Accessories",
      description:
        "Only premium, tested products.",
    },
    // {
    //   icon: <Truck className="w-10 h-10" />,
    //   title: "Free Shipping",
    //   description:
    //     "Fast and reliable delivery.",
    // },
    {
      icon: <Headphones className="w-10 h-10" />,
      title: "24/7 Support For Clients",
      description:
        "We're always here to help.",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container">
        
        {/* Header */}
        {/* <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Choose Us
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience excellence in every aspect of our service. We're committed
            to providing you with the best car accessories and support.
          </p>
        </div> */}

        {/* Feature Cards */}
        <div className="row g-4 justify-content-center">
          {features.map((feature, index) => (
            <div key={index} className="col-lg-4 col-md-6 col-sm-12">
              <div className="bg-white rounded-2xl p-20  shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 h-100 d-flex align-items-center gap-3">
                <div className="flex-shrink-0">
                  <div className="d-flex align-items-center justify-content-center" style={{ backgroundColor: '#ecf5fa', color: '#0068a5', width: '50px', height: '50px', borderRadius: '50%' }}>
                    {feature.icon}
                  </div>
                </div>

                <div className="flex-grow-1">
                  <h6 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h6>

                  <p className="text-gray-600 leading-relaxed mb-0" style={{ fontSize: '14px' }}>
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