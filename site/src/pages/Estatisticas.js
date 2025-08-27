import { useEffect, useState } from 'react';
//Notificação
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//Rotas
import { useNavigate } from 'react-router-dom'
//Estilos
import '../css/Site.css'

import MenuLateral from './MenuLateral';


function Estatisticas() {
    const navigate = useNavigate();

    //Validar sessão
    const voltarLogin = () => {
        if (sessionStorage.getItem('userLogged') === null) {
            navigate('/');
        }
    }

    useEffect(() => {
        voltarLogin();
    }, []);

    return (
        <div className="row">
            <MenuLateral />
            <div className="col-10" >
                <div className="menuSuperior">
                    <span>Estatísticas de acesso e uso</span>
                </div>
            </div>
        </div>
    )

}

export default Estatisticas;