import React, { useState } from "react";
import AppRouter from "./Router";
import { authService } from "../firebase";

function App() {
  const [loggedIn, setLoggedIn] = useState(authService.currentUser);
  return (
    <>
      <AppRouter loggedIn={loggedIn} />
      <footer>&copy; nolEter {new Date().getFullYear()}</footer>
    </>
  );
}

export default App;
