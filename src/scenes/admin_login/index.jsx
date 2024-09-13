import React, { useRef, useState } from 'react'
import LogoIndex from '../../img/logos/logo.png'
import './login.css'
import {AdminService} from '../../service/AdminService'
import { Toast } from 'primereact/toast';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import 'primeicons/primeicons.css';

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const toast = useRef(true);

    const handleSubmit = async (e) => {
        e.preventDefault()
                await AdminService.login({
                    email,
                    password,
                })
                
    }

    return (
        <section >     
            <div className="container" >
            
            <a className='btn-cancelar' href='/'><h2><i className="pi pi-camera"></i> Biométrico</h2></a>
                <div className="top"></div>
                <div className="bottom"></div>
                <div className="center">
                    <img src={LogoIndex} id='logo-df' />
                    <form onSubmit={handleSubmit}>
                        <input
                            placeholder="Correo"
                            name="email"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                        <input placeholder="Contraseña"
                            name="password"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)} />
                        <button type='submit' className='corner-button'>Entrar</button>
                        <Toast ref={toast} />
                    </form>
                </div>
            </div>
        </section>
    )
}
export default Login