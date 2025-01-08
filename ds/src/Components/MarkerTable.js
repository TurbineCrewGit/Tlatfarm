// src/MarkerTable.js
import React, { useRef } from 'react';
import DraggableRow from './DraggableRow';
import { useDrop } from 'react-dnd';
import { SCROLL_SPEED, SCROLL_THRESHOLD } from './constants';

function MarkerTable({
  coordinates,
  moveItem,
  moveMarkerUp,
  moveMarkerDown,
  removeMarker,
  updateFlightModes,
  setCoordinates,
  tableRef,
}) {
  const scrollRef = useRef({ isScrolling: false, direction: null });

  const handleDragOver = (e) => {
    const table = tableRef.current;
    const { top, bottom } = table.getBoundingClientRect();
    const mouseY = e.clientY;

    if (mouseY < top + SCROLL_THRESHOLD) {
      scrollRef.current.isScrolling = true;
      scrollRef.current.direction = 'up';
    } else if (mouseY > bottom - SCROLL_THRESHOLD) {
      scrollRef.current.isScrolling = true;
      scrollRef.current.direction = 'down';
    } else {
      scrollRef.current.isScrolling = false;
    }
  };

  const handleDragEnd = () => {
    scrollRef.current.isScrolling = false;
  };

  // 테이블 자동 스크롤 기능
  useDrop({
    accept: 'row',
    hover: () => {},
  });

  return (
    <div
      className="table-container"
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <table className="coordinates" ref={tableRef}>
        <thead>
          <tr>
            <th>번호</th>
            <th>비행 방식</th>
            <th>위도</th>
            <th>경도</th>
            <th>고도</th>
            <th>순서 변경</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          {coordinates.length > 0 ? (
            coordinates.map((coord, index) => (
              <DraggableRow
                key={coord.id}
                index={index}
                coord={coord}
                totalCount={coordinates.length}
                moveItem={moveItem}
                moveMarkerUp={moveMarkerUp}
                moveMarkerDown={moveMarkerDown}
                removeMarker={removeMarker}
                updateFlightModes={updateFlightModes}
                setCoordinates={setCoordinates}
              />
            ))
          ) : (
            <tr className="no-marker">
              <td colSpan="7">
                <div className="no-marker-content">마커가 없습니다</div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default MarkerTable;
