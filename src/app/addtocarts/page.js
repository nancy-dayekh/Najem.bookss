"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";
import Image from "next/image";

export default function ShoppingCart() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);

  // Load cart from localStorage
  useEffect(() => {
    if (!isClient) return;
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartWithQuantities = storedCart.map((item) => ({
      ...item,
      quantity: item.quantity || 1,
    }));
    setCart(cartWithQuantities);
  }, [isClient]);

  // Save cart to localStorage
  useEffect(() => {
    if (isClient) localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart, isClient]);

  // Fetch latest quantities from Supabase
  const fetchQuantities = async () => {
    const newQuantities = {};
    await Promise.all(
      cart.map(async (item) => {
        try {
          const { data, error } = await supabase
            .from("books")
            .select("quantity")
            .eq("id", item.id)
            .single();
          if (error) throw error;
          newQuantities[item.id] = data?.quantity || 1;
        } catch (err) {
          console.error("Error fetching product quantity:", err);
          newQuantities[item.id] = 1;
        }
      })
    );
    setQuantities(newQuantities);
  };

  useEffect(() => {
    if (cart.length > 0 && isClient) fetchQuantities();
  }, [cart, isClient]);

  const handleBackToShop = () => router.push("/products");
  const handleCheckouts = () => router.push("/checkouts");

  const handleIncrease = (itemId) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === itemId && item.quantity < (quantities[itemId] || 1)
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const handleDecrease = (itemId) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === itemId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const handleRemoveItem = (itemId) => {
    setCart(cart.filter((item) => item.id !== itemId));
    setDialogOpen(false);
  };

  const calculateTotalPrice = () =>
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

  return (
    <div className="p-4 sm:p-6 flex flex-col items-center">
      <div className="w-full max-w-5xl pt-4">
        <h2 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">
          Shopping Cart
        </h2>
        <p className="text-gray-500 mb-4 text-xs sm:text-sm">
          {cart.length} items
        </p>

        {cart.map((item) => (
          <div
            key={item.id}
            className="flex flex-row items-center bg-white rounded-2xl shadow-lg p-3 sm:p-4 mb-4 relative"
          >
            <Image
              src={
                item.image?.startsWith("http")
                  ? item.image
                  : `https://jewkhodpkyqdwknnrxld.supabase.co/storage/v1/object/public/products-images/${item.image}`
              }
              alt={item.name || "product image"}
              className="w-[75px] h-[75px] sm:w-[100px] sm:h-[100px] rounded-xl object-cover"
              width={100}
              height={100}
              unoptimized
            />

            <div className="ml-3 sm:ml-6 flex-1">
              <p className="text-sm sm:text-lg font-semibold">{item.name}</p>
              <p className="text-gray-700 text-xs sm:text-sm mt-1">
                Price: ${(item.price * item.quantity).toFixed(2)}
              </p>
              <p className="text-gray-700 text-xs sm:text-sm">Size: {item.size}</p>

              <div className="flex items-center space-x-2 sm:space-x-4 mt-2 sm:mt-3">
                <button
                  onClick={() => handleDecrease(item.id)}
                  disabled={item.quantity <= 1}
                  className={`border rounded-full px-2 py-1 sm:px-3 sm:py-1 text-base ${
                    item.quantity <= 1
                      ? "text-gray-300 border-gray-300 cursor-not-allowed"
                      : "text-[#E1E6FE] border-[#E1E6FE] hover:bg-[#E1E6FE] hover:text-black transition"
                  }`}
                >
                  −
                </button>
                <span className="text-sm sm:text-base font-medium">
                  {item.quantity}
                </span>
                <button
                  onClick={() => handleIncrease(item.id)}
                  disabled={
                    quantities[item.id] !== undefined &&
                    item.quantity >= quantities[item.id]
                  }
                  className={`border rounded-full px-2 py-1 sm:px-3 sm:py-1 text-base ${
                    quantities[item.id] !== undefined &&
                    item.quantity >= quantities[item.id]
                      ? "text-gray-300 border-gray-300 cursor-not-allowed"
                      : "text-[#E1E6FE] border-[#E1E6FE] hover:bg-[#E1E6FE] hover:text-black transition"
                  }`}
                >
                  +
                </button>
              </div>
            </div>

            <button
              className="absolute right-3 top-3 text-[#E1E6FE] hover:text-[#c8d0fb] text-lg sm:text-xl"
              onClick={() => {
                setItemToDelete(item.id);
                setDialogOpen(true);
              }}
            >
              🗑️
            </button>
          </div>
        ))}

        <div className="flex justify-between items-center mt-8 text-sm sm:text-lg">
          <h3 className="font-bold text-gray-700">
            Total: ${calculateTotalPrice()}
          </h3>
          <button
            onClick={handleCheckouts}
            className="bg-[#E1E6FE] hover:bg-[#c8d0fb] text-black font-bold py-2 px-4 sm:px-6 rounded-xl"
          >
            Checkout
          </button>
        </div>

        <div className="mt-4">
          <button
            onClick={handleBackToShop}
            className="border border-[#E1E6FE] text-black hover:bg-[#E1E6FE] hover:text-black font-bold py-2 px-4 sm:px-6 rounded-xl text-xs sm:text-sm"
          >
            Back to Shop
          </button>
        </div>
      </div>

      {dialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white rounded-lg shadow-xl p-5 w-11/12 max-w-sm">
            <h3 className="text-base sm:text-lg font-semibold mb-2">
              Remove Item?
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-4">
              Are you sure you want to remove this item from your cart?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-3 py-1 text-gray-500 hover:text-black text-sm"
                onClick={() => {
                  setDialogOpen(false);
                  setItemToDelete(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                onClick={() => handleRemoveItem(itemToDelete)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
