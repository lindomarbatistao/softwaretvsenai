


import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { url_server, url } from '../constants/global';
import MenuLateral from './MenuLateral';

function Home() {
  const navigate = useNavigate();
  const [resumo, setResumo] = useState([]); // array, não string

  // Valida sessão
  const voltarLogin = () => {
    if (sessionStorage.getItem('userLogged') === null) {
      navigate('/');
    }
  };

  // Busca resumo das TVs (robusto contra 204 / não-JSON)
  const fetchResumo = async () => {
    try {
      const res = await fetch(`${url_server}/api/tv/resumo`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      const text = await res.text();

      if (!res.ok) {
        throw new Error(`HTTP ${res.status} - ${text}`);
      }

      if (!text || !text.trim()) {
        setResumo([]);
        return;
      }

      const ct = res.headers.get('content-type') || '';
      if (!ct.includes('application/json')) {
        throw new Error(`Resposta não-JSON recebida: ${text.slice(0, 200)}`);
      }

      const data = JSON.parse(text);
      setResumo(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Falha ao carregar dados:', err);
      toast.error(String(err), {
        autoClose: 3000,
        pauseOnHover: true,
        closeOnClick: true
      });
      setResumo([]);
    }
  };

  useEffect(() => {
    voltarLogin();
    fetchResumo();
  }, []);

  return (
    <div className="row">
      <MenuLateral />
      <div className="col-10">
        <div className="menuSuperior">
          <span>Resumo das TVs atuais</span>
        </div>

        <div className="resumoTVs">
          {(resumo || []).map((item) => {
            const total = Number(item.Total) || 0;
            const tempo = Number(item.tempo) || 0;
            const cls = total === 0 ? "contornoResumo fundoAviso" : "contornoResumo";
            const link = `${url}:3000/tvs/verconteudo.html?id=${item.id}`;
            return (
              <div className={cls} key={item.id}>
                <i className='bi bi-tv'></i>
                <b>{item.TV}</b>
                <br />
                <i className='bi bi-body-text'></i>
                <span>Total de {total} {total <= 1 ? "imagem" : "imagens"}</span>
                <br />
                <i className='bi bi-clock'></i>
                <span>Tempo total: {tempo} {tempo <= 1 ? "segundo" : "segundos"}</span>
                <br />
                <i className='bi bi-link-45deg'></i>
                <span>Link: <a href={link} target="_blank" rel="noreferrer">{link}</a></span>
                <br />
              </div>
            );
          })}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Home;
