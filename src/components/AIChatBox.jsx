import { useState, useRef } from "react";

function AIChatBox({ menuData, onViewDetails }) {
  const [question, setQuestion] = useState("");

  const [answer, setAnswer] = useState(
    "👋 Hi! I’m SmartMenu AI. Tell me what you feel like eating, and I’ll help you choose something delicious!"
  );

  const [recommendedDishes, setRecommendedDishes] = useState([]);
  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef(null);

  // ==============================
  // AI VOICE RESPONSE
  // ==============================

  const speakAnswer = (text) => {
    if (!("speechSynthesis" in window)) {
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
  // SPICE LEVEL
  // ==============================

  const getSpiceText = (level) => {
    if (level === 0) return "Not Spicy";
    if (level <= 2) return "Mild";
    if (level === 3) return "Medium";
    return "Spicy";
  };


  // ==============================
  // FIND AI RECOMMENDATIONS
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


    // MILD / NOT SPICY

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
  // ASK AI
  // ==============================

  const handleAsk = (customQuestion = null) => {
    const currentQuestion = customQuestion || question;

    if (!currentQuestion.trim()) return;

    const q = currentQuestion.toLowerCase().trim();

    // Stop previous AI voice

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }


    // FIND EXACT DISH

    const exactDish = menuData.find((dish) =>
      q.includes(dish.name.toLowerCase())
    );


    // ==============================
    // EXACT DISH FOUND
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
        response = `✨ ${exactDish.name} is ${exactDish.description} It costs ${exactDish.price} and has a ${getSpiceText(
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
        "🤔 I couldn't find a perfect match. Try asking for spicy chicken, vegetarian food, traditional Indian food, rice items, or desserts.";

      setAnswer(response);

      setRecommendedDishes([]);

      speakAnswer(response);

      return;
    }


    const dishNames = recommendations
      .map((dish) => dish.name)
      .join(" and ");


    const response = `✨ Based on what you're looking for, I recommend ${dishNames}. Please check the recommendations below and view the full details of any dish you like.`;


    setAnswer(response);

    setRecommendedDishes(recommendations);

    speakAnswer(response);

    setQuestion("");
  };


  // ==============================
  // START VOICE LISTENING
  // ==============================

  const startListening = () => {
    // If already listening, stop it

    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
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

    recognition.interimResults = true;

    recognition.lang = "en-IN";


    let finalTranscript = "";

    let silenceTimer;


    recognition.onstart = () => {
      setIsListening(true);

      finalTranscript = "";
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


      const completeText =
        finalTranscript + interimTranscript;


      setQuestion(completeText);


      // Wait before automatically stopping
      // This prevents answering immediately
      // when the customer pauses for breath

      clearTimeout(silenceTimer);

      silenceTimer = setTimeout(() => {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
      }, 2500);
    };


    recognition.onerror = () => {
      setIsListening(false);

      clearTimeout(silenceTimer);
    };


    recognition.onend = () => {
      setIsListening(false);

      clearTimeout(silenceTimer);

      const spokenText = finalTranscript.trim();

      if (spokenText) {
        setQuestion(spokenText);

        // Automatically ask after voice finishes

        setTimeout(() => {
          handleAsk(spokenText);
        }, 300);
      }
    };


    recognition.start();
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

        <div className="mb-6 flex items-center justify-between">

          <div>

            <h2 className="text-2xl font-bold text-gray-800">
              ✨ SmartMenu AI
            </h2>

            <p className="mt-1 text-gray-500">
              Tell me what you feel like eating
            </p>

          </div>


          {/* SPEAK ANSWER */}

          <button
            onClick={() => speakAnswer(answer)}
            className="rounded-full bg-orange-100 px-4 py-3 text-lg transition hover:bg-orange-200"
            title="Listen to AI answer"
          >
            🔊
          </button>

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


                  {/* DISH INFO */}

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


        {/* INPUT AREA */}

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


          {/* VOICE BUTTON */}

          <button
            onClick={startListening}
            className={`rounded-2xl px-6 py-4 font-semibold transition ${
              isListening
                ? "animate-pulse bg-red-500 text-white"
                : "bg-gray-800 text-white hover:bg-gray-900"
            }`}
          >
            {isListening
              ? "⏹ Stop Speaking"
              : "🎤 Speak"}
          </button>


          {/* ASK BUTTON */}

          <button
            onClick={() => handleAsk()}
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