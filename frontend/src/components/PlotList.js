import React, { useEffect, useState } from "react";
import { getPlots } from "../api/api";

function PlotList() {
    const [plots, setPlots] = useState([]);

    useEffect(() => {
        getPlots().then((response) => setPlots(response.data));
    }, []);

    return (
        <div>
            <h2>Участки</h2>
            <ul>
                {plots.map((plot) => (
                    <li key={plot.id}>{plot.title}</li>
                ))}
            </ul>
        </div>
    );
}

export default PlotList;