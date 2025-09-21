import React from "react";
import BuyerDashboard from "../components/BuyerDashboard";
import { Product } from "../types";

const BuyerDashboardPage: React.FC<{ products: Product[] }> = ({ products }) => {
  // This component now acts as a pass-through for the filtered products.
  // The actual dashboard logic is in the BuyerDashboard component.
  return <BuyerDashboard products={products} />;
};

export default BuyerDashboardPage;
