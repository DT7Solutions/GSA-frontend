import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../config";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  const fetchCartCount = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return setCartCount(0);

    try {
      const res = await axios.get(`${API_BASE_URL}api/home/cart/count/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartCount(res.data.count);
    } catch (error) {
      console.error("Error fetching cart count:", error);
      setCartCount(0);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, setCartCount, fetchCartCount }}>
      {children}
    </CartContext.Provider>
  );
};
