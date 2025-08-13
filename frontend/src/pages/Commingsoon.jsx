import React, { useEffect, useState } from "react";

const Commingsoon = () => {
  const [active, setActive] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setActive(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
   
        <div
          style={{
            width: "100%",
            height: "115vh",
            backgroundImage: `url(${process.env.PUBLIC_URL}/assets/img/commingsoon/comming-soon.png)`,
            backgroundSize: "cover",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
            backgroundRepeat: "no-repeat",
            backgroundColor: "#000",
            overflow:'hideen',
            margin: "0 auto",
          }}
        ></div>
     
    </>
  );
};

export default Commingsoon;
