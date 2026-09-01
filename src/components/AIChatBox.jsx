import { useState } from "react";

function AIChatBox({ menuData, onViewDetails }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(
    "👋 Hi! I’m SmartMenu AI. Tell me what you feel like eating, and I’ll help you choose something delicious!"
  );

  const [recommendedDishes, setRecommendedDishes] = useState([]);
  const [isListening, setIsListening] = useState(false);

  // ==============================
  // AI SPEAK RESPONSE
  // ==============================
  const speakAnswer = (text) => {
    if (!("speechSynthesis" in window)) {
      alert("Sorry, voice response is not supported in this browser.");
      return;
    }

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);

    speech.rate = 0.95;
    speech.pitch = 1;
    speech.volume = 1;

    window.speechSynthesis.speak(speech);
  };

  // ==============================
  // SPICE TEXT
  // ==============================
  const getSpiceText = (level) => {
    if (level === 0) return "Not Spicy";
    if (level <= 2) return "Mild";
    if (level === 3) return "Medium";
    return "Spicy";
  };

  // ==============================
  // FIND RECOMMENDATIONS
  // ==============================
  const findRecommendations = (q) => {
    const lowerQuestion = q.toLowerCase();

    let results = [...menuData];

    // Veg
    if (
      lowerQuestion.includes("veg") ||
      lowerQuestion.includes("vegetarian")
    ) {
      results = results.filter(
        (dish) => dish.dietaryType === "Veg"
      );
    }

    // Non Veg
    if (
      lowerQuestion.includes("chicken") ||
      lowerQuestion.includes("non veg") ||
      lowerQuestion.includes("non-veg") ||
      lowerQuestion.includes("meat")
    ) {
      results = results.filter(
        (dish) => dish.dietaryType !== "Veg"
      );
    }

    // Rice
    if (
      lowerQuestion.includes("rice") ||
      lowerQuestion.includes("biryani")
    ) {
      const riceItems = results.filter((dish) =>
        dish.name.toLowerCase().includes("rice") ||
        dish.name.toLowerCase().includes("biryani")
      );

      if (riceItems.length > 0) {
        results = riceItems;
      }
    }

    // Indian / Traditional
    if (
      lowerQuestion.includes("indian") ||
      lowerQuestion.includes("traditional")
    ) {
      const indianItems = results.filter(
        (dish) =>
          dish.name.toLowerCase().includes("biryani") ||
          dish.name.toLowerCase().includes("tikka") ||
          dish.name.toLowerCase().includes("naan")
      );

      if (indianItems.length > 0) {
        results = indianItems;
      }
    }

    // Sweet / Dessert
    if (
      lowerQuestion.includes("sweet") ||
      lowerQuestion.includes("dessert")
    ) {
      const sweetItems = results.filter(
        (dish) =>
          dish.category === "Dessert" ||
          dish.name.toLowerCase().includes("ice cream") ||
          dish.name.toLowerCase().includes("gulab")
      );

      if (sweetItems.length > 0) {
        results = sweetItems;
      }
    }

    // Spicy
    if (
      lowerQuestion.includes("spicy") ||
      lowerQuestion.includes("hot")
    ) {
      const spicyItems = results.filter(
        (dish) => dish.spiceLevel >= 3
      );

      if (spicyItems.length > 0) {
        results = spicyItems;
      }
    }

    // Mild
    if (
      lowerQuestion.includes("mild") ||
      lowerQuestion.includes("not spicy")
    ) {
      const mildItems = results.filter(
        (dish) => dish.spiceLevel <= 2
      );

      if (mildItems.length > 0) {
        results = mildItems;
      }
    }

    return results.slice(0, 2);
  };

  // ==============================
  // ASK AI
  // ==============================
  const handleAsk = () => {
    if (!question.trim()) return;

    const q = question.toLowerCase().trim();

    // Stop previous voice
    window.speechSynthesis.cancel();

    // Exact dish search
    const exactDish = menuData.find((dish) =>
      q.includes(dish.name.toLowerCase())
    );

    // ==============================
    // EXACT DISH FOUND
    // ==============================
    if (exactDish) {
      let response = "";

      if (
        q.includes("ingredient") ||
        q.includes("contains")
      ) {
        response = `${exactDish.name} contains ${exactDish.ingredients.join(
          ", "
        )}.`;
      } else if (
        q.includes("price") ||
        q.includes("cost") ||
        q.includes("how much")
      ) {
        response = `${exactDish.name} costs ${exactDish.price}.`;
      } else if (
        q.includes("spicy") ||
        q.includes("spice") ||
        q.includes("hot")
      ) {
        response = `${exactDish.name} has a ${getSpiceText(
          exactDish.spiceLevel
        )} spice level.`;
      } else if (
        q.includes("taste") ||
        q.includes("flavour") ||
        q.includes("flavor")
      ) {
        response = `${exactDish.name} tastes ${exactDish.taste.join(
          ", "
        )}.`;
      } else {
        response = `${exactDish.name} is ${exactDish.description} It costs ${exactDish.price} and has a ${getSpiceText(
          exactDish.spiceLevel
        )} spice level.`;
      }

      setAnswer(response);
      setRecommendedDishes([exactDish]);
      speakAnswer(response);

      setQuestion("");
      return;
    }

    // ==============================
    // AI RECOMMENDATIONS
    // ==============================
    const recommendations = findRecommendations(q);

    if (recommendations.length === 0) {
      const response =
        "I couldn't find a perfect match. Please try asking for something like spicy chicken, vegetarian food, traditional Indian food, rice items, or desserts.";

      setAnswer(response);
      setRecommendedDishes([]);
      speakAnswer(response);

      return;
    }

    const dishNames = recommendations
      .map((dish) => dish.name)
      .join(" and ");

    const response = `Based on what you're looking for, I recommend ${dishNames}. Please check the dish cards below for more details.`;

    setAnswer(response);
    setRecommendedDishes(recommendations);

    speakAnswer(response);

    setQuestion("");
  };

  // ==============================
  // VOICE INPUT
  // ==============================
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Voice recognition is not supported in this browser. Please use Google Chrome."
      );
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-IN";

    let finalTranscript = "";

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      let interimTranscript = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        const transcript =
          event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }

      setQuestion(finalTranscript + interimTranscript);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);

      if (finalTranscript.trim()) {
        setQuestion(finalTranscript.trim());
      }
    };

    recognition.start();
  };

  return (
    <section className="mb-10">

      {/* ================= AI GLASS CARD ================= */}

      <div className="rounded-3xl border border-white/40 bg-white/60 p-6 shadow-xl backdrop-blur-xl">

        {/* HEADER */}

        <div className="mb-6 flex items-center justify-between">

          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              ✨ SmartMenu AI
            </h2>

            <p className="mt-1 text-gray-500">
              Tell me what you feel like eating
            </p>
          </div>

          {/* SPEAK ANSWER BUTTON */}

          <button
            onClick={() => speakAnswer(answer)}
            className="rounded-full bg-orange-100 px-4 py-3 text-lg transition hover:bg-orange-200"
            title="Listen to AI answer"
          >
            🔊
          </button>

        </div>

        {/* ================= ANSWER ================= */}

        <div className="rounded-3xl border border-orange-100 bg-white/70 p-5 shadow-sm backdrop-blur-md">

          <p className="leading-7 text-gray-700">
            {answer}
          </p>

        </div>

        {/* ================= RECOMMENDATIONS ================= */}

        {recommendedDishes.length > 0 && (

          <div className="mt-6">

            <h3 className="mb-4 text-lg font-bold text-gray-800">
              🍽️ Recommended for You
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">

              {recommendedDishes.map((dish) => (

                <div
                  key={dish.id}
                  className="overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-md"
                >

                  {/* Image */}

                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="h-40 w-full object-cover"
                  />

                  {/* Information */}

                  <div className="p-4">

                    <div className="flex items-start justify-between gap-3">

                      <h4 className="text-lg font-bold text-gray-800">
                        {dish.name}
                      </h4>

                      <span className="whitespace-nowrap font-bold text-orange-600">
                        {dish.price}
                      </span>

                    </div>

                    <p className="mt-2 text-sm text-gray-500">
                      {dish.description}
                    </p>

                    {/* Spice */}

                    <div className="mt-3 flex items-center justify-between text-sm">

                      <span className="text-gray-500">
                        Spice Level
                      </span>

                      <span className="font-medium text-gray-700">
                        {getSpiceText(dish.spiceLevel)}
                      </span>

                    </div>

                    {/* VIEW DETAILS */}

                    <button
                      onClick={() => onViewDetails(dish)}
                      className="mt-4 w-full rounded-xl bg-orange-500 py-3 font-semibold text-white transition hover:bg-orange-600"
                    >
                      👀 View Full Details
                    </button>

                  </div>

                </div>

              ))}

            </div>

          </div>

        )}

        {/* ================= INPUT ================= */}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">

          <input
            type="text"
            value={question}
            onChange={(e) =>
              setQuestion(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAsk();
              }
            }}
            placeholder="Example: I want traditional Indian chicken rice..."
            className="flex-1 rounded-2xl border border-orange-200 bg-white/80 px-5 py-4 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
          />

          {/* VOICE */}

          <button
            onClick={startListening}
            className={`rounded-2xl px-6 py-4 font-semibold transition ${
              isListening
                ? "animate-pulse bg-red-500 text-white"
                : "bg-gray-800 text-white hover:bg-gray-900"
            }`}
          >
            {isListening
              ? "🎙️ Listening..."
              : "🎤 Speak"}
          </button>

          {/* ASK */}

          <button
            onClick={handleAsk}
            className="rounded-2xl bg-orange-500 px-8 py-4 font-semibold text-white transition hover:bg-orange-600"
          >
            Ask ✨
          </button>

        </div>

      </div>

    </section>
  );
}

export default AIChatBox;