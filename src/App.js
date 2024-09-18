import { Routes, Route  } from "react-router-dom";
import AttendanceLogin from "./scenes/attendance_login";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";

function App() {
  const [theme, colorMode] = useMode();

  const token = localStorage.getItem("token") || null;

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <main className="content">
            <Routes>
              {!token && <Route path="/" element={<AttendanceLogin />} />}
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
