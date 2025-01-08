import React from 'react';
import graph from '../Styles/image/graph.png';
import graph2 from '../Styles/image/graph2.png';
import expandIcon from '../Styles/image/expand_button.png';

function Section({
  index,
  expandedSection,
  handleToggleSection,
  selectedTint,
  handleButtonClick,
}) {

  // 섹션 이름 배열 (풍향, 풍속, 습도, 강수량 등)
  const sectionTitles = ["풍향/풍속", "습도", "강수량", "기온"];

  const getSectionStyle = (index) => {
    const baseStyle = {
      backgroundColor: "white",
      transition: "all 0.3s ease",
      overflow: "hidden",
      position: "relative",
      transformOrigin: "top left",
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

  const getImageStyle = () => {
    if (expandedSection === index) {
      switch (selectedTint) {
        case "red":
          return { filter: "sepia(100%) saturate(200%) hue-rotate(0deg)" };
        case "orange":
          return { filter: "sepia(100%) saturate(200%) hue-rotate(30deg)" };
        case "yellow":
          return { filter: "sepia(100%) saturate(200%) hue-rotate(60deg)" };
        default:
          return {};
      }
    }
    return {};
  };

  return (
    <div key={index} className="section" style={getSectionStyle(index)}>
      {/* 섹션 제목 부분 */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h2 style={{ color: "black", fontSize: "24px", fontWeight: "bold" }}>{sectionTitles[index]}</h2>
   
      </div>

      {/* 그래프 이미지 */}
      <div style={{ textAlign: "center" }}>
        <img
          src={index % 2 === 0 ? graph : graph2}
          alt={`graph${index + 1}`}
          width="400px"
          style={getImageStyle()}
        />
      </div>

      {/* 버튼 부분 */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button id="toggleBtn" onClick={() => handleToggleSection(index)}>
          <img id='expandImg'
            src={expandIcon}
            alt='확장 버튼'
          />
        </button>
      </div>

      {expandedSection === index && (
        <div style={{ position: "absolute", bottom: "5px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "30px" }}>
          <button onClick={() => handleButtonClick("red")}>일봉</button>
          <button onClick={() => handleButtonClick("orange")}>주봉</button>
          <button onClick={() => handleButtonClick("yellow")}>월봉</button>
        </div>
      )}
    </div>
  );
}

export default Section;
