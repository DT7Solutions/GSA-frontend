import React, { useEffect, useState } from "react";
import HeaderFive from "../components/HeaderFive";
import { useParams } from 'react-router-dom';
import FooterAreaFour from "../components/FooterAreaFour";
import Breadcrumb from "../components/Breadcrumb";
import SubscribeOne from "../components/SubscribeOne";
import ShopArea from "../components/ShopArea";
import Preloader from "../helper/Preloader";
import axios from "axios";
import API_BASE_URL from "../config"

const ShopPage = () => {


  const { id } = useParams();
  const [Modelveriant, setCarModelveriant] = useState([]);
  let [active, setActive] = useState(true);

  useEffect(() => {
    setTimeout(function () {
      setActive(false);
    }, 2000);
  }, []);

    
      
      useEffect(() => {
        const fetchCarMakes = async () => {
          try {
            const response = await axios.get(`${API_BASE_URL}api/home/model_variant_item/${id}/`);
            setCarModelveriant(response.data);
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
      <HeaderFive />
      <Breadcrumb title={"Shop"} />
      
      <ShopArea  id={id}/>

      <FooterAreaFour />
    </>
  );
};

export default ShopPage;
