import { Token, Urls } from "./config.js";
import { abrir, vincularEventos } from "./utilidades.js";
import { atualizarStatus } from "./atualizarStatusPedido.js";

export function normalizarDados(pedido) {
    return {
        id: pedido.id,
        cliente: pedido.cliente,
        numeroMesa: pedido.numeroMesa,
        dataPedido: pedido.dataPedido,
        valorTotal: pedido.valorTotal,
        statusPedido: pedido.statusPedido,
        itens: pedido.itens
    }
}

async function mostrarPedidos() {
    try {
        const tbodyPedidos = document.getElementById('tbodyPedidos');
        tbodyPedidos.innerHTML = '';

        const url = `${Urls.Pedido}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + Token(),
                'Content-Type': 'application/json',
            },
        });

        const pedidos = await response.json();

        pedidos.forEach((pedido) => {
            const dadosNormalizados = normalizarDados(pedido);

            const tr = document.createElement('tr');

            const tdId = document.createElement('td');
            tdId.textContent = dadosNormalizados.id;
            const tdCliente = document.createElement('td');
            tdCliente.textContent = dadosNormalizados.cliente;
            const tdNumeroMesa = document.createElement('td');
            tdNumeroMesa.textContent = dadosNormalizados.numeroMesa;
            const tdItens = document.createElement('td');
            const listaItens = dadosNormalizados.itens.map(item => `${item.quantidade} x ${item.produto.nome}`).join(', ');
            tdItens.textContent = listaItens;

            const tdStatus = document.createElement('td');
            const criarSelect = document.createElement('select'); 

            const preparando = document.createElement('option');
            preparando.value = 0;
            preparando.textContent = 'Preparando';
            const pronto = document.createElement('option');
            pronto.value = 1;
            pronto.textContent = 'Pronto';
            const entregue = document.createElement('option');
            entregue.value = 2;
            entregue.textContent = 'Entregue';

            criarSelect.value = dadosNormalizados.statusPedido;
            tdStatus.appendChild(criarSelect);

            const tdValorTotal = document.createElement('td');
            tdValorTotal.textContent = `R$ ${dadosNormalizados.valorTotal.toFixed(2)}`;
            const tdDataPedido = document.createElement('td');
            tdDataPedido.textContent = new Date(dadosNormalizados.dataPedido).toLocaleString();

            criarSelect.appendChild(preparando);
            criarSelect.appendChild(pronto);
            criarSelect.appendChild(entregue);

            tr.appendChild(tdId);
            tr.appendChild(tdCliente);
            tr.appendChild(tdNumeroMesa);
            tr.appendChild(tdItens);
            tr.appendChild(tdStatus);
            tr.appendChild(tdValorTotal);
            tr.appendChild(tdDataPedido);

            tbodyPedidos.appendChild(tr);

            vincularEventos();
        });

        atualizarStatus();
    
    } catch (erro) {
        console.error('Erro ao preencher a tabela:', erro);
    }
}

async function cancelarPedido() {
    const id = localStorage.getItem('idUsuarioSelecionado');

    if(confirm('Tem certeza que deseja cancelar este pedido?')) {

        try
        {
            const url = `${Urls.Pedido}/${id}`;
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + Token(),
                    'Content-Type': 'application/json'
                },
            });
    
            const linhaSelecionada = document.querySelector('#tbodyPedidos tr.selecionado');
    
            if(linhaSelecionada) {
                linhaSelecionada.remove();
            }
    
            mostrarPedidos();
    
            alert("Pedido excluído");
    
            localStorage.removeItem('idUsuarioSelecionado');

            document.querySelectorAll('#tbodyPedidos tr').forEach(tr => {
                tr.classList.remove('selecionado');
            });
    
        }
        catch(erro)
        {
            console.error("erro ao excluir o pedido: erro " + erro);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    mostrarPedidos();

    document.getElementById('produtos')?.addEventListener('click', () =>
        abrir('areaProdutos.html'));

    document.getElementById('deletarPedido')?.addEventListener("click", cancelarPedido);

});
