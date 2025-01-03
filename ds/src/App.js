// App.js
import { Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import "./Styles/App.css";
import Main from "./1_Mainpage.js";
import Clebine from "./2_Clebinepage.js";
import Smartdrone from "./3_Smartdronepage.js";
import Management from "./4_Managementpage.js";
import TestPage from "./TestPage.js";
import SmartDrone_Details from "./3-1_Smartdrone_Details.js";


const theme = createTheme();

function App() {

  

  return (
    <ThemeProvider theme={theme}>
      <div className="App">

        {/* 라우트 설정 */}
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/clebinepage" element={<Clebine />} />
          <Route path="/Smartdronepage" element={<Smartdrone />} />
          <Route path="/Smartdronepage/:id" element={<SmartDrone_Details />} />
          <Route path="/managementpage" element={<Management />} />
          <Route path="/test" element={<TestPage />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
