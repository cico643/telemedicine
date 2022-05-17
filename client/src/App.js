import React from "react";
import { Route, Routes } from "react-router-dom";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import Home from "./pages/Home";
import ProctedUserRoute from "./pages/ProtectedUserRoute";

function App() {
  return (
    <Routes>
      <Route path="/SignIn" element={<SignInPage />}></Route>
      <Route path="/SignUp" element={<SignUpPage />}></Route>
      <Route
        path="/"
        element={
          <ProctedUserRoute>
            <Home />
          </ProctedUserRoute>
        }
      ></Route>
    </Routes>
  );
}

export default App;
