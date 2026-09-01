import { useState } from "react";
import menuData from "../data/menuData";
import MenuCard from "../components/MenuCard";
import AIChatBox from "../components/AIChatBox";

function Menu() {
  // Search
  const [searchTerm, setSearchTerm] = useState("");

  // Category
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Cart
  const [cart, setCart] = useState([]);

  // Cart Popup
  const [showCart, setShowCart] = useState(false);

  // Add dish to cart
  const handleAddToCart = (dish) => {
    setCart((currentCart) => {
      const existingDish = currentCart.find(
        (item) => item.id === dish.id
      );

      // Dish already exists → increase quantity
      if (existingDish) {
        return currentCart.map((item) =>
          item.id === dish.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      // New dish
      return [
        ...currentCart,
        {
          ...dish,
          quantity: 1,
        },
      ];
    });
  };

  // Increase quantity
  const increaseQuantity = (dishId) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === dishId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  // Decrease quantity
  const decreaseQuantity = (dishId) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === dishId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Convert ₹299 → 299
  const getPriceNumber = (price) => {
    return Number(
      String(price).replace(/[^\d.]/g, "")
    );
  };

  // Total price
  const totalAmount = cart.reduce(
    (total, item) =>
      total + getPriceNumber(item.price) * item.quantity,
    0
  );

  // Total number of dishes
  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Filter menu
  const filteredMenu = menuData.filter((dish) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      dish.name.toLowerCase().includes(search) ||
      dish.description.toLowerCase().includes(search);

    let matchesCategory = true;

    if (selectedCategory === "Veg") {
      matchesCategory = dish.dietaryType === "Veg";
    }

    if (selectedCategory === "Non-Veg") {
      matchesCategory = dish.dietaryType === "Non-Veg";
    }

    if (selectedCategory === "Dessert") {
      matchesCategory =
        dish.category === "Dessert" ||
        dish.name.toLowerCase().includes("ice cream") ||
        dish.name.toLowerCase().includes("gulab");
    }

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">

      {/* ================= HEADER ================= */}

      <header className="px-6 py-14 text-center">

        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-600">
          Welcome to
        </p>

        <h1 className="mt-3 text-4xl font-extrabold text-gray-800 md:text-6xl">
          VSNS Grand Restaurant 🍽️
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-gray-600 md:text-lg">
          Explore our delicious menu and discover your favorite dishes.
        </p>

      </header>


      {/* ================= MAIN ================= */}

      <main className="mx-auto max-w-7xl px-6 pb-16">

        {/* AI CHAT */}
        <AIChatBox menuData={menuData} />


        {/* MENU TITLE */}

        <div className="mb-8">

          <h2 className="text-3xl font-bold text-gray-800">
            Our Menu
          </h2>

          <p className="mt-2 text-gray-500">
            Delicious dishes prepared with care ❤️
          </p>

        </div>


        {/* SEARCH */}

        <div className="mb-5">

          <input
            type="text"
            placeholder="🔍 Search for your favorite dish..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
            className="w-full rounded-2xl border border-orange-200 bg-white px-5 py-4 text-gray-700 outline-none shadow-sm transition focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
          />

        </div>


        {/* CATEGORIES */}

        <div className="mb-10 flex flex-wrap gap-3">

          <button
            onClick={() => setSelectedCategory("All")}
            className={`rounded-full px-5 py-3 font-semibold transition ${
              selectedCategory === "All"
                ? "bg-orange-500 text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-orange-100"
            }`}
          >
            🍽️ All
          </button>


          <button
            onClick={() => setSelectedCategory("Veg")}
            className={`rounded-full px-5 py-3 font-semibold transition ${
              selectedCategory === "Veg"
                ? "bg-green-500 text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-green-50"
            }`}
          >
            🥬 Veg
          </button>


          <button
            onClick={() => setSelectedCategory("Non-Veg")}
            className={`rounded-full px-5 py-3 font-semibold transition ${
              selectedCategory === "Non-Veg"
                ? "bg-red-500 text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-red-50"
            }`}
          >
            🍗 Non-Veg
          </button>


          <button
            onClick={() => setSelectedCategory("Dessert")}
            className={`rounded-full px-5 py-3 font-semibold transition ${
              selectedCategory === "Dessert"
                ? "bg-pink-500 text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-pink-50"
            }`}
          >
            🍰 Dessert
          </button>

        </div>


        {/* FOOD CARDS */}

        {filteredMenu.length > 0 ? (

          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">

            {filteredMenu.map((dish) => (
              <MenuCard
                key={dish.id}
                dish={dish}
                onAddToCart={handleAddToCart}
              />
            ))}

          </div>

        ) : (

          <div className="rounded-3xl bg-white p-10 text-center shadow-md">

            <p className="text-xl font-semibold text-gray-700">
              😔 No dishes found
            </p>

            <p className="mt-2 text-gray-500">
              Try searching for another dish.
            </p>

          </div>

        )}

      </main>


      {/* ================= FLOATING CART ================= */}

      <button
        onClick={() => setShowCart(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-3 rounded-full bg-orange-500 px-6 py-4 font-bold text-white shadow-xl transition hover:scale-105 hover:bg-orange-600"
      >
        🛒

        <span>
          Order
        </span>

        {totalItems > 0 && (
          <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-white px-2 text-sm font-bold text-orange-600">
            {totalItems}
          </span>
        )}

      </button>


      {/* ================= ORDER POPUP ================= */}

      {showCart && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">

          {/* GLASS CART */}

          <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/60 bg-gradient-to-br from-orange-50/95 via-white/90 to-amber-50/95 p-6 shadow-2xl backdrop-blur-xl">

            {/* HEADER */}

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-2xl font-bold text-gray-800">
                  🛒 Your Order
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Review your selected dishes
                </p>

              </div>


              <button
                onClick={() => setShowCart(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70 text-2xl text-gray-700 shadow-sm transition hover:bg-white"
              >
                ×
              </button>

            </div>


            {/* EMPTY CART */}

            {cart.length === 0 ? (

              <div className="py-16 text-center">

                <div className="text-5xl">
                  🍽️
                </div>

                <p className="mt-5 text-lg font-semibold text-gray-700">
                  Your order is empty
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  Add your favorite dishes to get started.
                </p>

              </div>

            ) : (

              <>
                {/* CART ITEMS */}

                <div className="mt-6 space-y-4">

                  {cart.map((item) => (

                    <div
                      key={item.id}
                      className="rounded-2xl border border-orange-100 bg-white/70 p-4 shadow-sm backdrop-blur-md"
                    >

                      {/* NAME + PRICE */}

                      <div className="flex items-start justify-between gap-4">

                        <div>

                          <h3 className="font-bold text-gray-800">
                            {item.name}
                          </h3>

                          <p className="mt-1 text-sm text-gray-500">
                            {item.price}
                          </p>

                        </div>


                        {/* QUANTITY */}

                        <div className="flex items-center gap-3 rounded-full bg-orange-50 px-2 py-2">

                          <button
                            onClick={() =>
                              decreaseQuantity(item.id)
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-lg font-bold text-orange-600 shadow-sm transition hover:bg-orange-100"
                          >
                            −
                          </button>


                          <span className="min-w-5 text-center font-bold text-gray-800">
                            {item.quantity}
                          </span>


                          <button
                            onClick={() =>
                              increaseQuantity(item.id)
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-lg font-bold text-white shadow-sm transition hover:bg-orange-600"
                          >
                            +
                          </button>

                        </div>

                      </div>

                    </div>

                  ))}

                </div>


                {/* TOTAL */}

                <div className="mt-8 flex items-center justify-between rounded-2xl bg-orange-500 px-6 py-5 text-white shadow-lg">

                  <span className="text-lg font-semibold">
                    Total
                  </span>

                  <span className="text-2xl font-extrabold">
                    ₹{totalAmount}
                  </span>

                </div>

              </>

            )}

          </div>

        </div>

      )}


      {/* FOOTER */}

      <footer className="border-t border-orange-100 bg-white/60 py-8 text-center">

        <p className="text-sm text-gray-500">
          © 2026 VSNS Grand Restaurant • SmartMenu AI
        </p>

      </footer>

    </div>
  );
}

export default Menu;