import React, { useRef, useState } from "react";

//COMPONENTS
import Swal from "sweetalert2";
import Webcam from "react-webcam";
import Animate from "./animate";
import Fecha from "../../components/Fecha";


//IMAGES
// import bgLogin from '../../img/toolsImg/background-01.jpg'
import logoDistri from "../../img/logos/logo.png";

// SERVICES
import { AttendanceService } from "../../service/AttendanceService";

// STYLES
import "./style.css";
import "primeicons/primeicons.css";

const Formulario = () => {
  const webcamRef = useRef(null);
  const [pinEmploye, setPinEmploye] = useState("");
  const [state, setState] = useState("");
  const [photo, setPhoto] = useState(null);

  let takePhoto = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setPhoto(imageSrc);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    takePhoto();

    if (pinEmploye === "" || state === "") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Todos los campos son obligatorios!",
      });
    } else {
      await AttendanceService.validate(pinEmploye);

      await AttendanceService.createArrival({
        pinEmploye,
        state,
        photo,
      });
    }
  };

  return (
    <section className="container-attendence">
      <Animate />
      <a className="btn-admin-login" href="/login/admin">
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
            <Fecha/>
          </div>
        </div>
        <div className="content2">
          <form onSubmit={handleSubmit}>
            <div className="radiogroup">
              <div className="idemploye">
                <label>PIN EMPLEADO</label>
                <input
                  className="id-input"
                  placeholder="Escriba su pin"
                  type="text"
                  name="pinEmploye"
                  value={pinEmploye}
                  onChange={(event) => setPinEmploye(event.target.value)}
                />
                {/* <Link to={LoginAdmin}><button>swqwqw</button></Link> */}
              </div>
              <div className="wrapper">
                <input
                  className="state"
                  id="arrival"
                  type="radio"
                  name="arrival"
                  value="arrival"
                  checked={state === "arrival"}
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
                  name="breakIn1"
                  value="breakIn1"
                  checked={state === "breakIn1"}
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
                  name="breakOut1"
                  value="breakOut1"
                  checked={state === "breakOut1"}
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
                  id="breakIn"
                  type="radio"
                  name="breakIn"
                  value="breakIn"
                  checked={state === "breakIn"}
                  onChange={(event) => setState(event.target.value)}
                />
                <label className="label" htmlFor="breakIn">
                  <div className="indicator"></div>
                  <span className="text"> Salida almuerzo</span>
                </label>
              </div>
              <div className="wrapper">
                <input
                  className="state"
                  id="breakOut"
                  type="radio"
                  name="breakOut"
                  value="breakOut"
                  checked={state === "breakOut"}
                  onChange={(event) => setState(event.target.value)}
                />
                <label className="label" htmlFor="breakOut">
                  <div className="indicator"></div>
                  <span className="text"> Entrada almuerzo</span>
                </label>
              </div>
              <div className="wrapper">
                <input
                  className="state"
                  id="breakIn2"
                  type="radio"
                  name="breakIn2"
                  value="breakIn2"
                  checked={state === "breakIn2"}
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
                  name="breakOut2"
                  value="breakOut2"
                  checked={state === "breakOut2"}
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
                  name="departure"
                  value="departure"
                  checked={state === "departure"}
                  onChange={(event) => setState(event.target.value)}
                />
                <label className="label" htmlFor="departure">
                  <div className="indicator"></div>
                  <span className="text"> Hora salida</span>
                </label>
              </div>
            </div>
            <button type="submit" className="btn-save" onClick={takePhoto}>
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
