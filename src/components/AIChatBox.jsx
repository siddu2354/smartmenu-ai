import { useRef, useState } from "react";

function AIChatBox({ menuData, onViewDetails }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(
    "👋 Hi! I’m SmartMenu AI. Tell me what you feel like eating, and I’ll help you choose something delicious!"
  );

  const [recommendedDishes, setRecommendedDishes] = useState([]);
  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef(null);

  // ==============================
  // SPICE LEVEL
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

  const findRecommendations = (query) => {
    const lowerQuestion = query.toLowerCase();

    let results = [...menuData];

    // VEG
    if (
      lowerQuestion.includes("veg") ||
      lowerQuestion.includes("vegetarian")
    ) {
      results = results.filter(
        (dish) => dish.dietaryType === "Veg"
      );
    }

    // NON VEG
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

    // RICE / BIRYANI
    if (
      lowerQuestion.includes("rice") ||
      lowerQuestion.includes("biryani")
    ) {
      const riceItems = results.filter(
        (dish) =>
          dish.name.toLowerCase().includes("rice") ||
          dish.name.toLowerCase().includes("biryani")
      );

      if (riceItems.length > 0) {
        results = riceItems;
      }
    }

    // INDIAN / TRADITIONAL
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

    // DESSERT
    if (
      lowerQuestion.includes("sweet") ||
      lowerQuestion.includes("dessert")
    ) {
      const dessertItems = results.filter(
        (dish) =>
          dish.category === "Dessert" ||
          dish.name.toLowerCase().includes("ice cream") ||
          dish.name.toLowerCase().includes("gulab")
      );

      if (dessertItems.length > 0) {
        results = dessertItems;
      }
    }

    // SPICY
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

    // MILD
    if (
      lowerQuestion.includes("mild") ||
      lowerQuestion.includes("not spicy") ||
      lowerQuestion.includes("less spicy")
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
  // PROCESS AI QUESTION
  // ==============================

  const handleAsk = (customQuestion = null) => {
    const currentQuestion = customQuestion || question;

    if (!currentQuestion.trim()) {
      return;
    }

    const q = currentQuestion.toLowerCase().trim();

    // Find exact dish
    const exactDish = menuData.find((dish) =>
      q.includes(dish.name.toLowerCase())
    );

    // ==============================
    // EXACT DISH
    // ==============================

    if (exactDish) {
      let response = "";

      // INGREDIENTS
      if (
        q.includes("ingredient") ||
        q.includes("ingredients") ||
        q.includes("contains") ||
        q.includes("made of") ||
        q.includes("made from")
      ) {
        response = `🥘 ${exactDish.name} contains ${exactDish.ingredients.join(
          ", "
        )}.`;
      }

      // PRICE
      else if (
        q.includes("price") ||
        q.includes("cost") ||
        q.includes("how much") ||
        q.includes("rate")
      ) {
        response = `💰 ${exactDish.name} costs ${exactDish.price}.`;
      }

      // SPICE
      else if (
        q.includes("spicy") ||
        q.includes("spice") ||
        q.includes("hot")
      ) {
        response = `🌶️ ${exactDish.name} has a ${getSpiceText(
          exactDish.spiceLevel
        )} spice level.`;
      }

      // TASTE
      else if (
        q.includes("taste") ||
        q.includes("flavour") ||
        q.includes("flavor")
      ) {
        response = `😋 ${exactDish.name} tastes ${exactDish.taste.join(
          ", "
        )}.`;
      }

      // GENERAL
      else {
        response = `✨ ${exactDish.name}: ${exactDish.description} It costs ${exactDish.price} and has a ${getSpiceText(
          exactDish.spiceLevel
        )} spice level.`;
      }

      setAnswer(response);
      setRecommendedDishes([exactDish]);
      setQuestion("");

      return;
    }

    // ==============================
    // RECOMMENDATIONS
    // ==============================

    const recommendations = findRecommendations(q);

    if (recommendations.length === 0) {
      setAnswer(
        "🤔 I couldn't find a perfect match. Try asking for traditional Indian food, chicken, vegetarian food, rice items, spicy food, or desserts."
      );

      setRecommendedDishes([]);
      setQuestion("");

      return;
    }

    const dishNames = recommendations
      .map((dish) => dish.name)
      .join(" and ");

    setAnswer(
      `✨ Based on what you're looking for, I recommend ${dishNames}. Please check the recommendations below and view the full details of any dish you like.`
    );

    setRecommendedDishes(recommendations);
    setQuestion("");
  };

  // ==============================
  // STOP LISTENING
  // ==============================

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    setIsListening(false);
  };

  // ==============================
  // VOICE INPUT ONLY
  // ==============================

  const startListening = () => {
    if (isListening) {
      stopListening();
      return;
    }

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

    recognitionRef.current = recognition;

    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-IN";

    let finalTranscript = "";
    let silenceTimer = null;

    recognition.onstart = () => {
      setIsListening(true);
      finalTranscript = "";
    };

    recognition.onresult = (event) => {
      let newFinalText = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        if (event.results[i].isFinal) {
          newFinalText +=
            event.results[i][0].transcript + " ";
        }
      }

      if (newFinalText.trim()) {
        finalTranscript =
          `${finalTranscript} ${newFinalText}`.trim();

        setQuestion(finalTranscript);

        // Give customer time to breathe
        clearTimeout(silenceTimer);

        silenceTimer = setTimeout(() => {
          if (recognitionRef.current) {
            recognitionRef.current.stop();
          }
        }, 2500);
      }
    };

    recognition.onerror = (event) => {
      console.log(
        "Speech recognition error:",
        event.error
      );

      clearTimeout(silenceTimer);
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognition.onend = () => {
      clearTimeout(silenceTimer);

      setIsListening(false);
      recognitionRef.current = null;

      const spokenText = finalTranscript.trim();

      if (spokenText) {
        setQuestion(spokenText);

        // Process as TEXT ONLY
        setTimeout(() => {
          handleAsk(spokenText);
        }, 300);
      }
    };

    try {
      recognition.start();
    } catch (error) {
      console.log(
        "Speech recognition could not start:",
        error
      );

      setIsListening(false);
      recognitionRef.current = null;
    }
  };

  // ==============================
  // VIEW DETAILS
  // ==============================

  const handleViewDetails = (dish) => {
    if (typeof onViewDetails === "function") {
      onViewDetails(dish);
    }
  };

  return (
    <section className="mb-10">

      <div className="rounded-3xl border border-white/40 bg-white/60 p-6 shadow-xl backdrop-blur-xl">

        {/* HEADER */}
        <div className="mb-6">

          <h2 className="text-2xl font-bold text-gray-800">
            ✨ SmartMenu AI
          </h2>

          <p className="mt-1 text-gray-500">
            Tell me what you feel like eating
          </p>

        </div>


        {/* AI ANSWER */}
        <div className="rounded-3xl border border-orange-100 bg-white/70 p-5 shadow-sm backdrop-blur-md">

          <p className="leading-7 text-gray-700">
            {answer}
          </p>

        </div>


        {/* RECOMMENDATIONS */}
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

                  {/* IMAGE */}
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="h-40 w-full object-cover"
                  />


                  {/* INFO */}
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


                    {/* SPICE */}
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
                      onClick={() => handleViewDetails(dish)}
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


        {/* INPUT */}
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


          {/* SPEAK */}
          <button
            onClick={startListening}
            className={`rounded-2xl px-6 py-4 font-semibold transition ${
              isListening
                ? "animate-pulse bg-red-500 text-white"
                : "bg-gray-800 text-white hover:bg-gray-900"
            }`}
          >
            {isListening
              ? "⏹ Stop"
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


        {/* LISTENING STATUS */}
        {isListening && (
          <p className="mt-3 text-center text-sm font-medium text-red-500">
            🎙️ Listening... Speak naturally. I'll wait for you to finish.
          </p>
        )}

      </div>

    </section>
  );
}

export default AIChatBox;