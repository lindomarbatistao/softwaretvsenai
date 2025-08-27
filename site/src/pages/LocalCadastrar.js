import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
//Notificação
import { ToastContainer, toast } from 'react-toastify';
//Global
import { url_server } from "../constants/global";
//Páginas
import MenuLateral from "./MenuLateral";
import MenuTV from "./MenuTV";

function LocalCadastrar() {
    const navigate = useNavigate();
    //Para cadastrar um novo local
    const [nomeForm, setNomeForm] = useState("");

    //Validar sessão
    const voltarLogin = () => {
        if (sessionStorage.getItem('userLogged') === null) {
            navigate('/');
        }
    }

    useEffect(() => {
        voltarLogin();
    }, []);

    const envioForm = async (event) => {
        event.preventDefault();

        cadastrarLocal();
    }

    const cadastrarLocal = async () => {

        const envio = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome: nomeForm })
        }
        try {
            const response = await fetch(url_server + '/api/local/cadastrar', envio);
            if (response.status === 200) {
                const data = await response.json();
                toast.success(data.result, {
                    autoClose: 3000,
                    pauseOnHover: true,
                    closeOnClick: true
                });
                //Limpa os campos
                setNomeForm("");
            } else {
                const data = await response.json();
                toast.error(data.result, {
                    autoClose: 3000,
                    pauseOnHover: true,
                    closeOnClick: true
                });
            }
        } catch (error) {
            toast.error("Erro inesperado", {
                autoClose: 3000,
                pauseOnHover: true,
                closeOnClick: true
            });
            console.log(">>>>>>>>>> " + error)
        }

    }


    return (
        <div className="row">
            <MenuLateral />
            <div className="col-10">
                <MenuTV />

                <form className="formMargem" onSubmit={envioForm}>

                    <div className="col-md-12">
                        <label htmlFor="descricaoTV">Nome do local</label>
                        <input type="text" className="form-control" id="descricaoTV" required value={nomeForm} onChange={(e) => setNomeForm(e.target.value)} />
                    </div>

                    <div className="margem"></div>

                    <button type="submit" id="btEnvioForm" className="btn btn-primary">Cadastrar</button>
                </form>
            </div>


            <ToastContainer />
        </div>
    );

};

export default LocalCadastrar;