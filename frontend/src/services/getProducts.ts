import axios from "axios";
import { Product } from "../interfaces/Products.interface";

const API_URL = "http://localhost:3000/api/products";

export const getProducts = async () => {
  try {
    const response = await axios.get<Product[]>(API_URL);
    console.log("Produtos retornados:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};
