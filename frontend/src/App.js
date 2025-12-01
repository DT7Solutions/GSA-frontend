// import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute"; 
import RouteScrollToTop from "./helper/RouteScrollToTop";
// import ScrollToTop from "react-scroll-to-top";
import ScrollToTop from "./components/ScrollToTop";
import AboutPage from "./pages/AboutPage";
import ServicePage from "./pages/ServicePage";
import ServiceDetailsPage from "./pages/ServiceDetailsPage";
import BlogPage from "./pages/BlogPage";
import BlogDetailsPage from "./pages/BlogDetailsPage";
import ShopPage from "./pages/ShopPage";
import ShopDetailsPage from "./pages/ShopDetailsPage";


import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import WishlistPage from "./pages/WishlistPage";
import ContactPage from "./pages/ContactPage";
import HomePageSix from "./pages/HomePageSix";
import LoginPage  from "./pages/LoginPage";
import RegisterPage  from "./pages/RegisterPage";
import ViewProfilePage from "./pages/ViewProfilePage"
import ViewCustomerOrdersPage from "./pages/ViewCustomerOrdersPage"
import BrandModelspage from "./pages/dashboard-pages/ProductsPages/BrandModelsPage";
import ChnagePassword from "./components/ChnagePassword";
import ForgotPassword from "./components/ForgotPassword";
import ThankyouPage from "./pages/ThankYouPage";

import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsAndConditionsPage from "./pages/TermsAndConditionsPage";
import RefundPolicyPage from "./pages/RefundPolicyPage";
import ShippingPolicyPage from "./pages/ShippingPolicyPage";
// import DashboardPage from "./pages/dashboard-pages/MainPage" 


import DashboardPage  from "./pages/dashboard-pages/MainPage";
import AdminPage from "./pages/dashboard-pages/AdminPage"
import TableDataPage from "./pages/dashboard-pages/DataTablePage"
import FormValidationPage from "./pages/dashboard-pages/FormValidationPage"
import AddProductPage from "./pages/dashboard-pages/ProductsPages/AddProductsPages"
import UpdateProductsFormPage from "./pages/dashboard-pages/ProductsPages/UpdateProductsFormPage"
import PartGroupPage from './pages/dashboard-pages/ProductsPages/PartGroupPage'
import BrandModelVariantPage from './pages/dashboard-pages/ProductsPages/BrandModelVariantPage'
import PartCategoryPage from './pages/dashboard-pages/ProductsPages/PartSectionPage'
import PartListPage from './pages/dashboard-pages/ProductsPages/PartsListPage'
import OrdersListPage from "./pages/dashboard-pages/OrdersListPage"
import ProductListDisplayPage from "./pages/dashboard-pages/ProductsPages/ProductListDisplayPage"

import CarBrandsListPage from "./pages/dashboard-pages/ProductsPages/CarBrandsListPage"
import CarModelPages from "./pages/dashboard-pages/ProductsPages/CarModelPages"
import CarVariantListPages from "./pages/dashboard-pages/ProductsPages/CarVariantListPages"
import CarPartCategoryPages from "./pages/dashboard-pages/ProductsPages/carPartCategoryPages"
import CarPartGroupPages from "./pages/dashboard-pages/ProductsPages/carPartGroupPages"
import Enquiryformpages from "./pages/dashboard-pages/Enquiryformpages"

import UnauthorizedPage from "./pages/UnauthorizedPage"
import Commingsoon from "./pages/Commingsoon"
import CustomerListPage from "pages/dashboard-pages/CustomerListPage";
import StaffList from "components/dashboard-components/Users/StaffList";

function App() {
  return (

    <Router>
      <RouteScrollToTop />
 
      <ScrollToTop smooth color="#E8092E" />
      <Routes>
       
        {/* <Route exact path="/" element={<Commingsoon />} /> */}
        <Route exact path="/" element={<HomePageSix />} />
        <Route exact path="/about-us" element={<AboutPage />} />
        <Route exact path="/service" element={<ServicePage />} />
        <Route exact path="/service-details" element={<ServiceDetailsPage />} />

        <Route exact path="/blog" element={<BlogPage />} />
        <Route exact path="/blog-details" element={<BlogDetailsPage />} />

        <Route exact path="/shop" element={<ShopPage />} />
        <Route exact path="/shop-details/:id" element={<ShopDetailsPage />} />
        <Route exact path="/cart" element={<CartPage />} />
        <Route exact path="/checkout" element={<CheckoutPage />} />
        <Route exact path="/wishlist" element={<WishlistPage />} />
        <Route exact path="/contact-us" element={<ContactPage />} />
        <Route exact path="/Login" element={<LoginPage />} />
        <Route exact path="/Register" element={<RegisterPage />} />
        <Route exact path="/forgot-password" element={<ForgotPassword />} />
        {/* <Route exact path="/Dashboard2" element={<DashboardPage />} /> */}
        <Route exact path="/brand-models/:id" element={<BrandModelspage />} />
        <Route exact path="/models-variant/:id" element={<BrandModelVariantPage />} />
        <Route exact path="/part-category/:id" element={<PartCategoryPage />} />
        <Route exact path="/part-group/:id" element={<PartGroupPage />} />
        <Route exact path="/part-list/:id" element={<PartListPage />} />

        <Route exact path="/shop/:id" element={<ShopPage />} />
        {/* <Route exact path="/shop-details" element={<ShopDetailsPage />} /> */}

        <Route exact path="/thank-you" element={<ThankyouPage />} />
        
        <Route exact path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route exact path="/terms-and-conditions" element={<TermsAndConditionsPage />} />
        <Route exact path="/shipping-policy" element={<ShippingPolicyPage />} />
        <Route exact path="/refund-policy" element={<RefundPolicyPage />} />
        
       



         {/* Private Route for Dashboard2 */}
        <Route element={<PrivateRoute requiredRoles={["admin","staff"]} />}>
          <Route path="/Dashboard" element={<AdminPage />} />
          <Route path="/Tables" element={<TableDataPage />} />
          <Route path="/OrderList" element={<OrdersListPage />} />
          <Route path="/form" element={<FormValidationPage />} />
          <Route path="/Add-products" element={<AddProductPage />} />
          <Route path="/update-products/:id" element={<UpdateProductsFormPage />} />
          <Route path="/products-list" element={<ProductListDisplayPage />} />
          
          <Route path="/car-barnds" element={<CarBrandsListPage />} />
          <Route path="/car-models" element={<CarModelPages />} />
          <Route path="/car-variants" element={<CarVariantListPages />} />
          <Route path="/car-category" element={<CarPartCategoryPages />} />
          <Route path="/car-group-part" element={<CarPartGroupPages />} />

          <Route path="/enquiry-queries" element={<Enquiryformpages />} />
          <Route path="/customers-list" element={<CustomerListPage />} />
          <Route path="/staff-list" element={<StaffList />} />
        </Route>

        <Route element={<PrivateRoute requiredRoles={["customer"]} />}>
          <Route path="/orders" element={<ViewCustomerOrdersPage />} />
        </Route>

         <Route element={<PrivateRoute requiredRoles={["admin","customer","staff"]} />}>
          <Route path="/view-profile" element={<ViewProfilePage />} />
          <Route path="/change-password" element={<ChnagePassword />} />
        </Route>


        <Route path="/unauthorized" element={<UnauthorizedPage />} />


      </Routes>
    </Router>

  );
}

export default App;
