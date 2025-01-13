import React from 'react';
import Draggable from 'react-draggable';

const DraggableRemoteControlPanel = ({
  isControllerOpen,
  toggleControllerContent,
  inputPort,
  setInputPort,
  sendCommandToServer
}) => {
  return (
    <Draggable handle=".dragSpotContainer">
      <div className={`remote-control-panel ${isControllerOpen ? "open" : "closed"}`}>
        <div className="controller-header">
          <div className="dragSpotContainer">
            <div className="dragSpot">=</div>
            <div className="controller-title">비행 컨트롤러</div>
          </div>
          <button className="controller-toggle-btn" onClick={toggleControllerContent}>
            {isControllerOpen ? "∧" : "∨"}
          </button>
        </div>

        {isControllerOpen && (
          <div className="controller-contents">
            <hr />
            {/* 포트 입력 및 비행 제어 버튼 */}
            <div className="input-container port-input">
              <select
                className="port-number"
                value={inputPort}
                onChange={(e) => setInputPort(e.target.value)}
              >
                <option value="" disabled>
                  포트 선택
                </option>
                {Array.from({ length: 9 }, (_, i) => (
                  <option key={`COM${i + 1}`} value={`COM${i + 1}`}>
                    {`COM${i + 1}`}
                  </option>
                ))}
              </select>
              <div className="command-btn-container">
                <button
                  className="btn btn-command btn-command-arming"
                  onClick={() => sendCommandToServer("ARMING")}
                >
                  시동
                </button>
                <button
                  className="btn btn-command btn-command-start"
                  onClick={() => sendCommandToServer("START")}
                >
                  비행 시작
                </button>
                <button
                  className="btn btn-command btn-command-stop"
                  onClick={() => sendCommandToServer("STOP")}
                >
                  비행 종료
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Draggable>
  );
};

export default DraggableRemoteControlPanel;