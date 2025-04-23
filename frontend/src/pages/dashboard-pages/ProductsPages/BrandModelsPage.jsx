import React, { useEffect, useState } from "react";
import HeaderFive from "../../../components/HeaderFive";
import { useParams } from 'react-router-dom';
import FooterAreaFour from "../../../components/FooterAreaFour";
import Breadcrumb from "../../../components/Breadcrumb";
import BrandModels from "../../../components/dashboard-components/product/BrandModels";
import Preloader from "../../../helper/Preloader";
import axios from "axios";
import API_BASE_URL from "../../../config";

const BrandModelsPage = () => {
  const { id } = useParams();
  const [carMakes, setCarMakes] = useState([]);
  let [active, setActive] = useState(true);

  useEffect(() => {
    setTimeout(function () {
      setActive(false);
    }, 2000);
  }, []);

   useEffect(() => {
      const fetchCarMakes = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}api/home/car-makes/${id}/`);
          setCarMakes(response.data);
        } catch (error) {
          console.error('Error fetching car makes:', error);
        }
      };
     
      fetchCarMakes();
    }, []);
  

  return (
    <>
      {/* Preloader */}
      {active === true && <Preloader />}

      {/* Header one */}
      <HeaderFive />

      <Breadcrumb title={carMakes.name || "Brand Models"} />

  
      <BrandModels  id={id} carMakes={carMakes}/>


      {/* Footer Area One */}
      <FooterAreaFour />
    </>
  );
};

export default BrandModelsPage;
