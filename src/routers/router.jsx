import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import Home from "./home";
import StockAvailability from "../pages/private/stock-availability/stock";
import ProductAnalysis from "../pages/private/product-analysis/products";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home/product-analysis" replace />} />

        <Route path="/home" element={<Home />}>
          <Route index element={<ProductAnalysis />} />
          <Route path="product-analysis" element={<ProductAnalysis />} />
          <Route path="stock-availability" element={<StockAvailability />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
