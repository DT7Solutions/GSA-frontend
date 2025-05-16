import React, { useEffect, useState } from "react";
import HeaderFive from "../../../components/HeaderFive";
import FooterAreaFour from "../../../components/FooterAreaFour";
import Breadcrumb from "../../../components/Breadcrumb";
import PartList from "components/dashboard-components/product/PartsList";
import Preloader from "../../../helper/Preloader";
import axios from "axios";
import API_BASE_URL from "../../../config";
import { useParams } from 'react-router-dom';

const PartListPage = () => {
  const { id } = useParams();
  const [partItem, setpartItem] = useState([]);
  let [active, setActive] = useState(true);

  useEffect(() => {
    setTimeout(function () {
      setActive(false);
    }, 2000);
  }, []);


  
  useEffect(() => {
    const fetchCarMakes = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}api/home/part_groups_item/${id}/`);
        setpartItem(response.data);
      } catch (error) {
        console.error('Error fetching car makes:', error);
      }
    };
   
    fetchCarMakes();
  }, []);

  return (
    <>
      {/* {active === true && <Preloader />} */}
      <HeaderFive />

      <Breadcrumb title={partItem.name} />
       <PartList id={id} partItem={partItem}/>
      <FooterAreaFour />
    </>
  );
};

export default PartListPage;
