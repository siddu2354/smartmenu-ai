import { useState } from "react";
import Menu from "./pages/Menu";
import WelcomeScreen from "./components/WelcomeScreen";

function App() {
  const [enteredMenu, setEnteredMenu] = useState(false);

  return (
    <>
      {!enteredMenu ? (
        <WelcomeScreen onEnter={() => setEnteredMenu(true)} />
      ) : (
        <Menu />
      )}
    </>
  );
}

export default App;