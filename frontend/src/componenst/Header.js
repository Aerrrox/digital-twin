import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import beetImg from "../images/beet.png";
import cabbageImg from "../images/cabbage.png";
import carrotImg from "../images/carrots.png";
import pepperImg from "../images/chili.png";
import eggplantImg from "../images/eggplant.png";
import farmerImg from "../images/farmer.png";
import fertilizerImg from "../images/fertilizer.png";
import peasImg from "../images/green-pea.png";
import plantImg from "../images/plant.png";
import potatoImg from "../images/potato.png";
import toolImg from "../images/settings.png";
import soilImg from "../images/soil.png";
import tomatoImg from "../images/tomato.png";
import wateringCanImg from "../images/watering-can.png";
import { handleLogout } from "../utils/utils";


export default function Header({ username }) {
  const navigate = useNavigate();
  const plot = document.getElementById("plot");
  const [currentCursorClass, setCurrentCursorClass] = useState(null);

  const logout = () => {
    handleLogout();
    navigate("/login");
  };

  const selectPlant = (cursorClass) => {
    plot.classList.remove(currentCursorClass);
    plot.classList.add(cursorClass);
    setCurrentCursorClass(cursorClass);
  };

  return (
    <header className="header">
      <div className="px-3 py-2 text-white">
        <div className="container-fluid">
          <div className="d-flex flex-wrap align-items-center justify-content-between">
            <ul className="nav gap-1 col-auto justify-content-center my-md-0 text-small">
              <li>
                <button
                  className="nav-link header-nav-btn rounded"
                  data-bs-target=".dropdown-plants"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  type="button"
                >
                  <img
                    src={plantImg}
                    className="d-block mx-auto mb-1"
                    width={28}
                    height={28}
                  ></img>
                  Растения
                </button>
                <ul className="dropdown-menu gap-2 row dropdown-plants text-small shadow">
                  <li className="col-6 d-inline-block">
                    <button
                      className="dropdown-item d-flex flex-column gap-2 align-items-center select-plant-btn"
                      type="button"
                      onClick={() => selectPlant("tomato-cursor")}
                    >
                      <img
                        src={tomatoImg}
                        className="d-block mx-auto mb-1"
                        width={38}
                        height={38}
                      ></img>
                      Помидор
                    </button>
                  </li>
                  <li className="col-6 d-inline-block">
                    <button
                      className="dropdown-item d-flex flex-column gap-2 align-items-center select-plant-btn"
                      type="button"
                      onClick={() => selectPlant("pepper-cursor")}
                    >
                      <img
                        src={pepperImg}
                        className="d-block mx-auto mb-1"
                        width={38}
                        height={38}
                      ></img>
                      Острый перец
                    </button>
                  </li>
                  <li className="col-6 d-inline-block">
                    <button
                      className="dropdown-item d-flex flex-column gap-2 align-items-center select-plant-btn"
                      type="button"
                      onClick={() => selectPlant("potato-cursor")}
                    >
                      <img
                        src={potatoImg}
                        className="d-block mx-auto mb-1"
                        width={38}
                        height={38}
                      ></img>
                      Картофель
                    </button>
                  </li>
                  <li className="col-6 d-inline-block">
                    <button
                      className="dropdown-item d-flex flex-column gap-2 align-items-center select-plant-btn"
                      type="button"
                      onClick={() => selectPlant("carrot-cursor")}
                    >
                      <img
                        src={carrotImg}
                        className="d-block mx-auto mb-1"
                        width={38}
                        height={38}
                      ></img>
                      Морковь
                    </button>
                  </li>
                  <li className="col-6 d-inline-block">
                    <button
                      className="dropdown-item d-flex flex-column gap-2 align-items-center select-plant-btn"
                      type="button"
                      onClick={() => selectPlant("cabbage-cursor")}
                    >
                      <img
                        src={cabbageImg}
                        className="d-block mx-auto mb-1"
                        width={38}
                        height={38}
                      ></img>
                      Капуста
                    </button>
                  </li>
                  <li className="col-6 d-inline-block">
                    <button
                      className="dropdown-item d-flex flex-column gap-2 align-items-center select-plant-btn"
                      type="button"
                      onClick={() => selectPlant("peas-cursor")}
                    >
                      <img
                        src={peasImg}
                        className="d-block mx-auto mb-1"
                        width={38}
                        height={38}
                      ></img>
                      Горох
                    </button>
                  </li>
                  <li className="col-6 d-inline-block">
                    <button
                      className="dropdown-item d-flex flex-column gap-2 align-items-center select-plant-btn"
                      type="button"
                      onClick={() => selectPlant("beet-cursor")}
                    >
                      <img
                        src={beetImg}
                        className="d-block mx-auto mb-1"
                        width={38}
                        height={38}
                      ></img>
                      Свекла
                    </button>
                  </li>
                  <li className="col-6 d-inline-block">
                    <button
                      className="dropdown-item d-flex flex-column gap-2 align-items-center select-plant-btn"
                      type="button"
                      onClick={() => selectPlant("eggplant-cursor")}
                    >
                      <img
                        src={eggplantImg}
                        className="d-block mx-auto mb-1"
                        width={38}
                        height={38}
                      ></img>
                      Баклажан
                    </button>
                  </li>
                </ul>
              </li>
              <li>
                <button className="nav-link header-nav-btn rounded">
                  <img
                    src={toolImg}
                    className="d-block mx-auto mb-1"
                    width={28}
                    height={28}
                  ></img>
                  Умные системы
                </button>
              </li>
              <li>
                <button className="nav-link header-nav-btn rounded">
                  <img
                    src={wateringCanImg}
                    className="d-block mx-auto mb-1"
                    width={28}
                    height={28}
                  ></img>
                  Полив
                </button>
              </li>
              <li>
                <button className="nav-link header-nav-btn rounded">
                  <img
                    src={soilImg}
                    className="d-block mx-auto mb-1"
                    width={28}
                    height={28}
                  ></img>
                  Грядка
                </button>
              </li>
              <li>
                <button className="nav-link header-nav-btn rounded">
                  <img
                    src={fertilizerImg}
                    className="d-block mx-auto mb-1"
                    width={28}
                    height={28}
                  ></img>
                  Удобрение
                </button>
              </li>
            </ul>

            <button
              className="d-flex btn profile-btn rounded py-1 px-2 align-items-center gap-2 me-1 bg-white text-black cli"
              data-bs-target=".dropdown-profile"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {username}
              <img
                src={farmerImg}
                className="d-block mx-auto mb-1"
                width={50}
                height={50}
              ></img>
            </button>
            <ul className="dropdown-menu dropdown-profile text-small shadow">
              <li>
                <a className="dropdown-item" href="#">
                  Заметки
                </a>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <a onClick={logout} className="dropdown-item" href="#">
                  Выйти
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
