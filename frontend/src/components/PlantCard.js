import React, { useEffect, useState } from "react";
import { getPlants } from "../api/api";

function PlantCatalog({ onClose }) {
    const [plants, setPlants] = useState([]);

    useEffect(() => {
        getPlants().then((response) => setPlants(response.data));
    }, []);

    return (
        <div className="catalog">
            <h2>Каталог растений</h2>
            <ul>
                {plants.map((plant) => (
                    <li key={plant.id} onClick={() => onClose()}>
                        {plant.title}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default PlantCatalog;