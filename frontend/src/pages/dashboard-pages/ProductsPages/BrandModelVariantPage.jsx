import React, { useEffect, useState } from "react";
import HeaderFive from "../../../components/HeaderFive";
import FooterAreaFour from "../../../components/FooterAreaFour";
import Breadcrumb from "../../../components/Breadcrumb";
import ModelVariants from "../../../components/dashboard-components/product/ModelVariants";
import Preloader from "../../../helper/Preloader";
import { useParams } from 'react-router-dom';
import axios from "axios";
import API_BASE_URL from "../../../config";


const BrandModelsVariantPage = () => {
  const { id } = useParams();
  const [carModelItem, setCarModelItem] = useState([]);

  let [active, setActive] = useState(true);
  useEffect(() => {
    setTimeout(function () {
      setActive(false);
    }, 2000);
  }, []);

  useEffect(() => {
    const fetchCarMakes = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}api/home/car-model/${id}/`);
        setCarModelItem(response.data);
      } catch (error) {
        console.error('Error fetching car makes:', error);
      }
    };
   
    fetchCarMakes();
  }, []);

  return (
    <>

      {active === true && <Preloader />}
      <HeaderFive />
      <Breadcrumb title={carModelItem.name || "Brand Models"} />

      <ModelVariants id={id} carModelItem={carModelItem} />
      
      <FooterAreaFour />
    </>
  );
};

export default BrandModelsVariantPage;
