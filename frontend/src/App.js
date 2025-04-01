// import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute"; 
import RouteScrollToTop from "./helper/RouteScrollToTop";
import ScrollToTop from "react-scroll-to-top";
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

import ChnagePassword from "./components/ChnagePassword";
import ForgotPassword from "./components/ForgotPassword";
// import DashboardPage from "./pages/dashboard-pages/MainPage" 


import DashboardPage  from "./pages/dashboard-pages/MainPage";
import AdminPage from "./pages/dashboard-pages/AdminPage"
import TableDataPage from "./pages/dashboard-pages/DataTablePage"
import FormValidationPage from "./pages/dashboard-pages/FormValidationPage"


function App() {
  return (
    <Router>
      <RouteScrollToTop />
      <ScrollToTop smooth color="#E8092E" />
      <Routes>
       
        <Route exact path="/" element={<HomePageSix />} />
        <Route exact path="/about" element={<AboutPage />} />
        <Route exact path="/service" element={<ServicePage />} />
        <Route exact path="/service-details" element={<ServiceDetailsPage />} />

        <Route exact path="/blog" element={<BlogPage />} />
        <Route exact path="/blog-details" element={<BlogDetailsPage />} />

        <Route exact path="/shop" element={<ShopPage />} />
        <Route exact path="/shop-details" element={<ShopDetailsPage />} />
        <Route exact path="/cart" element={<CartPage />} />
        <Route exact path="/checkout" element={<CheckoutPage />} />
        <Route exact path="/wishlist" element={<WishlistPage />} />
        <Route exact path="/contact" element={<ContactPage />} />
        <Route exact path="/Login" element={<LoginPage />} />
        <Route exact path="/Register" element={<RegisterPage />} />
        <Route exact path="/forgot-password" element={<ForgotPassword />} />
        <Route exact path="/Dashboard" element={<DashboardPage />} />
         {/* Private Route for Dashboard2 */}
    
      
        <Route element={<PrivateRoute />}>
          <Route exact path="/Dashboard2" element={<AdminPage />} />
          <Route exact path="/Tables" element={<TableDataPage />} />
          <Route exact path="/Form" element={<FormValidationPage />} /> 
          <Route exact path="/view-profile" element={<ViewProfilePage />} />
          <Route exact path="/change-password" element={<ChnagePassword />} />
          
        </Route>
        


      </Routes>
    </Router>
  );
}

export default App;
