import React, { useEffect, useState } from "react";
import { getPlants } from "../api/api";
import PlantCard from "../components/PlantCard";

function PlantsPage() {
    const [plants, setPlants] = useState([]);

    useEffect(() => {
        getPlants().then((response) => setPlants(response.data));
    }, []);

    return (
        <div>
            <h1>Растения</h1>
            <div className="plants-grid">
                {plants.map((plant) => (
                    <PlantCard key={plant.id} title={plant.title} image={plant.image} />
                ))}
            </div>
        </div>
    );
}

export default PlantsPage;