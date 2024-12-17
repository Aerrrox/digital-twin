import React, { useState, useEffect } from "react";
import { getPlots } from "../api/api";

function PlotPage({ waterMode, onWaterDone }) {
    const [plots, setPlots] = useState([]);
    const [selectedPlot, setSelectedPlot] = useState(null);

    useEffect(() => {
        getPlots().then((response) => setPlots(response.data));
    }, []);

    const handleWater = (bedId) => {
        alert(`Грядка ${bedId} политa!`);
        onWaterDone();
    };

    return (
        <div>
            <h1>Ваш участок</h1>
            {plots.length === 0 ? (
                <p>У вас ещё нет участков.</p>
            ) : (
                <ul>
                    {plots.map((plot) => (
                        <li key={plot.id} onClick={() => setSelectedPlot(plot)}>
                            {plot.title}
                        </li>
                    ))}
                </ul>
            )}

            {selectedPlot && (
                <div>
                    <h2>Грядки на участке: {selectedPlot.title}</h2>
                    {selectedPlot.beds.map((bed) => (
                        <div
                            key={bed.id}
                            onClick={() => waterMode && handleWater(bed.id)}
                        >
                            Грядка {bed.id} {bed.is_wilted ? "(увядшая)" : ""}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default PlotPage;