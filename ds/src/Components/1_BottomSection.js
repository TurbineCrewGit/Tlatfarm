import React from "react";
import onButtonIcon from "../Styles/image/on.png";
import offButtonIcon from "../Styles/image/off.png";

const BottomSection = ({ csvData, droneData, filterID, toggleFilterID, turnOnButton, turnOffButton, reposition }) => {
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
                                let powerBackgroundColor;

                                if (parseFloat(row.Power) === 0) {
                                    powerBackgroundColor = "#141414";
                                } else if (parseFloat(row.Power) >= 1 && parseFloat(row.Power) <= 49) {
                                    powerBackgroundColor = "#941414";
                                } else if (parseFloat(row.Power) >= 50 && parseFloat(row.Power) <= 99) {
                                    powerBackgroundColor = "#945D14";
                                } else if (parseFloat(row.Power) >= 100 && parseFloat(row.Power) <= 149) {
                                    powerBackgroundColor = "#949414";
                                } else if (parseFloat(row.Power) >= 150) {
                                    powerBackgroundColor = "#469446";
                                }

                                return (
                                    <tr key={index}>
                                        <td>{row.No}</td>
                                        <td>{row.ID}</td>
                                        <td style={{ backgroundColor: powerBackgroundColor }}>{row.Power}</td>
                                        <td>
                                            <button
                                                style={{ padding: "5px 10px", cursor: "pointer" }}
                                                onClick={() => alert(`Clebine ID: ${row.ID}`)}
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
                                                    onClick={() => alert(`SmartDrone ID: ${drone.ID}`)}
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
