import React from "react";
import plusImg from "../images/plus.png";
import thermometerImg from "../images/thermometer.png";
import waterDropImg from "../images/water-drop.png";

export default function Navbar({
  isLoadingPlotsList,
  plots,
  currentPlotId,
  setCurrentPlotId,
}) {
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
                className="add-plot-btn rounded btn px-2"
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
          </ul>
        </div>
        <div className="d-flex gap-2">
          <div className="d-flex text-white">
            <img
              src={waterDropImg}
              className="bi d-block mx-auto mb-1"
              width={28}
              height={28}
            ></img>
            : 64%
          </div>
          <div className="d-flex text-white">
            <img
              src={thermometerImg}
              className="bi d-block mx-auto mb-1"
              width={28}
              height={28}
            ></img>
            : 18°С
          </div>
        </div>
      </div>
    </nav>
  );
}
