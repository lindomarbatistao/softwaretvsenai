import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
//Notificação
import { ToastContainer, toast } from 'react-toastify';
//Páginas
import MenuLateral from "./MenuLateral";
import MenuTV from "./MenuTV";
//Global
import { url_server } from "../constants/global";
//Confirmação modal
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';


function TV() {
    const navigate = useNavigate();
    //Para listar as TVs
    const [tvs, setTvs] = useState("");


    //Validar sessão
    const voltarLogin = () => {
        if (sessionStorage.getItem('userLogged') === null) {
            navigate('/');
        }
    }

    //Buscar as TVs cadastradas
    const buscaTVs = async () => {
        const envio = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }

        try {
            const response = await fetch(url_server + '/api/tv/listar', envio);
            response.json().then(data => {
                if (response.status === 200) {
                    setTvs(data);
                } else {
                    toast.error("Erro ao buscar lista de TVs", {
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

    //Apagar TV da lista
    const apagarTV = async (tvId) => {
        confirmAlert({
            title: 'Remover TV',
            message: 'Deseja realmente remover a TV?',
            buttons: [
                {
                    label: 'Sim',
                    onClick: async () => {
                        const envio = {
                            method: 'DELETE',
                            headers: { 'Content-Type': 'application/json' }
                        }
                        try {
                            const response = await fetch(url_server + '/api/tv/apagar/' + tvId, envio);
                            response.json().then(data => {
                                if (response.status === 200) {
                                    toast.success("TV removida", {
                                        autoClose: 2000,
                                        pauseOnHover: true,
                                        closeOnClick: true
                                    });
                                    document.getElementById("linhatabela" + tvId).remove();
                                } else {
                                    toast.error("Erro ao remover TV", {
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
                },
                {
                    label: 'Não',
                    onClick: () => { }
                }
            ]
        });
    }

    //Editar TV
    const editarTV = (tvId) => {
        navigate('/tvadd?id=' + tvId);
    }

    useEffect(() => {
        voltarLogin();
    }, []);

    useEffect(() => {
        buscaTVs();
    }, []);

    return (
        <div className="row">
            <MenuLateral />
            <div className="col-10">
                <MenuTV />
                <div className="conteudoTVs">
                    <h2>Gerencie as TVs cadastradas</h2>
                    <div id="listaTVs">
                        <div className="bg-white border rounded-5">
                            <section className="w-100 p-4">
                                <div id="datatable-custom" data-mdb-hover="true" className="datatable datatable-hover">
                                    <div className="datatable-inner table-responsive ps" style={{ overflow: "auto", position: "relative" }}>
                                        <table className="table datatable-table">
                                            <thead className="datatable-header">
                                                <tr>
                                                    <th scope="col"><i className="datatable-sort-icon fas fa-arrow-up"><b>Descrição</b></i></th>
                                                    <th scope="col"><i className="datatable-sort-icon fas fa-arrow-up"><b>Local</b></i></th>
                                                    <th scope="col"><i className="datatable-sort-icon fas fa-arrow-up"><b>Ações</b></i></th>
                                                </tr>
                                            </thead>
                                            <tbody className="datatable-body">
                                                {tvs && tvs.map((tvs) => (
                                                    <tr data-mdb-index={tvs.id} key={tvs.id} id={"linhatabela" + tvs.id}>
                                                        <td data-mdb-field="position">{tvs.descricao}</td>
                                                        <td data-mdb-field="name">{tvs.nome}</td>
                                                        <td data-mdb-field="contact">
                                                            <button className="call-btn btn btn-outline-primary btn-sm" onClick={() => { editarTV(tvs.id) }}><i className="bi bi-pencil-square"></i></button>
                                                            <button className="call-btn btn btn-outline-primary btn-sm" onClick={() => { apagarTV(tvs.id) }}><i className="bi bi-trash"></i></button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default TV;