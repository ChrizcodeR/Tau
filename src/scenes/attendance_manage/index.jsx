import { useEffect, useState } from "react";

// COMPONENTS 
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { PrimeIcons } from 'primereact/api'
import { Menubar } from 'primereact/menubar';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Translate } from "../../tools/translate";

// SERVICES 
import {AttendanceService} from '../../service/AttendanceService'

// STYLES 
import "primereact/resources/themes/lara-light-indigo/theme.css";  
import "primereact/resources/primereact.min.css";                  
import "primeicons/primeicons.css";
import '/node_modules/primeflex/primeflex.css'
import './custom.css'

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    const fetchData = async () => {
      const data = await AttendanceService.getAllAttendance();
      setAttendance(data);
    };
    fetchData();
  }, []);


  const formatTime = (time) => {
    if (!time) return '';
    let date = new Date(time);
    let options = { hour: 'numeric', minute: 'numeric' };
    return date.toLocaleTimeString('en-US', options);
  }
  const formatDate = (time) => {
    let date = new Date(time);
    let options = { day: '2-digit', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
  }


  const openDialog = (image) => {
    setVisible(true);
    setSelectedImage(image);
  }
  // CONTENIDO (ARRAYS) 
  const items = [
    {
      label: 'exportar excel',
      icon: PrimeIcons.FILE_EXCEL,
      command: () => { exportExcel() }
    }
  ]

  const columns = [
    {
      field: "pinEmploye",
      headerName: "PIN",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "first_name",
      headerName: "Nombre",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "last_name",
      headerName: "Apellido",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "date",
      headerName: "Fecha",
      flex: 1,
      renderCell: (params) => (
        <strong>{formatDate(params.value)}</strong>
      ),
    },
    {
      field: "arrival",
      headerName: "Llegada",
      flex: 1,
      renderCell: (params) => (
        <strong>{formatTime(params.value)}</strong>
      ),
    },
    {
      field: "breakIn",
      headerName: "Salida almuerzo",
      flex: 1,
      renderCell: (params) => (
        <strong>{formatTime(params.value)}</strong>
      ),
    },
    {
      field: "breakOut",
      headerName: "Entrada almuerzo",
      flex: 1,
      renderCell: (params) => (
        <strong>{formatTime(params.value)}</strong>
      ),
    },
    {
      field: "departure",
      headerName: "Salida",
      flex: 1,
      renderCell: (params) => (
        <strong>{formatTime(params.value)}</strong>
      ),
    },
    {
      field: "photo",
      headerName: "Foto",
      flex: 2,
      cellClassName: "image-in-table",
      renderCell: (params) => (
        <img src={params.value} onClick={() => openDialog(params.value)} />
      ),
    },

  ];

  const exportExcel = () => {
    import('xlsx').then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(attendance);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      saveAsExcelFile(excelBuffer, 'employes');
    });
  }

  const saveAsExcelFile = (buffer, fileName) => {
    import('file-saver').then(module => {
      if (module && module.default) {
        let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data = new Blob([buffer], {
          type: EXCEL_TYPE
        });

        module.default.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
      }
    });
  }

  const exportBtn = () => {
    return (
      <Button type="button" label="Exportar Registros" icon="pi pi-download" onClick={exportExcel} className="p-button-success mr-2" data-pr-tooltip="XLS" />
    )
  }

  return (

    <Box m="20px">
      <Header title="EMPLEADOS" subtitle="Administración de empleados" />

      <Menubar model={items} style={{
        justifyContent: "center",
        background: "none",
        /* border: "none", */
        width: "200px"
      }} />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid rows={attendance}
          dataKey="id" columns={columns}
          className="custom-row-height"
          components={{ Toolbar: GridToolbar }}
          localeText={Translate}  />
      </Box>
      <Dialog visible={visible} header="Foto" modal={true} onHide={() => setVisible(false)}>
        <img src={selectedImage} style={{ width: "100%", borderRadius: "10px" }} />
      </Dialog>
    </Box>
  );
};


export default Attendance;