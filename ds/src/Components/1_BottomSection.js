import React from "react";
import onButtonIcon from "../Styles/image/on.png";
import offButtonIcon from "../Styles/image/off.png";
import { useNavigate } from 'react-router-dom';
import "../Styles/1_BottomSection.css";

const BottomSection = ({ csvData, droneData, filterID, toggleFilterID, turnOnButton, turnOffButton, reposition, isDarkMode, }) => {

    
    const navigate = useNavigate();

    const handleClebineDetailClick = (id) => {
        navigate(`/clebinepage/${id}`);
    };
    const handleSmartDroneDetailClick = (id) => {
        navigate(`/smartdronepage/${id}`);
    }

    const getBackgroundColor = (power) => {
        if (isDarkMode) {
            if (power === 0) return "#141414";
            if (power >= 1 && power <= 49) return "#941414";
            if (power >= 50 && power <= 99) return "#945D14";
            if (power >= 100 && power <= 149) return "#949414";
            if (power >= 150) return "#469446";
        } else {
            if (power === 0) return "#979797";
            if (power >= 1 && power <= 49) return "#f28b82";
            if (power >= 50 && power <= 99) return "#fbbc04";
            if (power >= 100 && power <= 149) return "#fff475";
            if (power >= 150) return "#ccff90";
        }
        return "transparent";
    };

    
    return (
        <div className="bottom-sections">
            {/* Clebine Section */}
            <div className="clebine-section">
                <div className="clebine-box">
                    <div style={{ flexDirection: "row", display: "flex", gap: "5px" }}>
                        <h3>Clebine Section</h3>
                        <button
                            onClick={() => turnOnButton("clebine")}
                            style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                            }}
                        >
                            <img
                                src={onButtonIcon}
                                alt="Clebine On Button"
                                style={{ width: "50px", height: "50px" }}
                            />
                        </button>

                        <button
                            onClick={() => turnOffButton("clebine")}
                            style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                            }}
                        >
                            <img
                                src={offButtonIcon}
                                alt="Clebine Off Button"
                                style={{ width: "50px", height: "50px" }}
                            />
                        </button>
                    </div>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>ID</th>
                                <th>Power</th>
                                <th>Detail</th>
                                <th>Reposition</th>
                                <th>Visibility</th>
                            </tr>
                        </thead>
                        <tbody>
                            {csvData.map((row, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{row.No}</td>
                                        <td>{row.ID}</td>
                                        <td 
                                            style={{
                                                backgroundColor: getBackgroundColor(parseFloat(row.Power)),
                                            }}
                                        >{row.Power}</td>
                                        <td>
                                            <button
                                                style={{ padding: "5px 10px", cursor: "pointer" }}
                                                onClick={() => handleClebineDetailClick(row.ID)}
                                            >
                                                Detail
                                            </button>
                                        </td>
                                        <td>
                                            <button
                                                style={{ padding: "5px 10px", cursor: "pointer" }}
                                                onClick={() => reposition("clebine", row.ID)}
                                            >
                                                Reposition
                                            </button>
                                        </td>
                                        <td>
                                            <button onClick={() => toggleFilterID("clebine", row.ID)}>
                                                {filterID.includes(`clebine-${row.ID}`) ? "Shown" : "Hidden"}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* SmartDrone Section */}
            <div className="smartdrone-section">
                <div className="smartdrone-box">
                    <div style={{ flexDirection: "row", display: "flex", gap: "5px" }}>
                        <h3>SmartDrone Section</h3>
                        <div style={{ display: "flex", gap: "5px" }}>
                            <button
                                onClick={() => turnOnButton("smartDrone")}
                                style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                }}
                            >
                                <img
                                    src={onButtonIcon}
                                    alt="SmartDrone On Button"
                                    style={{ width: "50px", height: "50px" }}
                                />
                            </button>

                            <button
                                onClick={() => turnOffButton("smartDrone")}
                                style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                }}
                            >
                                <img
                                    src={offButtonIcon}
                                    alt="SmartDrone Off Button"
                                    style={{ width: "50px", height: "50px" }}
                                />
                            </button>
                        </div>
                    </div>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Status</th>
                                <th>Detail</th>
                                <th>Reposition</th>
                                <th>Visibility</th>
                            </tr>
                        </thead>
                        <tbody>
                            {droneData.map((drone) =>
                                drone.waypoints
                                    .filter((wp) => wp.isItme === "1")
                                    .map((wp, idx) => (
                                        <tr key={`${drone.ID}-${idx}`}>
                                            <td>{drone.ID}</td>
                                            <td>
                                                {(() => {
                                                    switch (wp.action) {
                                                        case "5":
                                                            return "이륙";
                                                        case "6":
                                                            return "착륙";
                                                        case "16":
                                                            return "이동";
                                                        default:
                                                            return wp.action;
                                                    }
                                                })()}
                                            </td>
                                            <td>
                                                <button
                                                    style={{ padding: "5px 10px", cursor: "pointer" }}
                                                    onClick={() => handleSmartDroneDetailClick(drone.ID)}
                                                >
                                                    Detail
                                                </button>
                                            </td>
                                            <td>
                                                <button
                                                    style={{ padding: "5px 10px", cursor: "pointer" }}
                                                    onClick={() => reposition("drone", drone.ID)}
                                                >
                                                    Reposition
                                                </button>
                                            </td>
                                            <td>
                                                <button onClick={() => toggleFilterID("drone", drone.ID)}>
                                                    {filterID.includes(`drone-${drone.ID}`) ? "Shown" : "Hidden"}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default BottomSection;
