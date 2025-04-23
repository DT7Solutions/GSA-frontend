import React, { useEffect, useState } from "react";
import HeaderFive from "../../../components/HeaderFive";
import FooterAreaFour from "../../../components/FooterAreaFour";
import Breadcrumb from "../../../components/Breadcrumb";
import PartCategorySelection from "components/dashboard-components/product/PartCategorySelection";
import Preloader from "../../../helper/Preloader";
import { useParams } from 'react-router-dom';
import axios from "axios";
import API_BASE_URL from "../../../config";

const PartCategoryPage = () => {
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
      {active === true && <Preloader />}
      <HeaderFive />

      <Breadcrumb title={Modelveriant.name} />
       <PartCategorySelection id={id} modelvariant={Modelveriant}/>
      <FooterAreaFour />
    </>
  );
};

export default PartCategoryPage;
