"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import AllProduct from "../product/product";
import { supabase } from "../../../../lib/supabaseClient";

function chunkArray(arr, size) {
  const chunked = [];
  for (let i = 0; i < arr.length; i += size) {
    chunked.push(arr.slice(i, i + size));
  }
  return chunked;
}

export default function DetailsProducts() {
  const params = useParams();
  const id = params.productsid;

  const [product, setProduct] = useState(null);
  const [multImages, setMultImages] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!id) return;

    // Fetch single product
    supabase
      .from("add_products")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (error) console.error(error);
        else {
          setProduct(data);
          setQuantity(1);

          // Correctly set main image URL
          setMainImage(
            data.image
              ? data.image.startsWith("http")
                ? data.image
                : supabase.storage.from("products-images").getPublicUrl(data.image).publicUrl
              : null
          );

          const sizes = (data.size?.split(" ") || []).filter((s) => s.trim() !== "");
          setSelectedSize(sizes[0] || "");
        }
      });

    // Fetch multiple images
    supabase
      .from("multiimages")
      .select("*")
      .eq("products_id", id)
      .then(({ data, error }) => {
        if (error) console.error(error);
        else setMultImages(data || []);
      });

    // Fetch all products for recommendation
    supabase
      .from("add_products")
      .select("*")
      .order("id", { ascending: true })
      .then(({ data }) => setProducts(data || []));

    // Load cart from localStorage
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, [id]);

  const handleIncrease = () => {
    if (quantity < (product?.quantity || 1)) setQuantity(quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleAddToCart = () => {
    const updatedCart = [...cart];
    const existingIndex = updatedCart.findIndex(
      (item) => item.id === product.id && item.size === selectedSize
    );

    if (existingIndex !== -1) {
      updatedCart[existingIndex].quantity += quantity;
    } else {
      updatedCart.push({
        id: product.id,
        name: product.name,
        quantity,
        price: product.price,
        image: product.image,
        size: selectedSize,
      });
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
    setAlertOpen(true);
  };

  if (!product)
    return (
      <div className="flex justify-center items-center h-64 text-gray-500 font-sans">
        Loading product details...
      </div>
    );

  const sizes = (product.size?.split(" ") || []).filter((s) => s.trim() !== "");
  const sizeGroups = chunkArray(sizes, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 font-sans">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Left Section */}
        <div className="flex-1">
          {mainImage && (
            <Image
              src={
                mainImage.startsWith("http")
                  ? mainImage
                  : supabase.storage.from("products-images").getPublicUrl(mainImage).publicUrl
              }
              alt={product.name}
              width={500}
              height={500}
              className="rounded-xl shadow-lg object-cover w-full max-h-[500px]"
            />
          )}
          <div className="flex space-x-4 mt-4 overflow-x-auto">
            {multImages.map((image) => (
              <div
                key={image.id}
                className={`relative h-28 w-28 rounded-lg cursor-pointer transition duration-300 shadow-md ${
                  mainImage?.includes(image.image_path)
                    ? "border-4 border-pink-400 scale-105"
                    : "border-2 border-transparent hover:scale-105"
                }`}
                onClick={() =>
                  setMainImage(
                    image.image_path.startsWith("http")
                      ? image.image_path
                      : supabase.storage.from("products-images").getPublicUrl(image.image_path).publicUrl
                  )
                }
              >
                <Image
                  src={
                    image.image_path.startsWith("http")
                      ? image.image_path
                      : supabase.storage.from("products-images").getPublicUrl(image.image_path).publicUrl
                  }
                  alt={product.name}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-lg mb-4 Ancizar_Serif text-gray-800">Price: ${product.price}</p>

            <div className="flex items-center space-x-4 mb-4">
              <span className="text-lg Ancizar_Serif">Quantity:</span>
              <button
                onClick={handleDecrease}
                disabled={quantity <= 1}
                className={`border rounded-full px-3 py-1 text-xl ${
                  quantity <= 1
                    ? "text-gray-400 border-gray-300 cursor-not-allowed"
                    : "text-pink-600 border-pink-600 hover:bg-pink-600 hover:text-white transition"
                }`}
              >
                −
              </button>
              <span className="text-xl font-semibold">{quantity}</span>
              <button
                onClick={handleIncrease}
                disabled={quantity >= product.quantity}
                className={`border rounded-full px-3 py-1 text-xl ${
                  quantity >= product.quantity
                    ? "text-gray-400 border-gray-300 cursor-not-allowed"
                    : "text-pink-600 border-pink-600 hover:bg-pink-600 hover:text-white transition"
                }`}
              >
                +
              </button>
            </div>

            <label className="block text-lg Ancizar_Serif mb-2">Size:</label>
            {sizeGroups.map((group, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                {group.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 py-2 border text-sm font-medium rounded-md w-20 text-center ${
                      selectedSize === size
                        ? "bg-pink-400 text-white border-pink-400"
                        : "bg-white border-gray-300 text-gray-700 hover:bg-pink-50"
                    } transition duration-200 ease-in-out`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            ))}

            <button
              onClick={handleAddToCart}
              disabled={product.quantity === 0}
              className={`
                w-full mt-6
                border-2 border-pink-400 text-pink-400 bg-transparent
                font-semibold py-3 rounded
                hover:bg-pink-400 hover:text-white
                transition duration-300
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              {product.quantity === 0 ? "Out of Stock" : "Add to Cart"}
            </button>

            <label className="block text-lg font-semibold mt-10 mb-2">
              Description:
            </label>
            <p className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
              {product.description || "No description available."}
            </p>
          </div>
        </div>
      </div>

      <h2 className="uppercase text-black mt-24 mb-8 ml-2 font-semibold text-lg tracking-wide">
        You may be interested in
      </h2>

      <div className="flex justify-center ml-2">
        <AllProduct products={products} />
      </div>

      {alertOpen && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg z-50">
          Item added to cart successfully!
          <button
            onClick={() => setAlertOpen(false)}
            className="ml-4 font-bold hover:text-green-200"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
