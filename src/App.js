import { Routes, Route, Redirect } from "react-router-dom";
import Dashboard from "./scenes/dashboard";
import EmployeManage from "./scenes/employe-manage";
import AttendanceManage from "./scenes/attendance_manage";
import ScheduleManage from "./scenes/schedule_manager";
import Invoices from "./scenes/invoices";
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import AdminLogin from "./scenes/admin_login";
import AttendanceLogin from "./scenes/attendance_login";
import Geography from "./scenes/geography";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/calendar/calendar";
import Page404 from "./scenes/page_404";

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
              <Route path="/*" element={<Page404 />} />
              <Route path="/manage/attendance" element={<AttendanceManage />} />
              {!token && <Route path="/" element={<AttendanceLogin />} />}
              {!token && <Route path="/login/admin" element={<AdminLogin />} />}
              {token && (
                <>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/manage/employe" element={<EmployeManage />} />
                  <Route path="/manage/schedule" element={<ScheduleManage />} />
                  <Route path="/invoices" element={<Invoices />} />
                  <Route path="/form" element={<Form />} />
                  <Route path="/bar" element={<Bar />} />
                  <Route path="/pie" element={<Pie />} />
                  <Route path="/line" element={<Line />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/geography" element={<Geography />} />
                </>
              )}
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
