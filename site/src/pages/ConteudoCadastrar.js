import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
//Notificação
import { ToastContainer, toast } from 'react-toastify';
//Global
import { url_server } from "../constants/global";
//Páginas
import MenuLateral from "./MenuLateral";
import MenuConteudo from "./MenuConteudo";

function ConteudoCadastrar() {
    const navigate = useNavigate();
    //Variável para recuperar os dados do Form
    const [tituloForm, setTituloForm] = useState("");
    const [imagemForm, setImagemForm] = useState(null);
    const [tempoForm, setTempoForm] = useState("");
    const [dataInicioForm, setDataInicioForm] = useState("");
    const [dataFimForm, setDataFimForm] = useState("");
    //const [mensagemForm, setMensagemForm] = useState("");
    const [tvIdForm, SetTvIdForm] = useState("");
    //Para preencher o elemento option
    const [tvs, setTvs] = useState("");
    //Para buscar um conteúdo ao atualizar
    const [conteudoId, setConteudoId] = useState("");
    const [conteudo, setConteudo] = useState("");

    //Validar sessão
    const voltarLogin = () => {
        if (sessionStorage.getItem('userLogged') === null) {
            navigate('/');
        }
    }

    const envioForm = async (event) => {
        event.preventDefault();

        let dataI = new Date(`${dataInicioForm}T00:00`).getTime();
        let dataF = new Date(`${dataFimForm}T00:00`).getTime();

        if (imagemForm === null) {
            alert('O campo da imagem não pode ficar vazio');
        } else if (dataI > dataF) {
            alert('A data de início não pode ser maior que a data final');
        } else {
            const txtBotao = document.getElementById("btEnvioForm").textContent;
            if (txtBotao === 'Cadastrar') {
                cadastrarConteudo(event);
            } else {
                atualizarConteudo();
            }

        }
    }

    const cadastrarConteudo = async (e) => {
        if (tvIdForm === '' || tvIdForm === "0") {
            alert('Selecione uma TV');
        } else {
            const formData = new FormData();
            formData.append("titulo", tituloForm);
            formData.append("imagem", imagemForm);
            formData.append("tempo", tempoForm);
            formData.append("dataInicio", dataInicioForm);
            formData.append("dataFim", dataFimForm);
            formData.append("mensagem", "");
            formData.append("tvs_id", tvIdForm);

            console.log(formData);

            const envio = {
                method: 'POST',
                body: formData//JSON.stringify({ titulo: tituloForm, imagem: imagemForm, tempo: tempoForm, dataInicio: dataInicioForm, dataFim: dataFimForm, tvs_id: tvIdForm })
            }
            try {
                const response = await fetch(url_server + '/api/conteudo/cadastrar', envio);
                response.json().then(data => {
                    if (response.status === 200) {
                        alert('Conteúdo cadastrado');
                    } else {
                        toast.error(data.result, {
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

    const buscarConteudo = async () => {
        const parametrosURL = new URLSearchParams(window.location.search)
        const id = parametrosURL.get("id")

        if (id !== null) {

            const envio = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }

            try {
                const response = await fetch(url_server + '/api/conteudo/buscar/' + id, envio);
                response.json().then(data => {
                    if (response.status === 200) {
                        document.getElementById("btEnvioForm").textContent = "Atualizar";

                        setTituloForm(data[0].titulo);
                        setImagemForm(data[0].imagem);
                        setTempoForm(data[0].tempo);
                        setDataInicioForm(data[0].dataInicio.replace("T03:00:00.000Z", ""));
                        setDataFimForm(data[0].DATAFIM.replace("T03:00:00.000Z", ""));
                        let element = document.getElementById("selectLocais");
                        element.value = data[0].Tvs_id;

                    } else {
                        toast.error("Erro ao buscar conteúdo", {
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

    const atualizarConteudo = async () => {
        const parametrosURL = new URLSearchParams(window.location.search)
        const id = parametrosURL.get("id");

        if (tvIdForm === '' || tvIdForm === "0") {
            alert('Selecione uma TV');
        } else {
            const formData = new FormData();
            formData.append("titulo", tituloForm);
            formData.append("imagem", imagemForm);
            formData.append("tempo", tempoForm);
            formData.append("dataInicio", dataInicioForm);
            formData.append("dataFim", dataFimForm);
            formData.append("mensagem", "");
            formData.append("tvs_id", tvIdForm);
            formData.append("id", id);

            const envio = {
                method: 'PUT',
                body: formData //JSON.stringify({ descricao: descricaoForm, locais_id: locais_idForm })
            }
            try {
                const response = await fetch(url_server + '/api/conteudo/atualizar/' + id, envio);
                if (response.status === 200) {
                    const data = await response.json();
                    toast.success(data.result, {
                        autoClose: 3000,
                        pauseOnHover: true,
                        closeOnClick: true
                    });
                    //Limpa os campos
                    setTituloForm("");
                    setTempoForm("");
                    setDataInicioForm("");
                    setDataFimForm("");
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

    useEffect(() => {
        voltarLogin();
        buscarTVs().then(() => {
            buscarConteudo();
        });
    }, []);


    return (
        <div className="row">
            <MenuLateral />
            <div className="col-10">
                <MenuConteudo />

                <form className="formMargem" onSubmit={envioForm}>
                    <div className="col-md-12">
                        <label htmlFor="titulo">Título do conteúdo</label>
                        <input type="text" className="form-control" name="titulo" required id="titulo" value={tituloForm} onChange={(e) => setTituloForm(e.target.value)} />
                    </div>

                    <div className="col-md-12">
                        <label htmlFor="imagem">Imagem</label>
                        <input type="file" className="form-control" name="imagem" id="imagem" accept="image/*" onChange={(e) => setImagemForm(e.target.files[0])} />
                    </div>

                    <div className="col-md-4">
                        <label htmlFor="tempo">Duração em segundos</label>
                        <input type="number" min={0} className="form-control" name="tempo" required id="tempo" style={{ width: "95%" }} value={tempoForm} onChange={(e) => setTempoForm(e.target.value)} />
                    </div>

                    <div className="col-md-4">
                        <label htmlFor="dataInicio">Data inicial</label>
                        <input type="date" className="form-control" name="dataInicio" required id="dataInicio" style={{ width: "95%" }} value={dataInicioForm} onChange={(e) => setDataInicioForm(e.target.value)} />
                    </div>

                    <div className="col-md-4">
                        <label htmlFor="dataFim">Data término</label>
                        <input type="date" className="form-control" name="dataFim" required id="dataFim" value={dataFimForm} onChange={(e) => setDataFimForm(e.target.value)} />
                    </div>

                    <div className="col-md-12">
                        <label htmlFor="exampleInputEmail1">Escolha a TV</label>
                        <select className="form-control" id="selectLocais" onChange={(e) => SetTvIdForm(e.target.value)}>
                            <option key="0">Selecione...</option>
                            {tvs &&
                                tvs.map((tvs) => (
                                    <option key={tvs.id} value={tvs.id}>{tvs.descricao}</option>
                                ))}
                        </select>
                    </div>

                    {/* <div className="col-md-12">
                        <label htmlFor="mensagem">Texto de rodapé (Opcional)</label>
                        <input type="text" className="form-control" name="mensagem" id="mensagem" value={mensagemForm} onChange={(e) => setMensagemForm(e.target.value)} />
                    </div> */}

                    <div className="margem"></div>

                    <button type="submit" id="btEnvioForm" className="btn btn-primary" onClick={() => 'return false;'}>Cadastrar</button>
                </form>

                <ToastContainer />
            </div>
            $( ".linhaConteudoSort" ).on( "sortstop", function( event, ui ) { } );
        </div>
    );
}


export default ConteudoCadastrar;