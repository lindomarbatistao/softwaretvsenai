import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
//Notificação
import { ToastContainer, toast } from 'react-toastify';
//Global
import { url_server } from "../constants/global";

import MenuLateral from './MenuLateral';

function Perfil() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [senhaRepete, setSenhaRepete] = useState("");

    //Validar sessão
    const voltarLogin = () => {
        if (sessionStorage.getItem('userLogged') === null) {
            navigate('/');
        } else {
            setEmail(sessionStorage.getItem('email'));
        }
    }

    const envioForm = async (event) => {
        event.preventDefault();

        if (senha.length <= 3) {
            alert('A senha precisa ter ao menos 4 caracteres');
        } else if (senha !== senhaRepete) {
            alert('As senhas não são iguais');
        } else {
            const envio = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email, senha: senha })
            }
            try {
                const response = await fetch(url_server + '/api/login/senha', envio);
                if (response.status === 200) {
                    const data = await response.json();
                    toast.success(data.result, {
                        autoClose: 3000,
                        pauseOnHover: true,
                        closeOnClick: true
                    });
                    //Limpa os campos
                    setSenha("");
                    setSenhaRepete("");
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
    }

    useEffect(() => {
        voltarLogin();
    }, []);

    return (
        <div className="row">
            <MenuLateral />
            <div className="col-10" >
                <div className="menuSuperior">
                    <span>Atualização de perfil</span>
                </div>
                <form className="formMargem" onSubmit={envioForm}>
                    <div className="col-md-12">
                        <label htmlFor="email">E-mail</label>
                        <input type="text" className="form-control" readonly disabled="disabled" name="email" id="email" value={email} />
                    </div>

                    <div className="col-md-12">
                        <label htmlFor="senhaNova">Senha nova</label>
                        <input type="password" className="form-control" name="senhaNova" id="senhaNova" value={senha} onChange={(e) => setSenha(e.target.value)} />
                    </div>

                    <div className="col-md-12">
                        <label htmlFor="senhaRepete">Repetir a senha nova</label>
                        <input type="password" className="form-control" name="senhaRepete" id="senhaRepete" value={senhaRepete} onChange={(e) => setSenhaRepete(e.target.value)} />
                    </div>

                    <div className="margem"></div>

                    <button type="submit" id="btEnvioForm" className="btn btn-primary">Atualizar senha</button>

                </form>
            </div>
            <ToastContainer />
        </div>
    );
}

export default Perfil;