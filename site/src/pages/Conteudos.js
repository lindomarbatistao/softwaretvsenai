import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
//Notificação
import { ToastContainer, toast } from 'react-toastify';
//Páginas
import MenuLateral from "./MenuLateral";
import MenuConteudo from "./MenuConteudo";
//Global
import { url_server } from "../constants/global";
//Confirmação modal
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';


function Conteudos() {
    const navigate = useNavigate();
    //Para listar os conteudos
    const [conteudos, setConteudos] = useState("");
    //Para buscar as TVs
    const [tvIdForm, SetTvIdForm] = useState("");
    //Para preencher o elemento option
    const [tvs, setTvs] = useState("");


    //Validar sessão
    const voltarLogin = () => {
        if (sessionStorage.getItem('userLogged') === null) {
            navigate('/');
        }
    }

    //Buscar os conteúdos cadastrados
    const buscaConteudos = async (idTV) => {
        if (idTV != 0) {
            const envio = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }

            try {
                const response = await fetch(url_server + '/api/conteudo/listar/' + idTV, envio);
                response.json().then(data => {
                    if (response.status === 200) {
                        setConteudos(data);
                        document.getElementById("listaTVs").style.visibility = "visible";
                    } else if (response.status === 202) {
                        setConteudos("");
                        toast.warn("TV sem conteúdo cadastrado", {
                            autoClose: 3000,
                            pauseOnHover: true,
                            closeOnClick: true
                        });
                    } else {
                        toast.error("Erro ao buscar lista de conteúdos", {
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
        } else {
            setConteudos("");
            document.getElementById("listaTVs").style.visibility = "hidden";
            toast.warn("Nenhuma TV selecionada", {
                autoClose: 3000,
                pauseOnHover: true,
                closeOnClick: true
            });
        }

    }

    //Apagar TV da lista
    const apagarConteudo = async (conteudoId) => {
        confirmAlert({
            title: 'Remover conteúdo',
            message: 'Deseja realmente remover o conteúdo? ',
            buttons: [
                {
                    label: 'Sim',
                    onClick: async () => {
                        const envio = {
                            method: 'DELETE',
                            headers: { 'Content-Type': 'application/json' }
                        }
                        try {
                            const response = await fetch(url_server + '/api/conteudo/apagar/' + conteudoId, envio);
                            response.json().then(data => {
                                if (response.status === 200) {
                                    toast.success("Conteúdo removido", {
                                        autoClose: 2000,
                                        pauseOnHover: true,
                                        closeOnClick: true
                                    });
                                    document.getElementById("linhatabela" + conteudoId).remove();
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

    const buscarTVs = async () => {
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

    //Editar TV
    const editarConteudo = (conteudoId) => {
        navigate('/pageadd?id=' + conteudoId);
    }

    useEffect(() => {
        voltarLogin();
        buscarTVs();
        document.getElementById("listaTVs").style.visibility = "hidden";
    }, []);

    return (
        <div className="row">
            <MenuLateral />
            <div className="col-10">
                <MenuConteudo />
                <div className="conteudoTVs">
                    <h2>Gerencie os conteúdos cadastradas</h2>

                    <div className="col-md-12">
                        <label htmlFor="exampleInputEmail1">Escolha a TV</label>
                        <select className="form-control" id="selectLocais" onChange={(e) => {
                            SetTvIdForm(e.target.value);
                            buscaConteudos(e.target.value);
                        }}>
                            <option key="0" value={0}>Selecione...</option>
                            {tvs &&
                                tvs.map((tvs) => (
                                    <option key={tvs.id} value={tvs.id}>{tvs.descricao}</option>
                                ))}
                        </select>
                    </div>

                    <div id="listaTVs">
                        <div className="bg-white border rounded-5">
                            <section className="w-100 p-4">
                                <div id="datatable-custom" data-mdb-hover="true" className="datatable datatable-hover">
                                    <div className="datatable-inner table-responsive ps" style={{ overflow: "auto", position: "relative" }}>
                                        <table className="table datatable-table">
                                            <thead className="datatable-header">
                                                <tr>
                                                    <th scope="col"><i className="datatable-sort-icon fas fa-arrow-up"><b>Imagem</b></i></th>
                                                    <th scope="col"><i className="datatable-sort-icon fas fa-arrow-up"><b>Tempo (s)</b></i></th>
                                                    <th scope="col"><i className="datatable-sort-icon fas fa-arrow-up"><b>Ações</b></i></th>
                                                </tr>
                                            </thead>
                                            <tbody className="datatable-body">
                                                {conteudos && conteudos.map((tvs) => (
                                                    <tr data-mdb-index={tvs.id} key={tvs.id} id={"linhatabela" + tvs.id} className="linhaConteudoSort">
                                                        <td data-mdb-field="name"><img src={"http://10.109.68.121:3000/conteudo/" + tvs.imagem} className="imgConteudoListar"></img>{tvs.imagem}</td>
                                                        <td data-mdb-field="position">{tvs.tempo}</td>
                                                        <td data-mdb-field="contact">
                                                            <button className="call-btn btn btn-outline-primary btn-sm" onClick={() => { editarConteudo(tvs.id) }}><i className="bi bi-pencil-square"></i></button>
                                                            <button className="call-btn btn btn-outline-primary btn-sm" onClick={() => { apagarConteudo(tvs.id) }}><i className="bi bi-trash"></i></button>
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

export default Conteudos;