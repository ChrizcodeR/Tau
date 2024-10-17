import React, { useRef, useState } from "react";
import Swal from "sweetalert2";
import Webcam from "react-webcam";
import Animate from "./animate";
import Fecha from "../../components/Fecha";
import logoDistri from "../../img/logos/logo.png";
import { AttendanceService } from "../../service/AttendanceService";
import "./style.css";
import "primeicons/primeicons.css";

const Formulario = () => {
  const webcamRef = useRef(null);
  const [codigo_tr, setPinEmploye] = useState("");
  const [tipo, setState] = useState("");

  const takePhoto = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      console.log("Foto capturada:", imageSrc);
      return imageSrc; // Devuelve la imagen capturada
    } else {
      console.error("Error al capturar la foto.");
      return null; // Retorna null si no se captura la imagen
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const imageSrc = await takePhoto(); // Espera a que la foto sea capturada
    if (!imageSrc) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo capturar la foto.",
      });
      return;
    }

    console.log("Código del trabajador:", codigo_tr);
    console.log("Tipo:", tipo);
    console.log("Foto:", imageSrc);

    if (codigo_tr === "" || tipo === "") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Todos los campos son obligatorios!",
      });
    } else {
      try {
        // Crear el objeto a enviar
        const requestData = {
          codigo_tr,
          tipo,
          foto: imageSrc, // Usa imageSrc aquí
        };

        // Imprimir el JSON en la consola
        console.log("Datos enviados:", JSON.stringify(requestData, null, 2));

        // Enviar los datos al servicio
        const response = await AttendanceService.validateAndCreateArrival(
          codigo_tr,
          requestData
        );

        // Extraer el nombre del empleado y el mensaje de la respuesta
        const empleadoNombre = response.nombre;
        const mensaje = response.success;
        //const estado = response.estado;
        // Verificación condicional para mostrar "estado" solo si no es undefined
        const estado = response.estado
          ? `<strong> Tu estado es: ${response.estado}</strong>`
          : "";
        console.log(estado);

        Swal.fire({
          icon: "success",
          title: `${mensaje}`,
         html: `<h2>${empleadoNombre}</h2></p><h3>${estado}</h3>`,
          confirmButtonText: "Cool",
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "¡Ups! algo salio mal",
          text: error.message,
        });
      }
    }
  };

  return (
    <section className="container-attendence">
      <Animate />
      <a
        className="btn-admin-login"
        href="https://stagingbacklaravel-production.up.railway.app/login"
      >
        <h2>
          <i className="pi pi-box  "></i> Dashboard
        </h2>
      </a>
      <a
        className="btn-admin-login"
        href="https://stagingbacklaravel-production.up.railway.app/login"
      >
        <h2>
          <i className="pi pi-box  "></i> Dashboard
        </h2>
      </a>
      <div className="contenido">
        <div className="content1">
          <div className="cam-content">
            <img src={logoDistri} className="logo-distri" alt="logo-distri" />
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={380}
            />
          </div>
          <div className="date">
            <Fecha />
          </div>
        </div>
        <div className="content2">
          <form onSubmit={handleSubmit}>
            <div className="radiogroup">
              <div className="idemploye">
                <label>
                  <h3>PIN COLABORADOR</h3>
                </label>
                <input
                  className="id-input"
                  placeholder="Ingresa tu pin"
                  type="text"
                  name="codigo_tr"
                  value={codigo_tr}
                  onChange={(event) => setPinEmploye(event.target.value)}
                />
              </div>
              <div className="wrapper">
                <input
                  className="state"
                  id="arrival"
                  type="radio"
                  name="entrada"
                  value="entrada"
                  checked={tipo === "entrada"}
                  onChange={(event) => setState(event.target.value)}
                />
                <label className="label" htmlFor="arrival">
                  <div className="indicator"></div>
                  <span className="text"> Hora llegada</span>
                </label>
              </div>
              <div className="wrapper">
                <input
                  className="state"
                  id="breakIn1"
                  type="radio"
                  name="inicio_break1"
                  value="inicio_break1"
                  checked={tipo === "inicio_break1"}
                  onChange={(event) => setState(event.target.value)}
                />
                <label className="label" htmlFor="breakIn1">
                  <div className="indicator"></div>
                  <span className="text"> Salida Break 1</span>
                </label>
              </div>
              <div className="wrapper">
                <input
                  className="state"
                  id="breakOut1"
                  type="radio"
                  name="fin_break1"
                  value="fin_break1"
                  checked={tipo === "fin_break1"}
                  onChange={(event) => setState(event.target.value)}
                />
                <label className="label" htmlFor="breakOut1">
                  <div className="indicator"></div>
                  <span className="text"> Entrada Break 1</span>
                </label>
              </div>

              <div className="wrapper">
                <input
                  className="state"
                  id="lunchIn"
                  type="radio"
                  name="salida_almuerzo"
                  value="salida_almuerzo"
                  checked={tipo === "salida_almuerzo"}
                  onChange={(event) => setState(event.target.value)}
                />
                <label className="label" htmlFor="lunchIn">
                  <div className="indicator"></div>
                  <span className="text"> Salida almuerzo</span>
                </label>
              </div>
              <div className="wrapper">
                <input
                  className="state"
                  id="lunchOut"
                  type="radio"
                  name="entrada_almuerzo"
                  value="entrada_almuerzo"
                  checked={tipo === "entrada_almuerzo"}
                  onChange={(event) => setState(event.target.value)}
                />
                <label className="label" htmlFor="lunchOut">
                  <div className="indicator"></div>
                  <span className="text"> Entrada almuerzo</span>
                </label>
              </div>
              <div className="wrapper">
                <input
                  className="state"
                  id="breakIn2"
                  type="radio"
                  name="inicio_break2"
                  value="inicio_break2"
                  checked={tipo === "inicio_break2"}
                  onChange={(event) => setState(event.target.value)}
                />
                <label className="label" htmlFor="breakIn2">
                  <div className="indicator"></div>
                  <span className="text"> Salida Break 2</span>
                </label>
              </div>
              <div className="wrapper">
                <input
                  className="state"
                  id="breakOut2"
                  type="radio"
                  name="fin_break2"
                  value="fin_break2"
                  checked={tipo === "fin_break2"}
                  onChange={(event) => setState(event.target.value)}
                />
                <label className="label" htmlFor="breakOut2">
                  <div className="indicator"></div>
                  <span className="text"> Entrada Break 2</span>
                </label>
              </div>

              <div className="wrapper">
                <input
                  className="state"
                  id="departure"
                  type="radio"
                  name="salida"
                  value="salida"
                  checked={tipo === "salida"}
                  onChange={(event) => setState(event.target.value)}
                />
                <label className="label" htmlFor="departure">
                  <div className="indicator"></div>
                  <span className="text"> Hora salida</span>
                </label>
              </div>
            </div>
            <button type="submit" className="btn-save">
              <span className="text">REGISTRAR</span>
              <span className="icon">
                <i className="pi pi-check"></i>
              </span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Formulario;
