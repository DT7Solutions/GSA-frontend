import React, { useEffect, useState } from 'react';
import $ from "jquery";
import SalesStatistic from '../../../components/dashboard-components/child/SalesStatistic';
import TotalSubscriber from '../../../components/dashboard-components/child/TotalSubscriber';
import UsersOverviewOne from '../../../components/dashboard-components/child/UsersOverviewOne';
import LatestRegistered from '../../../components/dashboard-components/child/LatestRegistered';
// import TopPerformerOne from './child/TopPerformerOne';
// import TopCountries from './child/TopCountries';
// import GeneratedContent from './child/GeneratedContent';
import UnitCount from '../../../components/dashboard-components/child/UnitCount';
import OrdersList from "./../Orders/OrdersList";
import API_BASE_URL from "../../../config";



import axios from 'axios';


const DashBoardLayerOne = () => {
const [orders, setOrders] = useState([]);
  const [tableInitialized, setTableInitialized] = useState(false);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalIncome: 0,
    completedOrders: 0,
    pendingOrders: 0,
    failedOrders: 0,
  });

  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    if (token) {
      axios.get(`${API_BASE_URL}api/home/orders/get_orders_list/`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((response) => {
        const orderData = response.data;
        setOrders(orderData);

        // ✅ Calculate stats
        const totalOrders = orderData.length;
        let totalIncome = 0;
        let completedOrders = 0;
        let pendingOrders = 0;
        let failedOrders = 0;

        orderData.forEach(order => {
          if (order.status === 'completed') completedOrders++;
          else if (order.status === 'pending') pendingOrders++;
          else if (order.status === 'failed') failedOrders++;

          // You can replace `order.amount` with your correct income field
          if (order.status === 'completed') {
            totalIncome += parseFloat(order.total_price || 0);
          }
        });

        setStats({
          totalOrders,
          totalIncome,
          completedOrders,
          pendingOrders,
          failedOrders
        });

        setTimeout(() => {
          if (!tableInitialized) {
            $('#dataTable').DataTable({ pageLength: 10, destroy: true });
            setTableInitialized(true);
          }
        }, 100);
      })
      .catch((error) => console.error("Error fetching orders:", error));
    }
  }, [token, tableInitialized]);

    return (
        <>
            {/* UnitCountOne */}
            <UnitCount  stats={stats}/>
            <section className="row gy-4 mt-1">
                 {/* orders list  */}
                <OrdersList />

                {/* SalesStatisticOne */}
                {/* <SalesStatistic /> */}

               

                {/* TotalSubscriberOne */}
                {/* <TotalSubscriber /> */}

                {/* UsersOverviewOne */}
                {/* <UsersOverviewOne /> */}

                {/* LatestRegisteredOne */}
         
                {/* <LatestRegistered /> */}

                {/* TopPerformerOne */}
                {/* <TopPerformerOne /> */}

                {/* TopCountries */}
                {/* <TopCountries /> */}

                {/* GeneratedContent */}
                {/* <GeneratedContent /> */}

            </section>
           
        </>


    )
}

export default DashBoardLayerOne