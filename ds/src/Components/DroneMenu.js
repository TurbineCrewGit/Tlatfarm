import React from "react";
import { Link } from "react-router-dom";

const RemoteControlPanel = ({
  inputPort,
  setInputPort,
  sendCommandToServer,
}) => {
  return (
    <div>
      <div className={`drone-menu`}>
        <div className="drone-menu-header">
          <div className="drone-menu-title">MENU</div>
        </div>

        <hr />

        {/* 드론 포트 선택 */}
        <div className="drone-menu-contents">
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
          </div>

          {/* 비행 제어 버튼 */}
          <div className="drone-menu-contents">
            <hr />
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

          <hr />

          {/* 리스트 페이지로 이동 */}
          <Link to={`/Smartdronepage`}>
            <button className="btn">
              <div className="toListPage">List</div>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default RemoteControlPanel;
