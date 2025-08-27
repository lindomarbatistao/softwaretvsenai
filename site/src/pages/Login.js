import { useState } from "react"
//Notificação
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//Rotas
import { useNavigate } from 'react-router-dom';
//Estilos
import '../css/Site.css'
//Global
import { url_server } from "../constants/global";
//Assets
const logo = require('../img/senai_pq.png');


function Login() {
    const [emailForm, setEmailForm] = useState("");
    const [senhaForm, setSenhaForm] = useState("");
    const navigate = useNavigate();

    const ValidarLogin = async (event) => {
        event.preventDefault();

        const envio = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailForm, senha: senhaForm })
        }

        try {
            const response = await fetch(url_server + '/api/login', envio);
            if (response.status === 200) {
                const data = await response.json();
                toast.success(data.result, {
                    autoClose: 3000,
                    pauseOnHover: true,
                    closeOnClick: true
                });
                sessionStorage.setItem('userLogged', true);
                sessionStorage.setItem('email', data.email);
                sessionStorage.setItem('reset', data.reset);
                sessionStorage.setItem('perfil_id', data.p);
                if (data.reset === 0) {
                    navigate('/home');
                } else {
                    navigate('/perfil');
                }
            } else if (response.status === 406) {
                toast.error("Usuário ou senha incorreto", {
                    autoClose: 3000,
                    pauseOnHover: true,
                    closeOnClick: true
                });
            } else {
                toast.error("Erro inesperado", {
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

    const bordaInput = {
        border: "1px solid #c1c1c1"
    };

    return (
        <section className="h-100 gradient-form bodyLogin">
            <ToastContainer />
            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-xl-10">
                        <div className="card rounded-3 text-black">
                            <div className="row g-0">
                                <div className="col-lg-6">
                                    <div className="card-body p-md-5 mx-md-4">
                                        <div className="text-center">
                                            <img src={logo} style={{ width: '185px', marginBottom: '40px' }} alt="logo" />
                                            <br></br>
                                            <h4 className="mt-1 mb-5 pb-1">Gestão de TVs - Zerbini</h4>
                                        </div>

                                        <form onSubmit={ValidarLogin}>
                                            <p style={{ textAlign: 'center', fontSize: '14px' }}>Utilize os campos abaixo para acessar sua conta</p>

                                            <div className="form-outline mb-4">
                                                <label className="form-label" htmlFor="form2Example11">E-mail corporativo</label>
                                                <input type="email" id="form2Example11" className="form-control" style={bordaInput} required
                                                    value={emailForm} onChange={(e) => setEmailForm(e.target.value)} />
                                            </div>

                                            <div className="form-outline mb-4">
                                                <label className="form-label" htmlFor="form2Example22">Senha</label>
                                                <input type="password" id="form2Example22" className="form-control" style={bordaInput} required
                                                    value={senhaForm} onChange={(e) => setSenhaForm(e.target.value)} />
                                            </div>

                                            <div className="text-center pt-1 mb-5 pb-1">
                                                <input type="submit" value="Acessar" className="btn btn-primary btn-block fa-lg gradient-custom-2 mb-3" />
                                                <a className="text-muted" href="#!">Esqueceu a senha?</a>
                                            </div>
                                        </form>

                                    </div>
                                </div>
                                <div className="col-lg-6 d-flex align-items-center gradient-custom-2">
                                    <div className="text-white px-3 py-4 p-md-5 mx-md-4">
                                        <h4 className="mb-4">Sistema para gerenciamento de publicações nas TVs da Escola SENAI Zerbini</h4>
                                        <p className="small mb-0">Utilize as ferramentas disponiblizadas no site para controlar as TVs e as publicações disponíveis em cada ambiente da escola.</p>
                                        <br></br>
                                        <p className="small mb-0">Caso encontre algum problema, entre em contato com: douglas.gaspar@sp.senai.br</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Login;