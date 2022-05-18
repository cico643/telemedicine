import React from "react";
import ReactDom from "react-dom";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";
import reportWebVitals from "./reportWebVitals";

ReactDom.render(
  <AuthProvider>
    <UserProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </UserProvider>
  </AuthProvider>,
  document.getElementById("root")
);

reportWebVitals();
