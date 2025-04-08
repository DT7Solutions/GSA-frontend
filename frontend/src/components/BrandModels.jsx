import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode, Thumbs, EffectFade, Autoplay } from "swiper";
import { Link } from "react-router-dom";
const BrandModels = () => {
    return (
        // pt-95
        <div className="category-area-1 pb-100 brand-logo-display mt-5">
            <div className="container-fluid">
                <h4 className="text-center fw-extrabold mb-20">Search By Hyundai Car Model</h4>
                <div className="row mt-5 brands-sec">

                    <div className="col-sm-12 col-md-3 col-lg-3 mb-3">
                        <div className="brand-models">
                            <Link to="/bran-models"><img
                                src={`${process.env.PUBLIC_URL}/assets/img/brands/brand-models/98.jpg`}
                                alt="Fixturbo"
                            /></Link>
                            <div className="text-center">
                                <Link to="/bran-models" className="text-center brand-name">
                                HYUNDAI CRETA 1ST GEN <br/>(2015-2018)
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-3 col-lg-3 mb-3">
                        <div className="brand-models">
                            <Link to="/bran-models"><img
                                src={`${process.env.PUBLIC_URL}/assets/img/brands/brand-models/24.png`}
                                alt="Fixturbo"
                            /></Link>
                            <div className="text-center">
                                <Link to="/bran-models" className="text-center brand-name">
                                HYUNDAI ALCAZAR 1ST GEN <br/>(2021-2023)
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-3 col-lg-3 mb-3">
                        <div className="brand-models">
                            <Link to="/bran-models"><img
                                src={`${process.env.PUBLIC_URL}/assets/img/brands/brand-models/30.png`}
                                alt="Fixturbo"
                            /></Link>
                            <div className="text-center">
                                <Link to="/bran-models" className="text-center brand-name">
                                HYUNDAI ALCAZAR 2ND GEN <br/>(2024-NOW)
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-3 col-lg-3 mb-3">
                        <div className="brand-models">
                            <Link to="/bran-models"><img
                                src={`${process.env.PUBLIC_URL}/assets/img/brands/brand-models/43.png`}
                                alt="Fixturbo"
                            /></Link>
                            <div className="text-center">
                                <Link to="/bran-models" className="text-center brand-name">
                                HYUNDAI VERNA 5TH GEN F/L <br/>(2020-2023)
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-3 col-lg-3 mb-3">
                        <div className="brand-models">
                            <Link to="/bran-models"><img
                                src={`${process.env.PUBLIC_URL}/assets/img/brands/brand-models/80.jpg`}
                                alt="Fixturbo"
                            /></Link>
                            <div className="text-center">
                                <Link to="/bran-models" className="text-center brand-name">
                                    Hyundai
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-3 col-lg-3 mb-3">
                        <div className="brand-models">
                            <Link to="/bran-models"><img
                                src={`${process.env.PUBLIC_URL}/assets/img/brands/brand-models/94.png`}
                                alt="Fixturbo"
                            /></Link>
                            <div className="text-center">
                                <Link to="/bran-models" className="text-center brand-name">
                                    Hyundai
                                </Link>
                            </div>
                        </div>
                    </div>





                </div>
            </div>
        </div>
    );
};

export default BrandModels;
