// App.js
import { Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import "./Styles/App.css";
import Main from "./Mainpage.js";
import Planner from "./Planner.js"; // planner.js 임포트


const theme = createTheme();

function App() {

  return (
    <ThemeProvider theme={theme}>
      <div className="App">

        {/* 라우트 설정 */}
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/planner" element={<Planner />} />
         
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
