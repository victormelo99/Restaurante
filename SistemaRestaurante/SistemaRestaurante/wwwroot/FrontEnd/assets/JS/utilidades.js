import { Token } from "./config.js"
import { preencherCampos } from './atualizarProduto.js';
import { preencherCamposCliente } from "./atualizarPedidoCliente.js";

export function abrir(pagina) {
    if(Token()){
        window.open(`/frontend/assets/HTML/${pagina}`, '_blank');
    }
}

export function vincularEventos () {
    const linhas = document.querySelectorAll('#tbody tr, #tbodyPedidos tr, #tbodyPedidosClientes tr');
    linhas.forEach((linha) => {
        linha.addEventListener('click', () => selecionarLinha(linha));
    })
}

export function selecionarLinha(linha) {
    const linhas = document.querySelectorAll('#tbody tr, #tbodyPedidos tr, #tbodyPedidosClientes tr');
    const alterar = document.getElementById('alterar');
    const alterarPedido = document.getElementById('alterarPedido');
    const deletar = document.getElementById('deletar');
    const deletarPedido = document.getElementById('deletarPedido');

    linhas.forEach((tr) => tr.classList.remove('selecionado')); 
    linha.classList.add('selecionado');

    const id = linha.cells[0].textContent.trim();
    localStorage.setItem('idUsuarioSelecionado', id);

    if (alterar) alterar.disabled = false;
    if (deletar) deletar.disabled = false;
    if(alterarPedido) alterarPedido.disabled = false;
    if (deletarPedido) deletarPedido.disabled = false;
    
    preencherCampos();
    preencherCamposCliente();
    
    document.addEventListener('click', function fora(evento) {
        const tabela = document.querySelector('.tabela');
        const tabelaPedido = document.querySelector('.tabelaPedido');
        const tabelaPedidoCliente = document.querySelector('.tabelaPedidoCliente');

        const cliqueFora = (!tabela || !tabela.contains(evento.target)) && 
                           (!tabelaPedido || !tabelaPedido.contains(evento.target));
                           (!tabelaPedidoCliente || !tabelaPedidoCliente.contains(evento.target));

        if (cliqueFora) {
            linhas.forEach((tr) => tr.classList.remove('selecionado'));
            if (alterar) alterar.disabled = true;
            if (deletar) deletar.disabled = true;
            if(alterarPedido) alterarPedido.disabled = true;
            if (deletarPedido) deletarPedido.disabled = true;
            document.removeEventListener('click', fora);
        }
    });
}

document.addEventListener('DOMContentLoaded',() => {
    vincularEventos();
});