import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "@/App.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import NeuralBackground from "@/components/NeuralBackground";
import AmbientOrbs from "@/components/AmbientOrbs";
import Landing from "@/pages/Landing";
import Onboarding from "@/pages/Onboarding";
import Results from "@/pages/Results";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
import ForgotPassword from "@/pages/ForgotPassword";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="App relative">
          <AmbientOrbs />
          <NeuralBackground />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/analyze" element={<Onboarding />} />
              <Route path="/results" element={<Results />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </Routes>
          </BrowserRouter>
          <Toaster position="top-center" />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
