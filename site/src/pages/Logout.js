import { useEffect } from "react"
//Rotas
import { useNavigate } from 'react-router-dom';

function Logout() {
    const navigate = useNavigate();

    function sair() {
        navigate('/');
        sessionStorage.removeItem('userLogged');
    }

    useEffect(() => {
        sair();
    }, []);

    return (
        <div></div>
    );
}

export default Logout;