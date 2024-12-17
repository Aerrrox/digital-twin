import React, { useState } from "react";
import { Link } from "react-router-dom";
import PlantCatalog from "./PlantCatalog";

function Header({ onWaterClick }) {
    const [showPlants, setShowPlants] = useState(false);

    return (
        <header>
            <nav>
                <Link to="/">Участок</Link>
                <button onClick={() => setShowPlants((prev) => !prev)}>
                    Растения
                </button>
                <button onClick={onWaterClick}>Полить</button>
                <button onClick={() => {
                        localStorage.removeItem("access");
                        localStorage.removeItem("refresh");
                        alert("Вы вышли из системы");
                        window.location.href = "/login";
                    }}>
                    Выйти
                </button>
            </nav>
            {showPlants && <PlantCatalog onClose={() => setShowPlants(false)} />}
        </header>
    );
}

export default Header;