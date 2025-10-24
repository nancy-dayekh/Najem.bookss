"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import AllProduct from "../book/product";
import { supabase } from "../../../../lib/supabaseClient";

export default function DetailsProducts() {
  const params = useParams();
  const id = params.productsid;

  const [product, setProduct] = useState(null);
  const [multImages, setMultImages] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [colors, setColors] = useState({
    hex: "#ffffff",
    text_color: "#111827",
    hover_color: "#2563eb",
    button_hex: "#2563eb",
    button_text_color: "#ffffff",
    button_hover_color: "#1e40af",
  });

  // Fetch theme colors
  useEffect(() => {
    async function fetchColors() {
      const { data } = await supabase
        .from("colors")
        .select("*")
        .order("id")
        .limit(1)
        .single();
      if (data) {
        setColors({
          hex: data.hex || "#ffffff",
          text_color: data.text_color || "#111827",
          hover_color: data.hover_color || "#2563eb",
          button_hex: data.button_hex || "#2563eb",
          button_text_color: data.button_text_color || "#ffffff",
          button_hover_color: data.button_hover_color || "#1e40af",
        });
      }
    }
    fetchColors();
  }, []);

  // Fetch product, images, and all products
  useEffect(() => {
    if (!id) return;

    async function fetchProduct() {
      const { data } = await supabase
        .from("books")
        .select("*")
        .eq("id", id)
        .single();
      if (data) {
        setProduct(data);
        const mainImgUrl = data.image?.startsWith("http")
          ? data.image
          : supabase.storage.from("products-images").getPublicUrl(data.image)
              .publicUrl;
        setMainImage(mainImgUrl);
      }
    }

    async function fetchImages() {
      const { data } = await supabase
        .from("multimagebook")
        .select("*")
        .eq("products_id", id);
      if (data) setMultImages(data);
    }

    async function fetchAllProducts() {
      const { data } = await supabase
        .from("books")
        .select("*")
        .order("id", { ascending: true });
      setProducts(data || []);
    }

    fetchProduct();
    fetchImages();
    fetchAllProducts();

    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, [id]);

  // Add to cart (without alerts)
  const handleAddToCart = () => {
    if (!product || product.quantity === 0 || quantity > product.quantity)
      return;

    const updatedCart = [...cart];
    const index = updatedCart.findIndex((item) => item.id === product.id);

    if (index !== -1) {
      updatedCart[index].quantity += quantity;
    } else {
      updatedCart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: mainImage,
        quantity: quantity,
      });
    }

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setQuantity(1);
  };

  const increaseQuantity = () => {
    if (product && quantity < product.quantity) setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  if (!product)
    return (
      <div className="flex justify-center items-center h-64 text-gray-500 font-sans">
        Loading product details...
      </div>
    );

  return (
    <div
      className="max-w-6xl mx-auto px-4 py-6 font-sans"
      style={{ backgroundColor: colors.hex }}
    >
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Images */}
        <div className="w-full lg:w-1/2">
          <div className="rounded-2xl overflow-hidden">
            {mainImage && (
              <Image
                src={mainImage}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-[500px] object-contain hover:scale-105 transition-transform duration-300"
              />
            )}
          </div>
          <div className="flex gap-3 mt-2 overflow-x-auto pb-2">
            {[{ image_path: product.image }, ...multImages].map((img, idx) => {
              const imgUrl = img.image_path?.startsWith("http")
                ? img.image_path
                : supabase.storage
                    .from("products-images")
                    .getPublicUrl(img.image_path).publicUrl;
              return (
                <div
                  key={idx}
                  onClick={() => setMainImage(imgUrl)}
                  className={`relative h-20 w-20 flex-shrink-0 cursor-pointer transition-all duration-300 rounded-xl ${
                    mainImage === imgUrl
                      ? `ring-2 ring-[${colors.hover_color}] scale-105`
                      : "hover:scale-105 opacity-90 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={imgUrl}
                    alt={product.name}
                    fill
                    className="object-contain rounded-xl"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Product Details */}
        <div className="w-full lg:w-1/2 flex flex-col justify-between">
          <div>
            <h1
              className="text-3xl font-bold mb-2"
              style={{ color: colors.text_color }}
            >
              {product.name}
            </h1>
            <p
              className="text-lg font-semibold mb-3"
              style={{ color: colors.text_color }}
            >
              ${product.price.toFixed(2)}
            </p>

            {product.quantity > 0 ? (
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="text-sm font-medium"
                  style={{ color: colors.text_color }}
                >
                  Quantity:
                </span>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    className="px-3 py-1 text-lg font-medium hover:bg-gray-100 disabled:opacity-40"
                  >
                    −
                  </button>
                  <span className="px-4 text-lg">{quantity}</span>
                  <button
                    onClick={increaseQuantity}
                    disabled={quantity >= product.quantity}
                    className="px-3 py-1 text-lg font-medium hover:bg-gray-100 disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  {product.quantity} left in stock
                </span>
              </div>
            ) : (
              <p className="text-sm text-red-600 font-semibold">Out of Stock</p>
            )}

            {/* 💎 Add to Cart Button - Elegant Gradient Design */}
            <button
              onClick={handleAddToCart}
              disabled={product.quantity === 0}
              className="font-bold py-3 px-12 rounded-md transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 relative overflow-hidden group w-full text-lg"
              style={{
                background:
                  product.quantity === 0
                    ? "#ccc"
                    : `linear-gradient(135deg, ${colors.button_hex} 0%, ${colors.button_hover_color} 100%)`,
                color: colors.button_text_color,
                border: `2px solid ${colors.button_hex}`,
              }}
            >
              <span
                className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-25 transition-all duration-300 rounded-md"
                style={{ mixBlendMode: "overlay" }}
              ></span>
              <span className="relative">
                {product.quantity === 0 ? "Out of Stock" : "Add to Cart"}
              </span>
            </button>

            <div className="mt-4 border-t border-gray-200 pt-4">
              <h2
                className="text-lg font-semibold mb-2"
                style={{ color: colors.text_color }}
              >
                Description
              </h2>
              <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
                {product.description || "No description available."}
              </p>
            </div>
          </div>
        </div>
      </div>

      <h2
        className="uppercase mt-16 mb-4 ml-2 font-semibold text-lg tracking-wide"
        style={{ color: colors.text_color }}
      >
        You may also like
      </h2>
      <div className="flex justify-center">
        <AllProduct products={products} />
      </div>
    </div>
  );
}
