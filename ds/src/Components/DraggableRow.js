// src/DraggableRow.js
import React, { useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { FLIGHT_MODES } from './constants';

function DraggableRow({
  coord,
  index,
  totalCount,
  moveItem,
  moveMarkerUp,
  moveMarkerDown,
  removeMarker,
  setCoordinates,
}) {
  const ref = useRef(null);
  const [, drop] = useDrop({
    accept: 'row',
    hover(item) {
      if (item.index !== index) {
        moveItem(item.index, index);
        item.index = index;
      }
    },
  });
  const [{ isDragging }, drag] = useDrag({
    type: 'row',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drag(drop(ref));

  const isFirst = index === 0;
  const isLast = index === totalCount - 1;

  const handleFlightModeChange = (e) => {
    const newFlightMode = parseInt(e.target.value, 10);
    if (![FLIGHT_MODES.TAKEOFF, FLIGHT_MODES.MOVE, FLIGHT_MODES.LANDING].includes(newFlightMode)) return;

    setCoordinates((prevCoords) => {
      const updatedCoords = [...prevCoords];
      updatedCoords[index] = { ...updatedCoords[index], flightMode: newFlightMode };
      return updatedCoords;
    });
  };

  const [tempAlt, setTempAlt] = useState(coord.alt);

  const handleAltChange = (e) => {
    setTempAlt(e.target.value);
  };

  const handleAltBlur = () => {
    const parsedAlt = parseFloat(tempAlt);
    if (isNaN(parsedAlt)) return;

    setCoordinates((prevCoords) => {
      const updatedCoords = [...prevCoords];
      updatedCoords[index] = { ...updatedCoords[index], alt: parsedAlt };
      return updatedCoords;
    });
  };

  return (
    <tr ref={ref} className={`draggable-row ${isDragging ? 'dragging' : ''}`}>
      <td>{index + 1}</td>

      <td>
        <select
          value={coord.flightMode}
          onChange={handleFlightModeChange}
          disabled={isFirst || isLast}
        >
          <option value={FLIGHT_MODES.TAKEOFF}>이륙</option>
          <option value={FLIGHT_MODES.MOVE}>이동</option>
          <option value={FLIGHT_MODES.LANDING}>착륙</option>
        </select>
      </td>

      <td>{coord.lat.toFixed(4)}</td>
      <td>{coord.lng.toFixed(4)}</td>
      <td>
        <input
          type="number"
          value={tempAlt}
          onChange={handleAltChange}
          onBlur={handleAltBlur}
          step="1"
          className="input-alt"
        />
      </td>

      <td>
        <button className="btn btn-move-up" onClick={() => moveMarkerUp(index)} disabled={index === 0} aria-label="위로 이동">▲</button>
        <button className="btn btn-move-down" onClick={() => moveMarkerDown(index)} disabled={index === totalCount - 1} aria-label="아래로 이동">▼</button>
      </td>
      <td>
        <button className="btn btn-remove" onClick={() => removeMarker(index)}>
          삭제
        </button>
      </td>
    </tr>
  );
}

export default React.memo(DraggableRow);
