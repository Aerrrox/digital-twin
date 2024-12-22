import React, { useEffect, useRef } from "react";
import Draggable from "react-draggable";
import fertilizerColorImg from "../images/fertilizer-color.png";
import fertilizerImg from "../images/fertilizer.png";
import infoImg from "../images/info.png";
import potatoImg from "../images/potato.png";

export default function Bed({ id, info, plant, wet }) {
  const bedRef = useRef(null);
  const plantImgRef = useRef(null);

  const isDraggingAllowed = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    return !(x > 0.9 || y > 0.9);
  };

  const handeStartResizing = (e) => {
    if (!isDraggingAllowed(e)) console.log("start resizing");
  };

  const handeEndResizing = (e) => {
    if (!isDraggingAllowed(e)) console.log("end resizing");
  };

  // const bedResizeObserver = new ResizeObserver((entries) => {
  //   const {inlineSize, blockSize} = entries[0].borderBoxSize[0];
  //   const greatesValue = blockSize > inlineSize ? blockSize : inlineSize;
  //   let fontSize = greatesValue / 13;
  //   if (fontSize < 16) fontSize = 16;
  //   else if (fontSize > 40) fontSize = 40;
  //   let plantImgSize = greatesValue / 5;
  //   bedRef.current.style.fontSize = `${fontSize}px`;
  //   plantImgRef.current.style.width = `${plantImgSize}px`;
  //   plantImgRef.current.style.height = `${plantImgSize}px`;
  // });

  // useEffect(() => {
  //   bedResizeObserver.observe(document.getElementById(`bed-${id}`));
  // }, []);

  return (
    <Draggable
      axis="both"
      bounds="parent"
      onStart={isDraggingAllowed}
      onMouseDown={handeStartResizing}
      onMouseUp={handeEndResizing}
    >
      <div
        className="garden-bed text-white d-flex flex-column justify-content-between"
        ref={bedRef}
        id={`bed-${id}`}
      >
        <div className="d-flex justify-content-between align-items-center">
          <span>0</span>
          <img
            src={fertilizerImg}
            className="d-block"
            width={28}
            height={28}
          ></img>
        </div>
        <div className="d-flex align-items-center justify-content-center flex-column">
          <img src={potatoImg} ref={plantImgRef} className="d-block" width={28} height={28}></img>
          Картофель
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <img src={infoImg} className="d-block" width={20} height={20}></img>
          <span className="text-center">Рост: 27/50</span>
        </div>
      </div>
    </Draggable>
  );
}
