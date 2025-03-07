import { Token, Urls } from "./config.js";
import { mostrarPedidosClientes } from "./pedidosCliente.js";

export async function preencherCamposCliente() {

    const id = localStorage.getItem('idUsuarioSelecionado');
    const url = `${Urls.Pedido}/${id}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + Token(),
                'Content-Type': 'application/json',
            },
        });

        const pedido = await response.json();

        document.getElementById('idCliente').value = pedido.id;
        document.getElementById('nomeClienteAlterar').value = pedido.cliente;
        document.getElementById('numeroMesaAlterar').value = pedido.numeroMesa;

        const listaProdutos = document.getElementById('listaProdutosAlterar');
        listaProdutos.innerHTML = pedido.itens.map(item => `<p>${item.quantidade} x ${item.produto.nome}</p>`).join('');

    } catch (erro) {
        console.error('Erro ao preencher os campos:', erro);
    }
}

async function atualizarDados() {
    const id = document.getElementById('idCliente').value;
    const nomeCliente = document.getElementById('nomeClienteAlterar').value;
    const numeroMesa = document.getElementById('numeroMesaAlterar').value;

    if (!nomeCliente || !numeroMesa) return alert('É necessário preencher todos os campos');

    const dados = {
        id: id,
        cliente: nomeCliente,
        numeroMesa: numeroMesa,
        Itens: []
    };

    const url = `${Urls.Pedido}`;

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + Token(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dados),
        });

        alert('Pedido atualizado');        
        mostrarPedidosClientes();

    } catch (erro) {
        console.error('Erro ao atualizar o pedido:', erro);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    preencherCamposCliente();
    document.getElementById('alterarDados').addEventListener('click', atualizarDados);
});
