import React, { useEffect, useRef } from "react";
import Draggable from "react-draggable";
import beetImg from "../images/beet.png";
import cabbageImg from "../images/cabbage.png";
import carrotImg from "../images/carrots.png";
import pepperImg from "../images/chili.png";
import eggplantImg from "../images/eggplant.png";
import fertilizerColorImg from "../images/fertilizer-color.png";
import fertilizerImg from "../images/fertilizer.png";
import peasImg from "../images/green-pea.png";
import infoImg from "../images/info.png";
import potatoImg from "../images/potato.png";
import tomatoImg from "../images/tomato.png";
import wateringCanColorImg from "../images/watering-can-color.png";
import wateringCanImg from "../images/watering-can.png";

export default function Bed({
  id,
  info,
  plant,
  wet,
  userId,
  handleBedClick,
  setActiveBed,
  draggable,
}) {
  const bed = {
    id,
    plant,
    info,
    wet,
    img: {
      Картофель: potatoImg,
      Помидор: tomatoImg,
      "Острый перец": pepperImg,
      Морковь: carrotImg,
      Капуста: cabbageImg,
      Горох: peasImg,
      Свекла: beetImg,
      Баклажан: eggplantImg,
    }[plant]
  }
  const bedRef = useRef(null);
  const plantImgRef = useRef(null);
  const infoImgRef = useRef(null);
  const fertilizerImgRef = useRef(null);
  const wateringCanImgRef = useRef(null);

  let bedState = JSON.parse(localStorage.getItem(`user-${userId}-beds-state`));
  if (bedState && bedState[id]) bedState = bedState[id];
  else
    bedState = {
      width: 175,
      height: 175,
      y: 0,
      x: 0,
    };

  const isDraggingAllowed = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    return !(x > 0.9 || y > 0.9);
  };

  const saveBedState = (e) => {
    let bedEl = e.target;
    if (!bedEl.classList.contains("garden-bed")) bedEl = bedEl.offsetParent;
    const plotEl = bedEl.offsetParent;
    const newState = {
      height: bedEl.offsetHeight,
      width: bedEl.offsetWidth,
      x: bedEl.getBoundingClientRect().left,
      y: bedEl.getBoundingClientRect().top - plotEl.getBoundingClientRect().top,
    };

    let localStorageBedsState = JSON.parse(
      localStorage.getItem(`user-${userId}-beds-state`) || "{}"
    );
    localStorageBedsState[id] = newState;
    localStorage.setItem(
      `user-${userId}-beds-state`,
      JSON.stringify(localStorageBedsState)
    );
  };

  useEffect(() => {
    bedRef.current.addEventListener("mouseup", saveBedState);
    let bedStyles = bedRef.current.getAttribute("style");
    bedStyles += `height: ${bedState.height}px;`;
    bedStyles += `width: ${bedState.width}px;`;
    bedStyles += `transform: translate(${bedState.x}px, ${bedState.y}px);`;
    bedRef.current.setAttribute("style", bedStyles);
  }, [bedRef]);

  const bedResizeObserver = new ResizeObserver((entries) => {
    const { inlineSize, blockSize } = entries[0].borderBoxSize[0];
    const lowestValue = blockSize > inlineSize ? inlineSize : blockSize;

    let fontSize = lowestValue / 14;
    if (fontSize < 16) fontSize = 16;
    else if (fontSize > 36) fontSize = 36;
    if (bedRef.current) bedRef.current.style.fontSize = `${fontSize}px`;

    let plantImgSize = lowestValue / 5.5;
    if (plantImgSize < 30) plantImgSize = 30;
    else if (plantImgSize > 150) plantImgSize = 150;
    if (plantImgRef.current) {
      plantImgRef.current.style.width = `${plantImgSize}px`;
      plantImgRef.current.style.height = `${plantImgSize}px`;
    }

    let cornerImagesSize = lowestValue / 9;
    if (cornerImagesSize < 25) cornerImagesSize = 25;
    else if (cornerImagesSize > 65) cornerImagesSize = 65;

    if (infoImgRef.current) {
      infoImgRef.current.style.width = `${cornerImagesSize}px`;
      infoImgRef.current.style.height = `${cornerImagesSize}px`;
    }

    if (wateringCanImgRef.current) {
      wateringCanImgRef.current.style.width = `${cornerImagesSize}px`;
      wateringCanImgRef.current.style.height = `${cornerImagesSize}px`;
    }

    if (fertilizerImgRef.current) {
      fertilizerImgRef.current.style.width = `${cornerImagesSize}px`;
      fertilizerImgRef.current.style.height = `${cornerImagesSize}px`;
    }
  });

  useEffect(() => {
    bedResizeObserver.observe(document.getElementById(`bed-${id}`));
  }, []);

  return (
    <Draggable
      axis="both"
      bounds="parent"
      onStart={isDraggingAllowed}
      onMouseDown={() => handleBedClick(id)}
      defaultPosition={{ x: bedState.x, y: bedState.y }}
      disabled={!draggable}
    >
      <div
        className="garden-bed text-white d-flex flex-column justify-content-between"
        ref={bedRef}
        id={`bed-${id}`}
      >
        <div className="d-flex justify-content-between align-items-center">
          <img
            src={wet ? wateringCanColorImg : wateringCanImg}
            alt="Полив"
            className="d-block"
            draggable={false}
            width={25}
            height={25}
            ref={wateringCanImgRef}
          ></img>
          <img
            src={fertilizerImg}
            alt="Удоброение"
            draggable={false}
            className="d-block"
            width={25}
            height={25}
            ref={fertilizerImgRef}
          ></img>
        </div>
        <div className="d-flex align-items-center justify-content-center flex-column">
          <img
            src={bed.img}
            alt="Растение"
            draggable={false}
            ref={plantImgRef}
            className={plant ? "d-block" : "d-none"}
            width={30}
            height={30}
          ></img>
          {plant || "Пустая грядка"}
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <button
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#bedInfoModal"
            className="bed-info-btn"
            onClick={() => setActiveBed(bed)}
          >
            <img
              src={infoImg}
              draggable={false}
              alt="Информация"
              className="d-block"
              width={25}
              height={25}
              ref={infoImgRef}
            ></img>
          </button>
          <span className="text-center">{plant ? "Рост: 27/50" : ""}</span>
        </div>
      </div>
    </Draggable>
  );
}
