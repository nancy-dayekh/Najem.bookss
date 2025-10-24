"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";
import Image from "next/image";

export default function Checkout() {
  const [cart, setCart] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    phone: "+961",
    city: "",
  });
  const [shipping, setShipping] = useState({});
  const [selectedCountry, setSelectedCountry] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [colors, setColors] = useState(null); // fetch colors from db

  // Load cart from localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);
  useEffect(() => {
    async function fetchColors() {
      const { data, error } = await supabase
        .from("colors")
        .select("*")
        .order("id");
      if (error) console.error(error);
      else setColors(data?.[0] || null); // take first color row
    }
    fetchColors();
  }, []);
  const mainColor = colors || {
    button_hex: "", // fallback pink
    button_hover_color: "#f472b6",
    text_color: "#fff",
  };
  // Fetch shipping info from Supabase
  useEffect(() => {
    const fetchShipping = async () => {
      const { data, error } = await supabase
        .from("deliveries")
        .select("*")
        .limit(1)
        .single();

      if (!error && data) setShipping(data);
    };
    fetchShipping();
  }, []);

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCountryChange = (e) => setSelectedCountry(e.target.value);

  const calculateSubtotal = () =>
    cart
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);

  const calculateShipping = () =>
    shipping.salary ? parseFloat(shipping.salary).toFixed(0) : "0";

  const calculateTotal = () =>
    (parseFloat(calculateSubtotal()) + parseFloat(calculateShipping())).toFixed(
      2
    );

  const handleSubmit = async () => {
    // ✅ تحقق من أن جميع الحقول ممتلئة قبل تنفيذ الطلب
    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.address.trim() ||
      !formData.phone.trim() ||
      !formData.city.trim() ||
      !selectedCountry.trim()
    ) {
      setErrorMsg(
        "⚠️ Please fill in all required fields before completing the order."
      );
      setSuccessMsg("");
      return;
    }

    if (cart.length === 0) {
      setErrorMsg("Your cart is empty.");
      return;
    }

    try {
      // 1️⃣ تحقق من المخزون قبل الطلب
      for (let item of cart) {
        const { data: productData, error: fetchError } = await supabase
          .from("books")
          .select("quantity")
          .eq("id", item.id)
          .single();

        if (fetchError) throw fetchError;

        if ((productData.quantity || 0) < item.quantity) {
          throw new Error(
            `Not enough stock for ${item.name}. Available: ${productData.quantity}`
          );
        }
      }

      const subtotal = parseFloat(calculateSubtotal());
      const shippingCost = parseFloat(calculateShipping());
      const total = parseFloat((subtotal + shippingCost).toFixed(2));

      // 2️⃣ تخزين الطلب في جدول checkouts
      const { data: newCheckout, error: checkoutError } = await supabase
        .from("checkouts")
        .insert([
          {
            first_name: formData.firstName,
            last_name: formData.lastName,
            address: formData.address,
            phone: formData.phone,
            city: formData.city,
            region: selectedCountry || "Lebanon",
            delivery_id: shipping.id || 1,
            subtotal,
            total,
          },
        ])
        .select("*")
        .single();

      if (checkoutError) throw checkoutError;

      // 3️⃣ إدراج العناصر في جدول checkout_items
      const itemsData = cart.map((item) => ({
        checkout_id: newCheckout.id,
        book_id: item.id,
        quantity: item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from("checkout_items")
        .insert(itemsData);

      if (itemsError) throw itemsError;

      // 4️⃣ خصم الكمية من المخزون بعد تأكيد الطلب
      for (let item of cart) {
        const { data: productData } = await supabase
          .from("books")
          .select("quantity")
          .eq("id", item.id)
          .single();

        const newQuantity = (productData.quantity || 0) - item.quantity;

        await supabase
          .from("books")
          .update({ quantity: newQuantity })
          .eq("id", item.id);
      }

      // 5️⃣ تحضير رسالة WhatsApp للمتجر
      const shopNumber = "96171407764";
      const customerPhone = formData.phone.replace("+", "").trim();

      let messageForShop = `New order from ${formData.firstName} ${formData.lastName}:%0A`;
      cart.forEach((item) => {
        messageForShop += `• ${item.name} x${item.quantity} = $${(
          item.price * item.quantity
        ).toFixed(2)}%0A`;
      });
      messageForShop += `Total: $${total}%0AAddress: ${formData.address}, ${formData.city}%0ACustomer Phone: ${customerPhone}`;

      const waLinkShop = `https://wa.me/${shopNumber}?text=${messageForShop}`;

      // 6️⃣ رسالة تأكيد للعميل
      let messageForCustomer = `Hello ${formData.firstName},%0AYour order has been received!%0ATotal: $${total}%0AWe will contact you soon for delivery.`;
      const waLinkCustomer = `https://wa.me/${customerPhone}?text=${messageForCustomer}`;

      // فتح الروابط
      window.open(waLinkShop, "_blank");
      setTimeout(() => window.open(waLinkCustomer, "_blank"), 1000);

      setSuccessMsg("✅ Your order has been placed successfully!");
      setErrorMsg("");
      localStorage.removeItem("cart");
      setCart([]);
      setTimeout(() => (window.location.href = "/"), 4000);
    } catch (err) {
      console.error("Checkout error:", err);
      setErrorMsg(err.message || "Failed to place order.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Column: Form */}
        <div className="md:w-2/3 w-full">
          <h2 className="text-xl sm:text-2xl font-bold mb-6">
            Delivery Information
          </h2>

          {/* ✅ رسالة الخطأ */}
          {errorMsg && (
            <p className="mb-4 text-red-600 bg-red-100 px-4 py-2 rounded text-center">
              {errorMsg}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-pink-500"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div className="mb-4">
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-pink-500"
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div className="mb-4">
            <select
              value={selectedCountry}
              onChange={handleCountryChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-pink-500"
            >
              <option value="" disabled>
                Country / Region
              </option>
              <option value="Lebanon">Lebanon</option>
            </select>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Shipping Method</h3>
            <div className="flex justify-between border border-gray-200 rounded px-4 py-2">
              <span>Cash On Delivery</span>
              <span>{calculateShipping()} $</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Payment</h3>
            <input
              type="text"
              value="Cash on Delivery (COD)"
              readOnly
              disabled
              className="w-full border border-gray-300 rounded bg-gray-100 px-4 py-2"
            />
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="md:w-1/3 w-full bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl sm:text-2xl font-bold mb-6">Order Summary</h2>

          {cart.length === 0 ? (
            <p className="text-gray-600 text-sm">Your cart is empty.</p>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center mb-4 border-b border-gray-200 pb-3"
              >
                <Image
                  src={
                    item.image?.startsWith("http")
                      ? item.image
                      : `https://jewkhodpkyqdwknnrxld.supabase.co/storage/v1/object/public/products-images/${item.image}`
                  }
                  alt={item.name || "product image"}
                  width={64}
                  height={64}
                  className="object-cover rounded mr-3"
                />
                <div className="flex justify-between w-full">
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-sm font-bold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))
          )}

          <div className="flex justify-between text-lg font-semibold mb-2">
            <span>Subtotal</span>
            <span>${calculateSubtotal()}</span>
          </div>
          <div className="flex justify-between text-lg font-semibold mb-2">
            <span>Shipping</span>
            <span>${calculateShipping()}</span>
          </div>
          <div className="flex justify-between text-base font-bold mb-4">
            <span>Total</span>
            <span>${calculateTotal()}</span>
          </div>

          <button
            onClick={handleSubmit}
            className=" w-full font-bold py-3 px-12 rounded-md transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 relative overflow-hidden group"
            style={{
              background: `linear-gradient(135deg, ${mainColor.button_hex} 0%, ${mainColor.button_hover_color} 100%)`,
              color: mainColor.button_text_color || mainColor.text_color,
              border: `2px solid ${mainColor.button_hex}`,
            }}
          >
            Complete Order
          </button>

          {successMsg && (
            <p className="mt-4 text-green-600 font-medium text-center">
              {successMsg}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
