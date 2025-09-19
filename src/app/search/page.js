"use client";

import { Box, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import AllProducts from "../products/product/product";
import { supabase } from "../../../lib/supabaseClient"; // 👈 شيلنا .ts

export default function SearchProducts() {
  const [products, setProducts] = useState([]); // 👈 شلنا any[]
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch products (all or filtered)
  async function fetchProducts(name) {
    let query = supabase
      .from("add_products")
      .select("*")
      .order("id", { ascending: true });

    if (name && name.trim() !== "") {
      query = query.ilike("name", `%${name}%`); // case-insensitive LIKE
    }

    const { data, error } = await query;
    if (error) {
      console.error("Error fetching products:", error);
    } else {
      setProducts(data || []);
    }
  }

  // Fetch all products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch filtered products when search term changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      fetchProducts(); // reset to all
    } else {
      fetchProducts(searchTerm);
    }
  }, [searchTerm]);

  return (
    <Box>
      {/* Search Bar */}
      <Box sx={{ textAlign: "center", marginTop: "70px" }}>
        <TextField
          label="Search for products..."
          variant="standard"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
          sx={{
            maxWidth: {
              xs: "90%",
              sm: "70%",
              md: "50%",
              lg: "40%",
            },
            marginTop: "80px",
          }}
        />
      </Box>

      {/* Conditionally render the paragraph */}
      {searchTerm.trim() === "" && (
        <p className="uppercase text-black ml-5 mt-[100px] leading-6 text-base sm:text-sm sm:ml-2 sm:mt-[50px]">
          You may be interested in
        </p>
      )}

      {/* Display Products */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "50px",
        }}
      >
        <AllProducts products={products} />
      </Box>
    </Box>
  );
}
