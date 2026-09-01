import { useEffect, useState } from "react";

function MenuCard({ dish, onAddToCart, openDetailsDish, onDetailsOpened }) {
  const [showAI, setShowAI] = useState(false);

  // Open details when AI recommendation sends this dish
  useEffect(() => {
    if (openDetailsDish && openDetailsDish.id === dish.id) {
      setShowAI(true);

      if (onDetailsOpened) {
        onDetailsOpened();
      }
    }
  }, [openDetailsDish, dish.id, onDetailsOpened]);

  const getSpiceText = () => {
    if (dish.spiceLevel === 0) return "😌 Not Spicy";
    if (dish.spiceLevel <= 2) return "🌶️ Mild";
    if (dish.spiceLevel === 3) return "🌶️🌶️ Medium";
    return "🌶️🌶️🌶️ Spicy";
  };

  return (
    <>
      {/* ================= FOOD CARD ================= */}
      <div className="overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

        {/* Image */}
        <div className="relative h-56 overflow-hidden bg-gray-100">
          <img
            src={dish.image}
            alt={dish.name}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          />

          <div className="absolute left-3 top-3">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                dish.dietaryType === "Veg"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {dish.dietaryType === "Veg" ? "🟢 Veg" : "🔴 Non-Veg"}
            </span>
          </div>

          <div className="absolute right-3 top-3 rounded-full bg-white px-3 py-1 font-bold text-orange-600 shadow">
            {dish.price}
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-xl font-bold text-gray-800">
            {dish.name}
          </h3>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            {dish.description}
          </p>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">
              Spice Level
            </span>

            <span className="text-sm">
              {getSpiceText()}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-gray-500">
              Cooking
            </span>

            <span className="font-medium text-gray-700">
              {dish.cookingStyle}
            </span>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              onClick={() => setShowAI(true)}
              className="rounded-xl bg-orange-500 py-3 font-semibold text-white shadow-sm transition hover:bg-orange-600"
            >
              ✨ Ask AI
            </button>

            <button
              onClick={() => onAddToCart(dish)}
              className="rounded-xl border border-orange-200 bg-orange-50 py-3 font-semibold text-orange-600 transition hover:bg-orange-100"
            >
              🛒 Add to Order
            </button>
          </div>
        </div>
      </div>

      {/* ================= DETAILS POPUP ================= */}
      {showAI && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">

          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white shadow-2xl">

            {/* Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-5 text-white">

              <div className="flex items-center justify-between">

                <div>
                  <h2 className="text-xl font-bold">
                    ✨ SmartMenu AI
                  </h2>

                  <p className="text-sm text-orange-100">
                    Dish Information
                  </p>
                </div>

                <button
                  onClick={() => setShowAI(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-2xl transition hover:bg-white/30"
                >
                  ×
                </button>

              </div>
            </div>

            {/* Image */}
            <div className="h-56 overflow-hidden">
              <img
                src={dish.image}
                alt={dish.name}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Information */}
            <div className="p-6">

              <div className="flex items-start justify-between gap-4">

                <h2 className="text-2xl font-bold text-gray-800">
                  {dish.name}
                </h2>

                <span className="shrink-0 rounded-full bg-orange-100 px-4 py-2 font-bold text-orange-600">
                  {dish.price}
                </span>

              </div>

              <p className="mt-3 leading-6 text-gray-500">
                {dish.description}
              </p>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">

                <div className="rounded-2xl bg-green-50 p-4">
                  <p className="text-xs uppercase text-gray-500">
                    Type
                  </p>

                  <p className="mt-1 font-semibold text-gray-800">
                    {dish.dietaryType === "Veg"
                      ? "🥬 Vegetarian"
                      : "🍗 Non-Vegetarian"}
                  </p>
                </div>

                <div className="rounded-2xl bg-orange-50 p-4">
                  <p className="text-xs uppercase text-gray-500">
                    Spice
                  </p>

                  <p className="mt-1 font-semibold text-gray-800">
                    {getSpiceText()}
                  </p>
                </div>

              </div>

              {/* Ingredients */}
              <div className="mt-6">

                <h3 className="font-bold text-gray-800">
                  🥘 Ingredients
                </h3>

                <div className="mt-3 flex flex-wrap gap-2">
                  {dish.ingredients.map((ingredient, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-gray-100 px-3 py-2 text-sm text-gray-700"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>

              </div>

              {/* Taste */}
              <div className="mt-6">

                <h3 className="font-bold text-gray-800">
                  😋 Taste
                </h3>

                <p className="mt-2 text-gray-600">
                  {dish.taste.join(", ")}
                </p>

              </div>

              {/* Cooking */}
              <div className="mt-6 rounded-2xl bg-amber-50 p-4">

                <p className="text-sm text-gray-500">
                  🍳 Cooking Style
                </p>

                <p className="mt-1 font-bold text-gray-800">
                  {dish.cookingStyle}
                </p>

              </div>

              {/* Add directly from details */}
              <button
                onClick={() => {
                  onAddToCart(dish);
                  setShowAI(false);
                }}
                className="mt-6 w-full rounded-xl border border-orange-200 bg-orange-50 py-3 font-bold text-orange-600 transition hover:bg-orange-100"
              >
                🛒 Add to Order
              </button>

              <button
                onClick={() => setShowAI(false)}
                className="mt-3 w-full rounded-xl bg-orange-500 py-3 font-bold text-white transition hover:bg-orange-600"
              >
                Done
              </button>

            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MenuCard;