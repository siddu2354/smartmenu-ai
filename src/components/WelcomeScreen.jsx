import { useEffect, useRef, useState } from "react";

function WelcomeScreen({ onEnter }) {
  const [loaded, setLoaded] = useState(false);
  const [pointer, setPointer] = useState({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });

  const screenRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  // Get mouse or finger position
  const updatePointer = (x, y) => {
    setPointer({ x, y });
  };

  // Mouse movement
  const handleMouseMove = (e) => {
    updatePointer(e.clientX, e.clientY);
  };

  // Mobile finger movement
  const handleTouchMove = (e) => {
    if (e.touches.length > 0) {
      updatePointer(
        e.touches[0].clientX,
        e.touches[0].clientY
      );
    }
  };

  // Calculate anti-gravity movement
  const getRepelPosition = (
    objectX,
    objectY,
    strength = 70
  ) => {
    const dx = objectX - pointer.x;
    const dy = objectY - pointer.y;

    const distance = Math.sqrt(
      dx * dx + dy * dy
    );

    const safeDistance = Math.max(distance, 1);

    // Only react when pointer is near
    const maxDistance = 400;

    if (safeDistance > maxDistance) {
      return {
        x: 0,
        y: 0,
        rotateX: 0,
        rotateY: 0,
      };
    }

    // Anti-gravity force
    const force =
      (1 - safeDistance / maxDistance) * strength;

    const moveX = (dx / safeDistance) * force;
    const moveY = (dy / safeDistance) * force;

    return {
      x: moveX,
      y: moveY,
      rotateX: -moveY / 3,
      rotateY: moveX / 3,
    };
  };

  // Floating food positions
  const pizza = getRepelPosition(
    window.innerWidth * 0.1,
    window.innerHeight * 0.18,
    110
  );

  const burger = getRepelPosition(
    window.innerWidth * 0.88,
    window.innerHeight * 0.2,
    110
  );

  const chicken = getRepelPosition(
    window.innerWidth * 0.15,
    window.innerHeight * 0.78,
    110
  );

  const cake = getRepelPosition(
    window.innerWidth * 0.85,
    window.innerHeight * 0.78,
    110
  );

  // Center plate reacts to pointer
  const plateX =
    (pointer.x - window.innerWidth / 2) /
    window.innerWidth;

  const plateY =
    (pointer.y - window.innerHeight / 2) /
    window.innerHeight;

  return (
    <div
      ref={screenRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      className="relative min-h-screen overflow-hidden bg-[#120800] text-white"
    >
      {/* ================= BACKGROUND ================= */}

      <div className="absolute inset-0 bg-gradient-to-br from-[#2b0d02] via-[#7a2608] to-[#f97316]" />

      {/* Animated glowing lights */}
      <div className="absolute -left-32 top-10 h-96 w-96 animate-pulse rounded-full bg-orange-400/30 blur-[120px]" />

      <div className="absolute -right-32 bottom-0 h-96 w-96 animate-pulse rounded-full bg-red-500/30 blur-[120px]" />

      <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-300/10 blur-[120px]" />

      {/* ================= 3D FLOATING OBJECTS ================= */}

      <div
        className="absolute inset-0"
        style={{
          perspective: "1200px",
        }}
      >
        {/* PIZZA */}
        <div
          className="absolute left-[8%] top-[15%] text-6xl"
          style={{
            transform: `
              translate3d(${pizza.x}px, ${pizza.y}px, 40px)
              rotateX(${pizza.rotateX}deg)
              rotateY(${pizza.rotateY}deg)
            `,
            transition:
              "transform 0.25s cubic-bezier(0.22, 1, 0.36, 1)",
            animation:
              "floatFood1 6s ease-in-out infinite",
          }}
        >
          🍕
        </div>

        {/* BURGER */}
        <div
          className="absolute right-[10%] top-[18%] text-6xl"
          style={{
            transform: `
              translate3d(${burger.x}px, ${burger.y}px, 60px)
              rotateX(${burger.rotateX}deg)
              rotateY(${burger.rotateY}deg)
            `,
            transition:
              "transform 0.25s cubic-bezier(0.22, 1, 0.36, 1)",
            animation:
              "floatFood2 7s ease-in-out infinite",
          }}
        >
          🍔
        </div>

        {/* CHICKEN */}
        <div
          className="absolute bottom-[18%] left-[12%] text-6xl"
          style={{
            transform: `
              translate3d(${chicken.x}px, ${chicken.y}px, 50px)
              rotateX(${chicken.rotateX}deg)
              rotateY(${chicken.rotateY}deg)
            `,
            transition:
              "transform 0.25s cubic-bezier(0.22, 1, 0.36, 1)",
            animation:
              "floatFood3 8s ease-in-out infinite",
          }}
        >
          🍗
        </div>

        {/* CAKE */}
        <div
          className="absolute bottom-[15%] right-[12%] text-6xl"
          style={{
            transform: `
              translate3d(${cake.x}px, ${cake.y}px, 60px)
              rotateX(${cake.rotateX}deg)
              rotateY(${cake.rotateY}deg)
            `,
            transition:
              "transform 0.25s cubic-bezier(0.22, 1, 0.36, 1)",
            animation:
              "floatFood4 6.5s ease-in-out infinite",
          }}
        >
          🍰
        </div>

        {/* ================= MAIN CONTENT ================= */}

        <div className="relative z-10 flex min-h-screen items-center justify-center px-6">

          <div
            className={`w-full max-w-2xl text-center transition-all duration-1000 ${
              loaded
                ? "translate-y-0 scale-100 opacity-100"
                : "translate-y-20 scale-75 opacity-0"
            }`}
          >
            {/* ================= MAGNETIC 3D PLATE ================= */}

            <div
              className="mx-auto flex h-64 w-64 items-center justify-center"
              style={{
                transformStyle: "preserve-3d",
                transform: `
                  rotateX(${plateY * -18}deg)
                  rotateY(${plateX * 18}deg)
                  translate3d(${plateX * 12}px, ${plateY * 12}px, 0)
                `,
                transition:
                  "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              {/* Outer plate */}
              <div
                className="absolute flex h-56 w-56 items-center justify-center rounded-full bg-gradient-to-br from-white via-orange-100 to-orange-300 shadow-2xl"
                style={{
                  transform:
                    "rotateX(65deg)",
                  boxShadow:
                    "0px 45px 50px rgba(0,0,0,0.55)",
                }}
              >
                {/* Inner plate */}
                <div className="flex h-44 w-44 items-center justify-center rounded-full bg-gradient-to-br from-orange-50 to-orange-200 shadow-inner">
                  <span
                    className="text-7xl"
                    style={{
                      animation:
                        "foodBounce 2.5s ease-in-out infinite",
                    }}
                  >
                    🍛
                  </span>
                </div>
              </div>
            </div>

            {/* ================= TEXT ================= */}

            <p className="mt-6 text-sm font-bold uppercase tracking-[0.5em] text-orange-200">
              Welcome To
            </p>

            <h1
              className="mt-5 text-5xl font-black tracking-tight md:text-7xl"
              style={{
                textShadow:
                  "0px 4px 0px #7c2d12, 0px 8px 20px rgba(0,0,0,0.5)",
              }}
            >
              VSNS GRAND
            </h1>

            <h2 className="mt-2 text-2xl font-semibold tracking-[0.25em] text-orange-100 md:text-3xl">
              RESTAURANT
            </h2>

            <div className="mx-auto mt-7 h-[2px] w-32 bg-gradient-to-r from-transparent via-orange-200 to-transparent" />

            <p className="mx-auto mt-7 max-w-xl text-lg leading-8 text-orange-50/90">
              Experience a smarter way to explore delicious food.
              Discover your perfect dish with{" "}
              <span className="font-bold text-yellow-200">
                SmartMenu AI ✨
              </span>
            </p>

            {/* ================= BUTTON ================= */}

            <button
              onClick={onEnter}
              className="group relative mt-10 overflow-hidden rounded-2xl bg-white px-10 py-5 text-lg font-black text-orange-600 shadow-2xl transition duration-300 hover:scale-110 active:scale-95"
            >
              <span className="relative z-10">
                Explore Our Menu →
              </span>

              <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-yellow-200 via-orange-200 to-yellow-200 transition duration-500 group-hover:translate-x-0" />
            </button>

            <p className="mt-8 text-sm tracking-wide text-orange-100/70">
              ✨ Powered by SmartMenu AI
            </p>
          </div>
        </div>
      </div>

      {/* ================= ANIMATIONS ================= */}

      <style>
        {`
          @keyframes foodBounce {
            0%, 100% {
              transform: translateY(0px) scale(1);
            }

            50% {
              transform: translateY(-12px) scale(1.08);
            }
          }

          @keyframes floatFood1 {
            0%, 100% {
              filter: drop-shadow(0px 10px 12px rgba(0,0,0,0.3));
            }

            50% {
              filter: drop-shadow(0px 20px 20px rgba(0,0,0,0.5));
            }
          }

          @keyframes floatFood2 {
            0%, 100% {
              filter: drop-shadow(0px 10px 12px rgba(0,0,0,0.3));
            }

            50% {
              filter: drop-shadow(0px 20px 20px rgba(0,0,0,0.5));
            }
          }

          @keyframes floatFood3 {
            0%, 100% {
              filter: drop-shadow(0px 10px 12px rgba(0,0,0,0.3));
            }

            50% {
              filter: drop-shadow(0px 20px 20px rgba(0,0,0,0.5));
            }
          }

          @keyframes floatFood4 {
            0%, 100% {
              filter: drop-shadow(0px 10px 12px rgba(0,0,0,0.3));
            }

            50% {
              filter: drop-shadow(0px 20px 20px rgba(0,0,0,0.5));
            }
          }
        `}
      </style>
    </div>
  );
}

export default WelcomeScreen;