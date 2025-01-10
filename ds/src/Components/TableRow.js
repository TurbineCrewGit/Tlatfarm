// src/Components/TableRow.js
import React from "react";
import WeatherInfo from './WeatherInfo';
import { getPowerBackgroundColor } from '../utils/weatherUtils';

const TableRow = ({ row, weatherData, onDelete, navigate, mode }) => {
  const powerValue = parseFloat(row.powerProduction);
  const powerBackgroundColor = getPowerBackgroundColor(powerValue, mode); // mode 전달

  const handleDetailClick = () => {
    navigate(`/clebinepage/${row.id}`);
  };

  return (
    <tr>
      <td>{row.id}</td>
      <td style={{ backgroundColor: powerBackgroundColor }}>
        {row.powerProduction}
      </td>
      <td>{row.latitude}</td>
      <td>{row.longitude}</td>
      <td className="weatherColumn">
        <WeatherInfo data={weatherData} />
      </td>
      <td>
        <button
          className="detailBtn"
          onClick={handleDetailClick}
        >
          Detail
        </button>
      </td>
      <td>
        <button
          className="deleteBtn"
          onClick={() => onDelete(row.id)}
        >
          x
        </button>
      </td>
    </tr>
  );
};

export default TableRow;
