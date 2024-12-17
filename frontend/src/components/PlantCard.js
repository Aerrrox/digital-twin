import React from "react";

function PlantCard({ title, image }) {
    return (
        <div className="plant-card">
            {image && <img src={image} alt={title} />}
            <h3>{title}</h3>
        </div>
    );
}

export default PlantCard;