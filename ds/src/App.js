// App.js
import { Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import "./Styles/App.css";
import Main from "./Main.js";
import Planner from "./Planner.js"; // planner.js 임포트
import Dashboard from "./Dashboard.js"; // dashboard.js 임포트
import Analysis from "./Analysis.js";
import Alerts from "./Alerts.js";
import Trading from "./Trading.js";
import Settings from "./Settings.js";
import Resources from "./Resources.js";

const theme = createTheme();

function App() {

  return (
    <ThemeProvider theme={theme}>
      <div className="App">

        {/* 라우트 설정 */}
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/trading" element={<Trading />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/resources" element={<Resources />} /> 
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
