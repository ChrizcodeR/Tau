import { Box, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import { EmployeeService } from "../../service/EmployeeService";
import { PrimeIcons } from 'primereact/api'
import { Menubar } from 'primereact/menubar';
import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                    
import "primeicons/primeicons.css";
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import Swal from 'sweetalert2'
import './custom.css'
import {ScheduleService} from "../../service/ScheduleService";
/*import moment from "moment";*/
import ScheduleManage from "../schedule_manager";
import { Translate } from "../../tools/translate";
import '/node_modules/primeflex/primeflex.css'
/*import { Toolbar } from "primereact/toolbar";*/
/*import { width } from "@mui/system";*/

const Team = () => {

  const [employes, setEmployes] = useState([]);
  const [employee, setEmployee] = useState({});
  const [horary, setHorary] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showModalHorary, setShowModalHorary] = useState(false);
  const [saveSucces, setSaveSucces] = useState(false);

  const mapSchedules = (schedules) => {
    return schedules.map(schedule => {
      return { label: schedule.arrival + ' - ' + schedule.departure, value: schedule.id_sch}
    });
  }

  useEffect(() => {
    ScheduleService.getAllSchedule()
      .then(res => {
        setHorary(mapSchedules(res));
      })
  }, [!saveSucces]);

  useEffect(() => {
    EmployeeService.getAll().then(res => setEmployes(res));
  }, [!saveSucces])


  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleSelectEmployee = (employee) => {
    deselectAllExcept(employee);
    employee.selected = !employee.selected;
    setSelectedEmployee(employee);
  }

  const deselectAllExcept = (except) => {
    employes.forEach((employe) => {
        if (employe !== except) {
            employe.selected = false;
        }
    });
  };
  
  // CONTENIDO (ARRAYS) 
  const items = [

    {
      label: 'Nuevo',
      icon: PrimeIcons.PLUS,
      command: () => { showSaveModal(true) }
    },
    {
      label: 'Editar',
      icon: PrimeIcons.PENCIL,
      command: () => { edit() }
    },
    {
      label: 'Eliminar',
      icon: PrimeIcons.TRASH,
      command: () => { deleteEmployeeQuestion() }
    },
    {
      label: 'exportar excel',
      icon: PrimeIcons.FILE_EXCEL,
      command: () => { exportExcel() }
    },
    {
      label: 'ajustar horarios',
      icon: PrimeIcons.CLOCK,
      command: () => { editHorary() }
    }
  ]

  const nCompany = [
    { label: 'Cascoloco', value: 'Cascoloco' },
    { label: 'Distri Fabrica', value: 'DistriFabrica' },
    { label: 'Mottodo Outtlet', value: 'Mottodo Outtlet' },

  ];

  const nPosition = [
    { label: 'Asesor Comercial', value: 'Asesor Comercial' },
    { label: 'Lider Tienda', value: 'Lider Tienda' }

  ];

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
      field: "company",
      headerName: "Empresa",
      flex: 1,
    },
    {
      field: "position",
      headerName: "Cargo",
      flex: 1,
    },
    {
      field: "arrival",
      headerName: "Horario",
      flex: 1,
    },
    {
      field: "departure",
      headerName: "Horario",
      flex: 1,
    },
    {
      field: "fechacreacion",
      headerName: "Creado",
      flex: 1,
    }
  ];

  // FUNCIONES 

  // CREAR USUARIOS 

  const save = () => {

    if (!employee?.first_name || !employee?.last_name || !employee?.company || !employee?.position || !employee?.schedule_id ) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Es necesario llenar todos los campos',
        showConfirmButton: false,
        timer: 1500,
        customClass: {
          container: 'my-container-class'
        }
      })
      return
    } else {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Registro exitoso',
        showConfirmButton: false,
        timer: 1500
      })
      setShowModal(false)
    }

    EmployeeService.save(employee).then(res => {
      setEmployee({})
      setShowModal(false);
      setSaveSucces(!saveSucces);
    });



  };

  const renderFooter = () => {
    return (
      <div>
        <Button label="Cancelar" icon="pi pi-times" onClick={() => setShowModal(false)} className="p-button-text" />
        <Button label="Confirmar" icon="pi pi-check" onClick={() => save()} autoFocus />
      </div>
    );
  }

  // EDITAR USUARIOS 

  const showSaveModal = () => {
    setShowModal(true);
    setSaveSucces(!saveSucces);
  };

  const edit = () => {
    setShowModal(true);
  }
  const editHorary = () => {
    setShowModalHorary(true);
  }

  const getInfo = (id) => {
    EmployeeService.getInfo(id).then(data => setEmployee(data))
  }

  const deleteEmployeeQuestion = () =>{
    Swal.fire({
      title: '¿Estas seguro de eliminar este registro?',
      text: "No podras revertir esta accion",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: 'rgb(83, 75, 240)',
      confirmButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteEmployee(employee?.id)
        Swal.fire(
          'Eliminado!',
          'El registro ha sido eliminado',
          'success'
        )
      }
    })
  }

  const deleteEmployee = async (id) => {
    await EmployeeService.delete(id);
    const res = await EmployeeService.getAll();
    setEmployes(res);
  }

  const exportExcel = () => {
    import('xlsx').then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(employes);
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
        width: "750px"
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
        <DataGrid rows={employes} /* checkboxSelection  */
          selection={selectedEmployee} onSelectionModelChange={e => getInfo(e)}
          dataKey="id" columns={columns} localeText={Translate} 
          components={{ Toolbar: GridToolbar }} />
        <Dialog header="Empleados" visible={showModal} style={{ width: '45vw' }} footer={renderFooter()} onHide={setShowModal} selectedEmpleado>
          <form id="empleado-form" >
            <div className="formgrid grid">
              <div className="field col">
                <span className="p-float-label">
                  <InputText name="nombre" value={employee?.first_name} onChange={({ target }) => setEmployee({ ...employee, ['first_name']: target.value })} style={{ width: '400px' }} />
                  <label htmlFor="fist_name">Nombre</label>
                </span>
              </div>
              <div className="field col">
                <span className="p-float-label " >
                  <InputText name="apellido" value={employee?.last_name} onChange={({ target }) => setEmployee({ ...employee, ['last_name']: target.value })} style={{ width: '400px' }} />
                  <label htmlFor="last_name">Apellido</label>
                </span>
              </div>
              <div className="field col">
                <Dropdown name="empresa" value={employee?.company} options={nCompany} onChange={({ target }) => setEmployee({ ...employee, ['company']: target.value })} placeholder="Selecciona una empresa" style={{ width: "400px" }} />
              </div>
              <div className="field col">
                <Dropdown name="cargo" value={employee?.position} options={nPosition} onChange={({ target }) => setEmployee({ ...employee, ['position']: target.value })} placeholder="Selecciona un cargo" style={{ width: "400px" }} />
              </div>
              <div className="field col">
                <Dropdown name="horario" value={employee?.schedule_id} options={horary} onChange={({ target }) => setEmployee({ ...employee, ['schedule_id']: target.value })} placeholder="Selecciona un horario" style={{ width: "400px" }} />
              </div> 
            </div>
          </form>


        </Dialog>

        <Dialog visible={showModalHorary} style={{ /* width: '30vw', */ backgroundColor:"none" }} onHide={() => setShowModalHorary(false)} >
          <ScheduleManage />
        </Dialog>

      </Box>
    </Box>
  );
};

export default Team;