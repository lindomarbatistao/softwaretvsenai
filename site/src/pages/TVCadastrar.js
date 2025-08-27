import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
//Notificação
import { ToastContainer, toast } from 'react-toastify';
//Global
import { url_server } from "../constants/global";
//Páginas
import MenuLateral from "./MenuLateral";
import MenuTV from "./MenuTV";

function TVCadastrar() {
    const navigate = useNavigate();
    //Para preencher o elemento option
    const [locais, setLocais] = useState();
    //Para cadastrar uma nova TV
    const [locais_idForm, setLocais_idForm] = useState("");
    const [descricaoForm, setDescricaoForm] = useState("");

    //Validar sessão
    const voltarLogin = () => {
        if (sessionStorage.getItem('userLogged') === null) {
            navigate('/');
        }
    }

    useEffect(() => {
        voltarLogin();
        buscarLocais().then(() => {
            buscaTV();
        });
    }, []);

    const buscaTV = async () => {
        const parametrosURL = new URLSearchParams(window.location.search)
        const id = parametrosURL.get("id")

        if (id !== null) {
            const envio = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }

            try {
                const response = await fetch(url_server + '/api/tv/buscar/' + id, envio);
                response.json().then(data => {
                    if (response.status === 200) {
                        setDescricaoForm(data[0].descricao);
                        document.getElementById("selectLocais").value = data[0].locais_id;
                        document.getElementById("btEnvioForm").textContent = "Atualizar";

                        setLocais_idForm(data[0].locais_id);
                    } else {
                        toast.error("Erro ao buscar a TV", {
                            autoClose: 3000,
                            pauseOnHover: true,
                            closeOnClick: true
                        });
                    }
                });
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

    const atualizarTV = async () => {
        const parametrosURL = new URLSearchParams(window.location.search)
        const id = parametrosURL.get("id");

        if (locais_idForm === '') {
            alert('Selecione um local');
        } else {
            const envio = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ descricao: descricaoForm, locais_id: locais_idForm })
            }
            try {
                const response = await fetch(url_server + '/api/tv/atualizar/' + id, envio);
                if (response.status === 200) {
                    const data = await response.json();
                    toast.success(data.result, {
                        autoClose: 3000,
                        pauseOnHover: true,
                        closeOnClick: true
                    });
                    //Limpa os campos
                    setDescricaoForm("");
                    document.getElementById("selectLocais").value = 0;
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

    const envioForm = async (event) => {
        event.preventDefault();

        const txtBotao = document.getElementById("btEnvioForm").textContent;
        if (txtBotao === 'Cadastrar') {
            cadastrarTV();
        } else {
            atualizarTV();
        }
    }

    const buscarLocais = async () => {
        const envio = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }

        try {
            const response = await fetch(url_server + '/api/local/listar', envio);
            response.json().then(data => {
                if (response.status === 200) {
                    setLocais(data);
                } else {
                    toast.error("Erro ao buscar lista de locais", {
                        autoClose: 3000,
                        pauseOnHover: true,
                        closeOnClick: true
                    });
                }
            });
        } catch (error) {
            toast.error("Erro inesperado", {
                autoClose: 3000,
                pauseOnHover: true,
                closeOnClick: true
            });
            console.log(">>>>>>>>>> " + error)
        }
    }

    const cadastrarTV = async () => {
        if (locais_idForm === '') {
            alert('Selecione um local');
        } else {
            const envio = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ descricao: descricaoForm, locais_id: locais_idForm })
            }
            try {
                const response = await fetch(url_server + '/api/tv/cadastrar', envio);
                if (response.status === 200) {
                    const data = await response.json();
                    toast.success(data.result, {
                        autoClose: 3000,
                        pauseOnHover: true,
                        closeOnClick: true
                    });
                    //Limpa os campos
                    setDescricaoForm("");
                    document.getElementById("selectLocais").value = 0;
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


    return (
        <div className="row">
            <MenuLateral />
            <div className="col-10">
                <MenuTV />

                <form className="formMargem" onSubmit={envioForm}>
                    <div className="col-md-12">
                        <label htmlFor="exampleInputEmail1">Local</label>
                        <select className="form-control" id="selectLocais" onChange={(e) => setLocais_idForm(e.target.value)}>
                            <option key="0">Selecione...</option>
                            {locais &&
                                locais.map((locais) => (
                                    <option key={locais.id} value={locais.id}>{locais.nome}</option>
                                ))}
                        </select>
                    </div>

                    <div className="col-md-12">
                        <label htmlFor="descricaoTV">Descrição da TV</label>
                        <input type="text" className="form-control" id="descricaoTV" required value={descricaoForm} onChange={(e) => setDescricaoForm(e.target.value)} />
                    </div>

                    <div className="margem"></div>

                    <button type="submit" id="btEnvioForm" className="btn btn-primary">Cadastrar</button>
                </form>
            </div>


            <ToastContainer />
        </div>
    );

};

export default TVCadastrar;