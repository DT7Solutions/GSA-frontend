import React from "react";

const FaqAreaThree = () => {
  return (
    <div className="faq-area-1">
      <div className="container">
        <div
          className="faq-wrap space"
          style={{
            backgroundImage: `url(${process.env.PUBLIC_URL}/assets/img/update-img/faq-bg.png)`,
            backgroundColor: "#F4F4F4",
            backgroundSize: "cover",
          }}
        >
          <div className="row justify-content-center">
            <div className="col-xl-5 col-lg-6 col-11">
              <div className="title-area text-center">
                <span className="sub-title">ask anything</span>
                <h2 className="sec-title gsa-title">
                  Empowering Businesses For A Brighter Future
                </h2>
              </div>
            </div>
            <div className="col-xl-8 col-md-10 col-11">
              <div className="accordion-area accordion" id="faqAccordion">
                <div className="accordion-card style3 active">
                  <div className="accordion-header" id="collapse-item-1">
                    <button
                      className="accordion-button "
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapse-1"
                      aria-expanded="true"
                      aria-controls="collapse-1"
                    >
                      {" "}
                      What is the purpose of a business plan?
                    </button>
                  </div>
                  <div
                    id="collapse-1"
                    className="accordion-collapse collapse show"
                    aria-labelledby="collapse-item-1"
                    data-bs-parent="#faqAccordion"
                  >
                    <div className="accordion-body">
                      <p className="faq-text">
                        Some essential steps to start a business include
                        conducting market research, creating Some essential
                        steps to start a business.Some essential steps to start
                        a business include conducting market research, creating
                        Some essential steps to start a business.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="accordion-card style3">
                  <div className="accordion-header" id="collapse-item-2">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapse-2"
                      aria-expanded="false"
                      aria-controls="collapse-2"
                    >
                      {" "}
                      How can I register my business name?
                    </button>
                  </div>
                  <div
                    id="collapse-2"
                    className="accordion-collapse collapse "
                    aria-labelledby="collapse-item-2"
                    data-bs-parent="#faqAccordion"
                  >
                    <div className="accordion-body">
                      <p className="faq-text">
                        Some essential steps to start a business include
                        conducting market research, creating Some essential
                        steps to start a business.Some essential steps to start
                        a business include conducting market research, creating
                        Some essential steps to start a business.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="accordion-card style3">
                  <div className="accordion-header" id="collapse-item-3">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapse-3"
                      aria-expanded="false"
                      aria-controls="collapse-3"
                    >
                      {" "}
                      How can I protect my intellectual property?
                    </button>
                  </div>
                  <div
                    id="collapse-3"
                    className="accordion-collapse collapse "
                    aria-labelledby="collapse-item-3"
                    data-bs-parent="#faqAccordion"
                  >
                    <div className="accordion-body">
                      <p className="faq-text">
                        Some essential steps to start a business include
                        conducting market research, creating Some essential
                        steps to start a business.Some essential steps to start
                        a business include conducting market research, creating
                        Some essential steps to start a business.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaqAreaThree;
