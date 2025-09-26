// import React from "react";
// import { Link } from "react-router-dom";

// const Breadcrumb = ({ title }) => {
//   return (
//     <div className="breadcumb-wrapper">
//       <div className="container">
//         <div className="row">
//           <div className="col-lg-">
//             <div className="breadcumb-content">
//               <h1 className="breadcumb-title">{title}</h1>
//               <ul className="breadcumb-menu">
//                 <li>
//                   <Link to="/">Home</Link>
//                 </li>
//                 <li className="active">{title}</li>
//               </ul>
//             </div>
//           </div>
//           <div className="col-lg-6 d-lg-block d-none">
//             <div className="breadcumb-thumb">
              
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Breadcrumb;


// import React from "react";
// import { Link } from "react-router-dom";

// const Breadcrumb = () => {
//   const selectedBrand = JSON.parse(localStorage.getItem("selected_brand"));

//   return (
//     <div className="breadcumb-wrapper">
//       <div className="container">
//         <div className="row">
//           <div className="col-lg-12">
//             <div className="breadcumb-content">
//              <h1 className="breadcumb-title">
//                 {selectedBrand?.brand_model_name || selectedBrand?.brand_name || "Shop"}
//               </h1>
//               <ul className="breadcumb-menu">
//                 <li>
//                   <Link to="/">Home</Link>
//                 </li>
//                 {selectedBrand?.brand_name && <li>{selectedBrand.brand_name}</li>}
//                 {selectedBrand?.brand_model_name && <li className="active">{selectedBrand.brand_model_name}</li>}
//               </ul>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Breadcrumb;
import React from "react";
import { Link } from "react-router-dom";

const Breadcrumb = () => {
  const selectedBrand = JSON.parse(localStorage.getItem("selected_brand"));

  const brandId = selectedBrand?.brand;
  const modelId = selectedBrand?.brand_model;
  const variantId = selectedBrand?.model_variant;

  const updateBreadcrumbToLevel = (level) => {
  const existing = JSON.parse(localStorage.getItem("selected_brand")) || {};
  const updated = {};

  if (level === "brand") {
    updated.brand = existing.brand;
    updated.brand_name = existing.brand_name;
  } else if (level === "model") {
    updated.brand = existing.brand;
    updated.brand_name = existing.brand_name;
    updated.brand_model = existing.brand_model;
    updated.brand_model_name = existing.brand_model_name;
  } else if (level === "variant") {
    updated.brand = existing.brand;
    updated.brand_name = existing.brand_name;
    updated.brand_model = existing.brand_model;
    updated.brand_model_name = existing.brand_model_name;
    updated.model_variant = existing.model_variant;
    updated.model_variant_name = existing.model_variant_name;
  }

  localStorage.setItem("selected_brand", JSON.stringify(updated));
};


  return (
    <div className="breadcumb-wrapper">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="breadcumb-content">
              <h1 className="breadcumb-title">
                {selectedBrand?.model_variant_name ||
                  selectedBrand?.brand_model_name ||
                  selectedBrand?.brand_name ||
                  "Shop"}
              </h1>

             <ul className="breadcumb-menu">
  <li>
    <Link to="/">Home</Link>
  </li>

  {selectedBrand?.brand_name && (
    <li>
     <Link to={`/brand-models/${brandId}`} onClick={() => updateBreadcrumbToLevel("brand")}>
  {selectedBrand.brand_name}
</Link>

    </li>
  )}

  {selectedBrand?.brand_model_name && (
    <li>
     <Link to={`/models-variant/${modelId}`} onClick={() => updateBreadcrumbToLevel("model")}>
  {selectedBrand.brand_model_name}
</Link>

    </li>
  )}

  {selectedBrand?.model_variant && selectedBrand?.model_variant_name && (
    <li>
      <Link to={`/part-category/${variantId}`} onClick={() => updateBreadcrumbToLevel("variant")}>
  {selectedBrand.model_variant_name}
</Link>

    </li>
  )}

  {selectedBrand?.brand_category && selectedBrand?.brand_category_name && (
    <li className="active">{selectedBrand.brand_category_name}</li>
  )}
</ul>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;













