import React from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';

function MenuLateral() {
    return (
        <div className="col-2 min-vh-100 fundoMenu">
            <ul className="menuUL">
                <li style={{ marginBottom: 20, paddingLeft: 15 }}>
                    <a className="nav-link px-2" href="/home">
                        <i className="bi bi-house" style={{ fontSize: 30, color: "#fff", marginRight: 20 }}></i>
                        <span className="ms-1 d-none d-sm-inline espacoLI" style={{ fontSize: "20px" }}>Home</span>
                    </a>
                </li>
                <li style={{ marginBottom: 20, paddingLeft: 15 }}>
                    <a className="nav-link px-2" href="/tv">
                        <i className="bi bi-tv" style={{ fontSize: 30, color: "#fff", marginRight: 20 }}></i>
                        <span className="ms-1 d-none d-sm-inline espacoLI" style={{ fontSize: "20px" }}>TVs</span>
                    </a>
                </li>
                <li style={{ marginBottom: 20, paddingLeft: 15 }}>
                    <a className="nav-link px-2" href="/pageadd">
                        <i className="bi bi-file-earmark-plus" style={{ fontSize: 30, color: "#fff", marginRight: 20 }}></i>
                        <span className="ms-1 d-none d-sm-inline espacoLI" style={{ fontSize: "20px" }}>Conteúdos</span>
                    </a>
                </li>
                <li style={{ marginBottom: 20, paddingLeft: 15 }}>
                    <a className="nav-link px-2" href="/perfil">
                        <i className="bi bi-person" style={{ fontSize: 30, color: "#fff", marginRight: 20 }}></i>
                        <span className="ms-1 d-none d-sm-inline espacoLI" style={{ fontSize: "20px" }}>Perfil</span>
                    </a>
                </li>
                {/* {perfilId == 1 ?
                    <li style={{ marginBottom: 20, paddingLeft: 15 }}>
                        <a className="nav-link px-2" href="/stats">
                            <i className="bi bi-bar-chart" style={{ fontSize: 30, color: "#fff", marginRight: 20 }}></i>
                            <span className="ms-1 d-none d-sm-inline espacoLI" style={{ fontSize: "20px" }}>Estatísticas</span>
                        </a>
                    </li> : ""} */}
                <li style={{ marginBottom: 20, paddingLeft: 15 }}>
                    <a className="nav-link px-2" href="/sair">
                        <i className="bi bi-box-arrow-right" style={{ fontSize: 30, color: "#fff", marginRight: 20 }}></i>
                        <span className="ms-1 d-none d-sm-inline espacoLI" style={{ fontSize: "20px" }}>Sair</span>
                    </a>
                </li>
            </ul>
        </div>

    );

}

export default MenuLateral;