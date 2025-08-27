import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

//Pages
import Login from "./pages/Login";
import Home from "./pages/Home";
import TV from "./pages/TV";
import TVCadastrar from "./pages/TVCadastrar";
import ConteudoCadastrar from "./pages/ConteudoCadastrar";
import LocalCadastrar from "./pages/LocalCadastrar";
import Conteudos from "./pages/Conteudos";
import Perfil from "./pages/Perfil";
import Logout from "./pages/Logout";
import Estatisticas from "./pages/Estatisticas";

export default function Rotas() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/tv" element={<TV />} />
                <Route path="/sair" element={<Logout />} />
                <Route path="/conteudos" element={<Conteudos />} />
                <Route path="/tvadd" element={<TVCadastrar />} />
                <Route path="/pageadd" element={<ConteudoCadastrar />} />
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/stats" element={<Estatisticas />} />
                <Route path="/localadd" element={<LocalCadastrar />} />
            </Routes>
        </BrowserRouter>
    );
}
