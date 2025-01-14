
import React from 'react';
import expandIcon from '../Styles/image/expand_button.png';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';


function Section({
  index,
  sectionTitle,
  expandedSection,
  handleToggleSection,
  data, // 배열 형태의 집계된 날씨 데이터 [{id, temperature, humidity, windDirect, windSpeed, rainfall}, ...]
}) {

  const getSectionStyle = (index) => {
    const baseStyle = {
      transition: "all 0.3s ease",
      overflow: "hidden",
      position: "relative",
      transformOrigin: "top left",
      width: "500px",
      height: "400px",
      margin: "20px auto",
      border: "none",
      borderRadius: "10px",
    };

    if (expandedSection === index) {
      const positionOffsets = [
        { top: "10%", left: "10%" },
        { top: "10%", left: "-40%" },
        { top: "-40%", left: "10%" },
        { top: "-37%", left: "-40%" },
      ];

      const { top, left } = positionOffsets[index] || { top: "30%", left: "40%" };

      return {
        ...baseStyle,
        top,
        left,
        transform: "scale(1.7)",
        zIndex: 1000,
        padding: "20px",
        paddingBottom: "35px",
      };
    }

    if (expandedSection !== null && expandedSection !== index) {
      return {
        ...baseStyle,
        opacity: 0,
        pointerEvents: "none",
      };
    }

    return baseStyle;
  };

  // 데이터 준비
  let chartData = [];
  let chartContent = null;

  switch (sectionTitle) {
    case "풍향/풍속":
      if (data.length > 0 && data.some(item => !isNaN(item.windDirect) && !isNaN(item.windSpeed))) {
        chartData = data.map(item => ({
          name: item.id, // 폴의 ID 사용
          windDirect: item.windDirect,
          windSpeed: item.windSpeed
        }));
        chartContent = (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="windDirect" fill="#8884d8" name="풍향 (°)" />
              <Bar dataKey="windSpeed" fill="#82ca9d" name="풍속 (m/s)" />
            </BarChart>
          </ResponsiveContainer>
        );
      } else {
        chartContent = <p>-</p>;
      }
      break;
    case "습도":
      if (data.length > 0 && data.some(item => !isNaN(item.humidity))) {
        chartData = data.map(item => ({
          name: item.id, // 폴의 ID 사용
          humidity: item.humidity
        }));
        chartContent = (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="humidity" fill="#8884d8" name="습도 (%)" />
            </BarChart>
          </ResponsiveContainer>
        );
      } else {
        chartContent = <p>-</p>;
      }
      break;
    case "강수량":
      if (data.length > 0 && data.some(item => !isNaN(item.rainfall))) {
        chartData = data.map(item => ({
          name: item.id, // 폴의 ID 사용
          rainfall: item.rainfall
        }));
        chartContent = (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="rainfall" fill="#8884d8" name="강수량 (mm)" />
            </BarChart>
          </ResponsiveContainer>
        );
      } else {
        chartContent = <p>-</p>;
      }
      break;

      case "기온":
        if (data.length > 0 && data.some(item => !isNaN(item.temperature))) {
          chartData = data.map(item => ({
            name: item.id, // 폴의 ID 사용
            temperature: item.temperature,
          }));

          chartContent = (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis
                  dataKey="name"
                  
                />
                <YAxis
                  domain={[
                    Math.floor(data.reduce((min, item) => Math.min(min, item.temperature), 0)), // 최소값 계산
                    Math.ceil(data.reduce((max, item) => Math.max(max, item.temperature), 0)), // 최대값 계산
                  ]}
                />
                <Tooltip />
                <Legend />
                <Bar dataKey="temperature" fill="#8884d8" name="온도 (°C)" />
                <ReferenceLine y={0} strokeWidth={1} stroke="#666666" 
                  label={{value:'0', position:'left', fill:"#666666"}}
                /> {/* 기준선 색상 유지 */}
              </BarChart>
            </ResponsiveContainer>
          );
        } else {
          chartContent = <p>-</p>;
        }
        break;





    default:
      chartContent = <p>-</p>;
  }

  return (
    <div className="section-container" style={getSectionStyle(index)}>
      {/* 섹션 제목 부분 */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h2 className='section-title'>{sectionTitle}</h2>
      </div>

      {/* 그래프 또는 '-' 표시 */}
      <div style={{ textAlign: "center", width: "100%", height: "250px" }}>
        {chartContent}
      </div>

      {/* 버튼 부분 */}
      <div>
        <button id="toggleBtn" onClick={() => handleToggleSection(index)}>
          <img
            id='expandImg'
            src={expandIcon}
            alt='확장 버튼'
            style={{ width: "15px", height: "15px" }}
          />
        </button>
      </div>
    </div>
  );
}

export default Section;
