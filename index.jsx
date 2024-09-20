/*import { preventDefault } from '@fullcalendar/core';*/
import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import  AttendanceService  from '../../service/AttendanceService'

const Formulario = () => {
    const webcamRef = useRef(null);
    const [pinEmploye, setPinEmploye] = useState('');
    const [state, setState] = useState('');
    const [photo, setPhoto] = useState(null);
    


    let takePhoto = async () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setPhoto(imageSrc);
    }

    let handleSubmit = async (e) => {
        e.preventDefault()
        
        takePhoto()

        // console.log(photo);                              
        await AttendanceService.createArrival({ 
            pinEmploye, 
            state, 
            photo   });                                                             
    }


    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="pinEmploye"
                value={pinEmploye}
                onChange={event => setPinEmploye(event.target.value)}
            />
            <input
                type="radio"
                name="state"
                value="horaDeLlegada"
                checked={state === 'horaDeLlegada'}
                onChange={event => setState(event.target.value)}
            /> Hora de llegada
            <input
                type="radio"
                name="state"
                value="salidaAlmuerzo"
                checked={state === 'salidaBreak1'}
                onChange={event => setState(event.target.value)}
            /> Salida Break 1
            <input
                type="radio"
                name="state"
                value="salidaAlmuerzo"
                checked={state === 'salidaBreak1'}
                onChange={event => setState(event.target.value)}
            /> Entrada Break 1
            <input
                type="radio"
                name="state"
                value="salidaAlmuerzo"
                checked={state === 'entradaBreak1'}
                onChange={event => setState(event.target.value)}
            /> Salida almuerzo test
            <input
                type="radio"
                name="state"
                value="entradaAlmuerzo"
                checked={state === 'salidaBreak2'}
                onChange={event => setState(event.target.value)}
            /> Entrada almuerzo
            <input
                type="radio"
                name="state"
                value="salidaAlmuerzo"
                checked={state === 'entradaBreak2'}
                onChange={event => setState(event.target.value)}
            /> Salida Break 2
            <input
                type="radio"
                name="state"
                value="salidaAlmuerzo"
                checked={state === 'salidaAlmuerzo'}
                onChange={event => setState(event.target.value)}
            /> Entrada Break 2
            <input
                type="radio"
                name="state"
                value="horaDeSalida"
                checked={state === 'horaDeSalida'}
                onChange={event => setState(event.target.value)}
            /> Hora de salida
            <Webcam
                audio={false}
                height={320}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={480}
            />

            <button type="submit" onClick={takePhoto}>Enviar</button>
        </form>
    );
}

export default Formulario;