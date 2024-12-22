import React, { useEffect, useState } from "react";
import Bed from "../componenst/Bed";
import Header from "../componenst/Header";
import Navbar from "../componenst/Navbar";
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
    setTimeout(() => setIsLoadinBedsList(false), 600);
  };

  useEffect(() => {
    const getPlotsListAndSetCurrentPlot = async () => {
      const plots = await getPlotsList();
      setCurrentPlotId(plots[0].id);
    };
    if (userData) getPlotsListAndSetCurrentPlot();
  }, [userData]);

  useEffect(() => {
    if (currentPlotId) {
      setIsLoadinBedsList(true);
      getBedsList();
    }
  }, [currentPlotId]);

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
      getPlotsList();
      document.getElementById("closeModalBtn").click();
    } else if (response.status === 400) {
      const errors = await response.json();
      setNewPlotNameError(errors["title"][0]);
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
      />

      <main className="plot" id="plot">
        {isLoadingBedsList ? (
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
        ) : beds.length ? (
          beds.map((bed) => {
            return (
              <Bed
                key={bed.id}
                id={bed.id}
                info={bed.info}
                plant={bed.plant}
                wet={bed.wet}
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
              className="btn btn-add fs-5 mt-2"
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
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Создать новый участок
              </h1>
              <button
                type="button"
                className="btn-close"
                id="closeModalBtn"
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
                className="btn btn-add"
                onClick={createPlot}
              >
                Добавить
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
