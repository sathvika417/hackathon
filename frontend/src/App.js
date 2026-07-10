import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "@/App.css";
import { ThemeProvider } from "@/context/ThemeContext";
import NeuralBackground from "@/components/NeuralBackground";
import AmbientOrbs from "@/components/AmbientOrbs";
import Landing from "@/pages/Landing";
import Onboarding from "@/pages/Onboarding";
import Results from "@/pages/Results";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <ThemeProvider>
      <div className="App relative">
        <AmbientOrbs />
        <NeuralBackground />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/analyze" element={<Onboarding />} />
            <Route path="/results" element={<Results />} />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-center" />
      </div>
    </ThemeProvider>
  );
}

export default App;
