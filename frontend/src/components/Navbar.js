import { Tooltip } from "bootstrap/dist/js/bootstrap.bundle.min";
import React, { useEffect, useState } from "react";
import binImg from "../images/bin.png";
import cloudImg from "../images/clouds.png";
import plusImg from "../images/plus.png";
import thermometerImg from "../images/thermometer.png";
import waterDropImg from "../images/water-drop.png";
import { apiRequest } from "../utils/utils";

export default function Navbar({
  isLoadingPlotsList,
  plots,
  currentPlotId,
  setCurrentPlotId,
}) {
  const [weatherForecast, setWeatherForecats] = useState(null);

  const getWeatherForecast = async () => {
    const response = await apiRequest(
      `http://api.weatherapi.com/v1/forecast.json?key=d56852e77df9495bb5e70335242412&q=Belgorod&days=1&aqi=no&alerts=no`,
      {}
    );
    const data = await response.json();
    setWeatherForecats(data.current);
  }

  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]'
    );
    [...tooltipTriggerList].map(
      (tooltipTriggerEl) => new Tooltip(tooltipTriggerEl)
    );
    getWeatherForecast();
  }, []);

  return (
    <nav className="navbar nav-tabs pb-0 fixed-bottom navbar-expand-sm navbar-dark bottom-navbar">
      <div className="container-fluid d-flex">
        <div className="collapse navbar-collapse" id="navbarCollapse">
          <ul className="navbar-nav bottom-navbar-nav">
            {isLoadingPlotsList ? (
              <div className="spinner-border text-white mb-2" role="status">
                <span className="visually-hidden">Загрузка...</span>
              </div>
            ) : (
              plots.map((plot) => {
                return (
                  <li className="nav-item" key={plot.id}>
                    <button
                      className={
                        "nav-link " +
                        (plot.id === currentPlotId ? "current" : "")
                      }
                      aria-current="page"
                      onClick={() => setCurrentPlotId(plot.id)}
                    >
                      {plot.title}
                    </button>
                  </li>
                );
              })
            )}
            <li className="nav-item ms-2 d-flex align-items-center">
              <button
                className="bg-white rounded btn px-2"
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#newPlotModal"
              >
                <img
                  src={plusImg}
                  alt="Плюс"
                  className="bi d-block mx-auto"
                  width={20}
                  height={20}
                ></img>
              </button>
            </li>
            {plots.length ? (
              <li className="nav-item ms-2 d-flex align-items-center">
                <button
                  className="bg-danger rounded btn px-2"
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#deletePlotModal"
                >
                  <img
                    src={binImg}
                    alt="Корзина"
                    className="bi d-block mx-auto"
                    width={20}
                    height={20}
                  ></img>
                </button>
              </li>
            ) : (
              ""
            )}
          </ul>
        </div>
        <div className="d-flex gap-2 pe-2">
          <div
              className="d-flex text-white"
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              data-bs-title="Облачность"
            >
            <img
              src={cloudImg}
              alt="Облачность"
              className="bi d-block mx-auto mb-1"
              width={28}
              height={28}
            ></img>
            : {weatherForecast?.cloud}%
          </div>
          <div
            className="d-flex text-white"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            data-bs-title="Влажность"
          >
            <img
              src={waterDropImg}
              alt="Влажность"
              className="bi d-block mx-auto mb-1"
              width={28}
              height={28}
            ></img>
            : {weatherForecast?.humidity}%
          </div>
          <div
            className="d-flex text-white"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            data-bs-title="Температура"
          >
            <img
              src={thermometerImg}
              alt="Температура"
              className="bi d-block mx-auto mb-1"
              width={28}
              height={28}
            ></img>
            : {weatherForecast?.temp_c}°С
          </div>
        </div>
      </div>
    </nav>
  );
}
