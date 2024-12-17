import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PlotPage from "./pages/PlotPage";
import PrivateRoute from "./components/PrivateRoute";

function App() {
    const [waterMode, setWaterMode] = useState(false);

    const handleWaterClick = () => {
        setWaterMode(true);
        alert("Выберите грядку для полива");
    };

    return (
        <Router>
            <Header onWaterClick={handleWaterClick} />
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Защищённые маршруты */}
                <Route element={<PrivateRoute />}>
                    <Route path="/" element={<PlotPage waterMode={waterMode} onWaterDone={() => setWaterMode(false)} />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;