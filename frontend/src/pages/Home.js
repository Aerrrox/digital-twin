import React, { useEffect, useState } from "react";
import Bed from "../components/Bed";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import { useAuth } from "../hooks/useAuth";
import happyCabbageImg from "../images/happy-cabbage.png";
import sadAppleImg from "../images/sad-apple.png";
import { apiRequest } from "../utils/utils";
import "./Home.css";

function Home() {
  const userData = useAuth();

  const [plots, setPlots] = useState([]);
  const [isLoadingPlotsList, setIsLoadinPlotsList] = useState(true);

  const [newPlotName, setNewPlotName] = useState("");
  const [newPlotNameError, setNewPlotNameError] = useState(null);

  const [currentPlotId, setCurrentPlotId] = useState(null);

  const [beds, setBeds] = useState([]);
  const [isLoadingBedsList, setIsLoadinBedsList] = useState(true);

  const [activePlant, setActivePlant] = useState(null);
  const [isWatering, setIsWatering] = useState(false);
  const [activeBed, setActiveBed] = useState(null);

  const getPlotsList = async () => {
    const response = await apiRequest(
      `http://localhost:8000/garden_api/user/${userData.user_id}/plot_list`,
      {}
    );
    const data = await response.json();
    setPlots(data);
    setIsLoadinPlotsList(false);
    return data;
  };

  const getBedsList = async () => {
    const response = await apiRequest(
      `http://localhost:8000/garden_api/plot/${currentPlotId}/bed_list`,
      {}
    );
    const data = await response.json();
    setBeds(data);
    setTimeout(() => setIsLoadinBedsList(false), 750);
  };

  const getBedStatus = async (bedId) => {
    const response = await apiRequest(
      `http://localhost:8000/garden_api/bed/${bedId}/status`,
      {}
    );
    const data = await response.json();
    return data;
  };

  useEffect(() => {
    const getPlotsListAndSetCurrentPlot = async () => {
      const plots = await getPlotsList();
      if (plots.length) setCurrentPlotId(plots[0].id);
    };
    if (userData) getPlotsListAndSetCurrentPlot();
  }, [userData]);

  const setActiveBedWithStatus = async (bed) => {
    const bedStatus = await getBedStatus(bed.id);
    setActiveBed({ ...bed, ...bedStatus });
  };

  useEffect(() => {
    if (currentPlotId) {
      setIsLoadinBedsList(true);
      getBedsList();
    }
  }, [currentPlotId]);

  const addPlant = async (bedId) => {
    const clickedBed = beds.find((bed) => bed.id == bedId);
    if (clickedBed.plant === null && activePlant !== null) {
      const response = await apiRequest(
        `http://localhost:8000/garden_api/bed/${bedId}/add_plant`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plant: activePlant }),
        }
      );
      if (response.ok) getBedsList();
    }
    setActivePlant(null);
    document.getElementById("plot").className = "plot";
  };

  const waterBed = async (bedId) => {
    const response = await apiRequest(
      `http://localhost:8000/garden_api/bed/${bedId}/water/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }
    );
    if (response.ok) getBedsList();
    document.getElementById("plot").className = "plot";
  };

  const handleBedClick = (bedId) => {
    if (isWatering) waterBed(bedId);
    else addPlant(bedId);
  };

  const createPlot = async () => {
    const response = await apiRequest(
      `http://localhost:8000/garden_api/user/${userData.user_id}/new_plot`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newPlotName }),
      }
    );

    if (response.ok) {
      const newPlots = await getPlotsList();
      setCurrentPlotId(newPlots[newPlots.length - 1].id);
      document.getElementById("plotNameField").value = "";
      document.getElementById("closeNewPlotModalBtn").click();
    } else if (response.status === 400) {
      const errors = await response.json();
      setNewPlotNameError(errors["title"][0]);
    }
  };

  const deleteBed = async () => {
    const response = await apiRequest(
      `http://localhost:8000/garden_api/bed/${activeBed.id}/delete`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (response.ok) {
      getBedsList();
      setActiveBed(null);
      document.getElementById("closeBedInfoModalBtn").click();
    }
  };

  const removePlant = async () => {
    const response = await apiRequest(
      `http://localhost:8000/garden_api/bed/${activeBed.id}/remove_plant/`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (response.ok) {
      getBedsList();
      setActiveBed({
        ...activeBed,
        plant: "Пустая грядка",
        img: undefined,
        wet: 0,
      });
    }
  };

  const deletePlot = async () => {
    const response = await apiRequest(
      `http://localhost:8000/garden_api/plot/${currentPlotId}/delete`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (response.ok) {
      const plots = await getPlotsList();
      if (plots.length) setCurrentPlotId(plots[0].id);
      else setCurrentPlotId(null);
      document.getElementById("closeDeletePlotModalBtn").click();
    }
  };

  const createBed = async () => {
    const response = await apiRequest(
      `http://localhost:8000/garden_api/plot/${currentPlotId}/new_bed`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      }
    );
    if (response.ok) getBedsList();
  };

  return (
    <div>
      <Header
        username={userData ? userData.username : <p>...</p>}
        userId={userData ? userData.user_id : 0}
        createBed={createBed}
        setActivePlant={setActivePlant}
        setIsWatering={setIsWatering}
      />

      <main className="plot" id="plot">
        {isLoadingBedsList && plots.length ? (
          <div className="h-100 d-flex flex-column align-items-center justify-content-center pb-5">
            <img
              src={happyCabbageImg}
              alt="Загрузка..."
              className="d-block mx-auto mb-3 beds-spinner"
              width={140}
              height={140}
            ></img>
            <h2 className="display-6 fw-bold">Загрузка...</h2>
          </div>
        ) : plots.length === 0 ? (
          <div className="text-center h-100 d-flex flex-column justify-content-center align-items-center pb-5">
            <img
              src={sadAppleImg}
              alt="Грустное яблоко"
              className="d-block mx-auto mb-3"
              width={120}
              height={120}
            ></img>
            <h1 className="display-6 fw-bold">У вас ещё нет участков :&#40;</h1>
          </div>
        ) : beds.length ? (
          beds.map((bed) => {
            return (
              <Bed
                key={bed.id}
                userId={userData ? userData.user_id : 0}
                id={bed.id}
                info={bed.info}
                plant={bed.plant}
                wet={bed.wet}
                handleBedClick={handleBedClick}
                water={waterBed}
                setActiveBed={setActiveBedWithStatus}
                draggable={activePlant === null}
              />
            );
          })
        ) : (
          <div className="text-center h-100 d-flex flex-column justify-content-center align-items-center pb-5">
            <img
              src={sadAppleImg}
              alt="Грустное яблоко"
              className="d-block mx-auto mb-3"
              width={120}
              height={120}
            ></img>
            <h1 className="display-6 fw-bold">
              На этом участке ещё нет грядок :&#40;
            </h1>
            <button
              type="button"
              className="btn btn-green fs-5 mt-2"
              onClick={createBed}
            >
              Добавить грядку
            </button>
          </div>
        )}
      </main>

      <Navbar
        isLoadingPlotsList={isLoadingPlotsList}
        plots={plots}
        currentPlotId={currentPlotId}
        setCurrentPlotId={setCurrentPlotId}
      />

      <div
        className="modal fade"
        id="newPlotModal"
        tabIndex="-1"
        aria-labelledby="newPlotModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="newPlotModalLabel">
                Создать новый участок
              </h1>
              <button
                type="button"
                className="btn-close"
                id="closeNewPlotModalBtn"
                data-bs-dismiss="modal"
                aria-label="Закрыть"
              ></button>
            </div>
            <div className="modal-body">
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className={
                    "form-control rounded-3 " +
                    (newPlotNameError ? "is-invalid" : "")
                  }
                  id="plotNameField"
                  required
                  placeholder="Участок 1"
                  defaultValue={newPlotName}
                  onChange={(e) => setNewPlotName(e.target.value)}
                />
                <label htmlFor="plotNameField">Название</label>
                <div
                  className={newPlotNameError ? "invalid-feedback" : "d-none"}
                >
                  {newPlotNameError}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
              >
                Отмена
              </button>
              <button
                type="button"
                className="btn btn-green"
                onClick={createPlot}
              >
                Добавить
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="deletePlotModal"
        tabIndex="-1"
        aria-labelledby="deletePlotModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="deletePlotModalLabel">
                Удаление участка
              </h1>
              <button
                type="button"
                className="btn-close"
                id="closeDeletePlotModalBtn"
                data-bs-dismiss="modal"
                aria-label="Закрыть"
              ></button>
            </div>
            <div className="modal-body">
              Вы уверены что хотите удалить текущий участок?
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger"
                onClick={deletePlot}
              >
                Удалить
              </button>
              <button
                type="button"
                className="btn btn-green"
                data-bs-dismiss="modal"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="bedInfoModal"
        tabIndex="-1"
        aria-labelledby="bedInfoModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="bedInfoModalLabel">
                Информация о грядке
              </h1>
              <button
                type="button"
                className="btn-close"
                id="closeBedInfoModalBtn"
                data-bs-dismiss="modal"
                aria-label="Закрыть"
              ></button>
            </div>
            <div className="modal-body d-flex align-items-center justify-content-between">
              <div>
                <p className="mb-0">
                  Растение:{" "}
                  {activeBed?.plant ? activeBed?.plant : "Пустая грядка"}
                </p>
                <p className="mb-0">
                  Последний полив:{" "}
                  {activeBed?.last_watered === "Никогда"
                    ? "Никогда"
                    : new Date(activeBed?.last_watered).toLocaleString("ru", {
                        timeZone: "Europe/Moscow",
                      })}
                </p>
                <p className="mb-0">Статус: {activeBed?.status}</p>
                <p className="mb-0">
                  Рост: {activeBed?.plant ? "27/50" : "Отсутствует"}
                </p>
              </div>
              <img
                src={activeBed?.img}
                alt="Растение"
                draggable={false}
                className={activeBed?.plant ? "d-block" : "d-none"}
                width={100}
                height={100}
              ></img>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger"
                onClick={deleteBed}
              >
                Удалить грядку
              </button>
              <button
                type="button"
                className="btn btn-danger"
                disabled={activeBed?.plant === null}
                onClick={removePlant}
              >
                Убрать растение
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
