import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import PlantsPage from "./pages/PlantsPage";
import PlotList from "./components/PlotList";

function App() {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/plants" element={<PlantsPage />} />
                <Route path="/plots" element={<PlotList />} />
            </Routes>
        </Router>
    );
}

export default App;