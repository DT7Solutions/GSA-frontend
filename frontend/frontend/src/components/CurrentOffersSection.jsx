import React from "react";
import { Link } from "react-router-dom";

const CurrentOffers = () => {
    return (
        <div className="service-area-2 space overflow-hidden bg-smoke">
            <div className="container">
                <div className="hero-style">
                    <h1 className="hero-title gsa-title">Current Offers</h1>
                </div>
                <div className="row gx-30 gy-30 mt-5">
                    <div className="col-lg-4 col-md-6">
                        <div
                            className="hero-intro-card"
                            style={{ backgroundColor: "#9CD8F1" }}
                        >
                            <div className="intro-card-img">
                                <img src={`${process.env.PUBLIC_URL}/assets/img/update-img/hero6-2.png`} alt="Fixturbo" />
                            </div>
                            <div className="intro-card-details">
                                <h6 className="intro-card-subtitle">save up to $5.00</h6>
                                <h4 className="intro-card-title">
                                    <Link to="#">Engine pistons and cog</Link>
                                </h4>
                                <Link to="/shop" className="btn style5 style-radius">
                                    Shop Now
                                    <i className="fas fa-arrow-right ms-2" />
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <div
                            className="hero-intro-card"
                            style={{ backgroundColor: "#54A1EF" }}
                        >
                            <div className="intro-card-img">
                                <img src={`${process.env.PUBLIC_URL}/assets/img/update-img/hero6-3.png`} alt="Fixturbo" />
                            </div>
                            <div className="intro-card-details">
                                <h6 className="intro-card-subtitle">save up to $5.00</h6>
                                <h4 className="intro-card-title">
                                    <Link to="#">Engine pistons and cog</Link>
                                </h4>
                                <Link to="/shop" className="btn style5 style-radius">
                                    Shop Now
                                    <i className="fas fa-arrow-right ms-2" />
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <div className="hero-intro-card bg-theme">
                            <div className="intro-card-img">
                                <img src={`${process.env.PUBLIC_URL}/assets/img/update-img/hero6-4.png`} alt="Fixturbo" />
                            </div>
                            <div className="intro-card-details">
                                <h6 className="intro-card-subtitle text-white">
                                    save up to $5.00
                                </h6>
                                <h4 className="intro-card-title text-white">
                                    <Link to="#">Engine pistons and cog</Link>
                                </h4>
                                <Link to="/shop" className="btn style5 style-radius">
                                    Shop Now
                                    <i className="fas fa-arrow-right ms-2" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CurrentOffers;
