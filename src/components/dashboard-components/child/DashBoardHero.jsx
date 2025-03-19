import React from 'react'
import SalesStatistic from '../../../components/dashboard-components/child/SalesStatistic';
import TotalSubscriber from '../../../components/dashboard-components/child/TotalSubscriber';
import UsersOverviewOne from '../../../components/dashboard-components/child/UsersOverviewOne';
import LatestRegistered from '../../../components/dashboard-components/child/LatestRegistered';
// import TopPerformerOne from './child/TopPerformerOne';
// import TopCountries from './child/TopCountries';
// import GeneratedContent from './child/GeneratedContent';
import UnitCount from '../../../components/dashboard-components/child/UnitCount';

const DashBoardLayerOne = () => {

    return (
        <>
            {/* UnitCountOne */}
            <UnitCount />
            <section className="row gy-4 mt-1">

                {/* SalesStatisticOne */}
                <SalesStatistic />

                {/* TotalSubscriberOne */}
                <TotalSubscriber />

                {/* UsersOverviewOne */}
                <UsersOverviewOne />

                {/* LatestRegisteredOne */}
                <LatestRegistered />

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