import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import autoFertilizerImg from "../images/auto-fertilizer.png";
import autoWateringImg from "../images/auto-watering.png";
import beetImg from "../images/beet.png";
import cabbageImg from "../images/cabbage.png";
import carrotImg from "../images/carrots.png";
import pepperImg from "../images/chili.png";
import eggplantImg from "../images/eggplant.png";
import fertilizerImg from "../images/fertilizer.png";
import peasImg from "../images/green-pea.png";
import plantImg from "../images/plant.png";
import potatoImg from "../images/potato.png";
import toolImg from "../images/settings.png";
import soilImg from "../images/soil.png";
import tomatoImg from "../images/tomato.png";
import wateringCanImg from "../images/watering-can.png";
import { handleLogout } from "../utils/utils";

export default function Header({
  userId,
  username,
  createBed,
  setActivePlant,
  setIsWatering
}) {
  const navigate = useNavigate();
  const plot = document.getElementById("plot");
  const [avatarId, setAvatarId] = useState(null);
  const [currentCursorClass, setCurrentCursorClass] = useState(null);

  const logout = () => {
    handleLogout();
    navigate("/login");
  };

  useEffect(() => {
    const localStorageAvatarId = localStorage.getItem(`user-${userId}-avatar`);
    if (localStorageAvatarId) {
     setAvatarId(localStorage.getItem(`user-${userId}-avatar`));
    } else setAvatarId(0);
  }, [userId]);

  const selectPlant = (cursorClass, plantName) => {
    if (plot.classList.contains(currentCursorClass)) {
      plot.classList.remove(currentCursorClass);
    }
    plot.classList.add(cursorClass);
    setCurrentCursorClass(cursorClass);
    setActivePlant(plantName);
    setIsWatering(false);
  };
  
  const selectWatering = () => {
    if (plot.classList.contains(currentCursorClass)) {
      plot.classList.remove(currentCursorClass);
    }
    setCurrentCursorClass("watering-can-cursor");
    plot.classList.add("watering-can-cursor");
    setActivePlant(null);
    setIsWatering(true);
  }

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
                    alt="Растения"
                    className="d-block mx-auto mb-1"
                    width={28}
                    height={28}
                  ></img>
                  Растения
                </button>
                <ul className="dropdown-menu gap-2 row dropdown-plants text-small shadow">
                  <li className="col-6 d-inline-block">
                    <button
                      className="dropdown-item d-flex flex-column gap-2 align-items-center dropdown-btn"
                      type="button"
                      onClick={() => selectPlant("tomato-cursor", "Помидор")}
                    >
                      <img
                        src={tomatoImg}
                        alt="Помидор"
                        className="d-block mx-auto mb-1"
                        width={38}
                        height={38}
                      ></img>
                      Помидор
                    </button>
                  </li>
                  <li className="col-6 d-inline-block">
                    <button
                      className="dropdown-item d-flex flex-column gap-2 align-items-center dropdown-btn"
                      type="button"
                      onClick={() =>
                        selectPlant("pepper-cursor", "Острый перец")
                      }
                    >
                      <img
                        src={pepperImg}
                        alt="Острый перец"
                        className="d-block mx-auto mb-1"
                        width={38}
                        height={38}
                      ></img>
                      Острый перец
                    </button>
                  </li>
                  <li className="col-6 d-inline-block">
                    <button
                      className="dropdown-item d-flex flex-column gap-2 align-items-center dropdown-btn"
                      type="button"
                      onClick={() => selectPlant("potato-cursor", "Картофель")}
                    >
                      <img
                        src={potatoImg}
                        alt="Картофель"
                        className="d-block mx-auto mb-1"
                        width={38}
                        height={38}
                      ></img>
                      Картофель
                    </button>
                  </li>
                  <li className="col-6 d-inline-block">
                    <button
                      className="dropdown-item d-flex flex-column gap-2 align-items-center dropdown-btn"
                      type="button"
                      onClick={() => selectPlant("carrot-cursor", "Морковь")}
                    >
                      <img
                        src={carrotImg}
                        className="d-block mx-auto mb-1"
                        width={38}
                        alt="Морковь"
                        height={38}
                      ></img>
                      Морковь
                    </button>
                  </li>
                  <li className="col-6 d-inline-block">
                    <button
                      className="dropdown-item d-flex flex-column gap-2 align-items-center dropdown-btn"
                      type="button"
                      onClick={() => selectPlant("cabbage-cursor", "Капуста")}
                    >
                      <img
                        src={cabbageImg}
                        alt="Капуста"
                        className="d-block mx-auto mb-1"
                        width={38}
                        height={38}
                      ></img>
                      Капуста
                    </button>
                  </li>
                  <li className="col-6 d-inline-block">
                    <button
                      className="dropdown-item d-flex flex-column gap-2 align-items-center dropdown-btn"
                      type="button"
                      onClick={() => selectPlant("peas-cursor", "Горох")}
                    >
                      <img
                        src={peasImg}
                        alt="Горох"
                        className="d-block mx-auto mb-1"
                        width={38}
                        height={38}
                      ></img>
                      Горох
                    </button>
                  </li>
                  <li className="col-6 d-inline-block">
                    <button
                      className="dropdown-item d-flex flex-column gap-2 align-items-center dropdown-btn"
                      type="button"
                      onClick={() => selectPlant("beet-cursor", "Свекла")}
                    >
                      <img
                        src={beetImg}
                        alt="Свекла"
                        className="d-block mx-auto mb-1"
                        width={38}
                        height={38}
                      ></img>
                      Свекла
                    </button>
                  </li>
                  <li className="col-6 d-inline-block">
                    <button
                      className="dropdown-item d-flex flex-column gap-2 align-items-center dropdown-btn"
                      type="button"
                      onClick={() => selectPlant("eggplant-cursor", "Баклажан")}
                    >
                      <img
                        src={eggplantImg}
                        alt="Баклажан"
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
                <button
                  type="button"
                  className="nav-link header-nav-btn rounded"
                  data-bs-target=".dropdown-smart-systems"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    src={toolImg}
                    alt="Умные системы"
                    className="d-block mx-auto mb-1"
                    width={28}
                    height={28}
                  ></img>
                  Умные системы
                </button>
                <ul className="dropdown-menu gap-2 row dropdown-smart-systems text-small shadow">
                  <li className="col-6 d-inline-block">
                    <button
                      className="dropdown-item d-flex flex-column gap-2 align-items-center dropdown-btn"
                      type="button"
                    >
                      <img
                        src={autoWateringImg}
                        alt="Автополив"
                        className="d-block mx-auto mb-1"
                        width={38}
                        height={38}
                      ></img>
                      Автополив
                    </button>
                  </li>
                  <li className="col-6 d-inline-block">
                    <button
                      className="dropdown-item d-flex flex-column gap-2 align-items-center dropdown-btn"
                      type="button"
                    >
                      <img
                        src={autoFertilizerImg}
                        alt="Автоудобрение"
                        className="d-block mx-auto mb-1"
                        width={38}
                        height={38}
                      ></img>
                      Автоудобрение
                    </button>
                  </li>
                </ul>
              </li>
              <li>
                <button
                  type="button"
                  className="nav-link header-nav-btn rounded"
                  onClick={selectWatering}
                >
                  <img
                    src={wateringCanImg}
                    alt="Полив"
                    className="d-block mx-auto mb-1"
                    width={28}
                    height={28}
                  ></img>
                  Полив
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="nav-link header-nav-btn rounded"
                >
                  <img
                    src={fertilizerImg}
                    alt="Удобрение"
                    className="d-block mx-auto mb-1"
                    width={28}
                    height={28}
                  ></img>
                  Удобрение
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={createBed}
                  className="nav-link header-nav-btn rounded"
                >
                  <img
                    src={soilImg}
                    alt="Грядка"
                    className="d-block mx-auto mb-1"
                    width={28}
                    height={28}
                  ></img>
                  Грядка
                </button>
              </li>
            </ul>

            <button
              className="d-flex btn profile-btn rounded py-1 px-2 align-items-center gap-2 me-1 bg-white text-black cli"
              data-bs-target=".dropdown-profile"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              type="button"
            >
              {username}
              <img
                src={`/avatar_${avatarId}.png`}
                alt="Аватар"
                className="d-block mx-auto mb-1"
                width={50}
                height={50}
              ></img>
            </button>
            <ul className="dropdown-menu dropdown-profile text-small shadow">
              <li>
                <span className="dropdown-item">Выбор аватара:</span>
              </li>
              <li className="row gap-1 px-2 justify-content-center">
                {Array.from(Array(6).keys()).map((id) => {
                  return (
                    <button
                      onClick={() => {
                        localStorage.setItem(`user-${userId}-avatar`, id);
                        setAvatarId(id);
                      }}
                      key={`avatar-${id}`}
                      className={
                        (avatarId === id ? "active " : "") +
                        `w-auto dropdown-item col-6 d-inline-block avatar-btn`
                      }
                      type="button"
                    >
                      <img
                        src={`/avatar_${id}.png`}
                        alt={`Аватар ${id}`}
                        className="d-block"
                        width={50}
                        height={50}
                      ></img>
                    </button>
                  );
                })}
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <button
                  onClick={logout}
                  className="dropdown-item"
                  type="button"
                >
                  Выйти
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
