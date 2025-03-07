import { Urls } from "./config.js";

function login() {
    const formularioLogin = document.getElementById('formularioLogin');

    if (formularioLogin) {
        formularioLogin.addEventListener('submit', async function (evento) {
            evento.preventDefault();

            const usuario = document.getElementById('usuario').value;
            const senha = document.getElementById('senha').value;

            try {
                const response = await fetch(`${Urls.Usuario}/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ login: usuario, senha: senha })
                });

                const body = await response.text();

                const data = JSON.parse(body);

                if (data.usuario && data.token && data.usuario.tipo !== undefined) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('usuarioId', data.usuario.id);

                    document.getElementById('mensagem').innerText = 'Login realizado com sucesso.';

                    const tipoUsuario = Number(data.usuario.tipo);

                    if (tipoUsuario == 0 || tipoUsuario == 1) {
                        window.location.href = '/frontend/assets/HTML/areaFuncionario.html';
                    }
                    else if (tipoUsuario == 2) {
                        window.location.href = '/frontend/assets/HTML/areaCliente.html';
                    }
                }
            }
            catch (erro) {
                document.getElementById('mensagem').innerText = "Erro ao realizar o login. Tente novamente";
            }
        })
    }
}

document.addEventListener('DOMContentLoaded', () => {
    login();
});


