import React from "react";
import { Route, Routes } from "react-router-dom";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import Home from "./pages/Home";
import ProctedUserRoute from "./pages/ProtectedUserRoute";
import PrescriptionPage from "./pages/PrescriptionPage";
import LivePage from "./pages/LivePage";

function App() {
  return (
    <Routes>
      <Route path="/SignIn" element={<SignInPage />}></Route>
      <Route path="/SignUp" element={<SignUpPage />}></Route>
      <Route path="/Prescription/:id" element={<PrescriptionPage />}></Route>
      <Route path="/Live/:id" element={<LivePage />}></Route>
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
