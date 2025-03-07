import { adicionarProduto } from "./realizarPedido.js";
import { Urls, Token } from "./config.js";
import { vincularEventos } from "./utilidades.js";

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

const botaoCardapio = document.getElementById('cardapio');
const botaoAlterar = document.getElementById('alterarPedido');
const botaoListar = document.getElementById('listarPedido');
const botaoCarrinho = document.getElementById('carrinho');
const botaoDeletar = document.getElementById('deletarPedido');

const areaCardapio = document.getElementById('areaCardapio');
const areaAlterar = document.getElementById('areaAlterarPedido');
const areaListarPedidos = document.getElementById('areaListarPedidos');
const areaCarrinho = document.getElementById('areaRealizarPedido');


function mostrarCarrinho(evento) {
    evento.stopPropagation();

    areaCarrinho.style.width = "17%";
}


function fecharCarrinho(evento) {
    if (evento.target && evento.target.classList.contains("botaoAdicionar")) {
        return;
    }

    if (evento.target && evento.target.classList.contains("removerProduto")) {
        return;
    }

    const listaProdutos = document.getElementById("listaProdutos");
    const itensPedido = listaProdutos.children;

    if (itensPedido.length === 0) {
        if (!areaCarrinho.contains(evento.target) && evento.target !== botaoCarrinho) {
            areaCarrinho.style.width = "0%";
        }
    }
}

function mostrar(area) {
    areaCardapio.style.display = 'none';
    areaAlterar.style.display = 'none';
    areaListarPedidos.style.display = 'none';

    area.style.display = 'flex';

    if (area === areaCardapio) {
        botaoDeletar.style.display = "none";
        botaoAlterar.style.display = "none";
    } else {
        botaoDeletar.style.display = "inline-block";
        botaoAlterar.style.display = "inline-block";
    }
}

const imagensPadrao = {
    "lasanha": "../IMG/produtos/lasanha.jpg",
    "suco de laranja": "../IMG/produtos/sucoLaranja.jpg",
    "macarrão": "../IMG/produtos/macarrão.jpg",
    "stela artois": "../IMG/produtos/stelaArtois.png",
    "heineken": "../IMG/produtos/heineken.png",
};

export async function carregarCardapio(conteudoCardapio) {
    try {
        const url = `${Urls.Produto}`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Erro ao buscar os produtos");
        }

        const produtos = await response.json();

        conteudoCardapio.innerHTML = "";

        for (let i = 0; i < produtos.length; i++) {
            let produto = produtos[i];
            let nome = produto.nome.trim().toLowerCase();

            let imagem = imagensPadrao[nome] ? imagensPadrao[nome] : "../IMG/produtos/imagemIndisponivel.png";

            const card = document.createElement("div");
            card.classList.add("card-produto");

            card.innerHTML = `
                <img src="${imagem}" alt="${produto.nome}" class="imagemProduto">
                <div class="informacoesProduto">
                    <h2>${produto.nome}</h2>
                    <span class="preco">R$ ${produto.preco.toFixed(2)}</span>
                    <button class="botaoAdicionar" data-produto-id="${produto.id}">Adicionar</button>
                </div>`;

            conteudoCardapio.appendChild(card);
        }

        const botaoAdicionar = document.querySelectorAll(".botaoAdicionar");

        botaoAdicionar.forEach(botao => {
            botao.addEventListener("click", (evento) => {
                const produtoId = event.target.dataset.produtoId;
                const produto = produtos.find(p => p.id == produtoId);

                if (produto) {
                    adicionarProduto(produto);
                    mostrarCarrinho(evento);
                }
            });
        });

    } catch (error) {
        console.error("Erro ao carregar produtos:", error);
    }
}

export async function mostrarPedidosClientes() {
    try {
        const tbodyPedidosClientes = document.getElementById('tbodyPedidosClientes');
        tbodyPedidosClientes.innerHTML = '';

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
            tdStatus.textContent = dadosNormalizados.statusPedido === 0 ? 'Preparando' : dadosNormalizados.statusPedido === 1 ? 'Pronto' : 'Entregue';
            const tdValorTotal = document.createElement('td');
            tdValorTotal.textContent = `R$ ${dadosNormalizados.valorTotal.toFixed(2)}`;
            const tdDataPedido = document.createElement('td');
            tdDataPedido.textContent = new Date(dadosNormalizados.dataPedido).toLocaleString();

            tr.appendChild(tdId);
            tr.appendChild(tdCliente);
            tr.appendChild(tdNumeroMesa);
            tr.appendChild(tdItens);
            tr.appendChild(tdStatus);
            tr.appendChild(tdValorTotal);
            tr.appendChild(tdDataPedido);

            tbodyPedidosClientes.appendChild(tr);
            vincularEventos();

        });


    } catch (erro) {
        console.error('Erro ao preencher a tabela:', erro);
    }
}

async function cancelarPedido() {
    const id = localStorage.getItem('idUsuarioSelecionado');


    if (pedido.statusPedido === 1 || pedido.statusPedido === 2) {
        alert("pedido ja está pronto ou então ele ja foi entregue.");
        return;
    }

    if (confirm('Tem certeza que deseja cancelar este pedido?')) {

        try {
            const url = `${Urls.Pedido}/${id}`;
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + Token(),
                    'Content-Type': 'application/json'
                },
            });

            const linhaSelecionada = document.querySelector('#tbodyPedidosClientes tr.selecionado');

            if (linhaSelecionada) {
                linhaSelecionada.remove();
            }

            mostrarPedidosClientes();

            alert("Pedido excluído");

            localStorage.removeItem('idUsuarioSelecionado');

            document.querySelectorAll('#tbodyPedidosClientes tr').forEach(tr => {
                tr.classList.remove('selecionado');
            });

        }
        catch (erro) {
            console.error("erro ao excluir o pedido: erro " + erro);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    carregarCardapio(conteudoCardapio);
    mostrarPedidosClientes();

    botaoCardapio?.addEventListener('click', () => mostrar(areaCardapio));
    botaoAlterar?.addEventListener('click', () => mostrar(areaAlterar));
    botaoListar?.addEventListener('click', () => mostrar(areaListarPedidos));
    botaoCarrinho?.addEventListener('click', mostrarCarrinho);
    document.addEventListener('click', fecharCarrinho);
    document.getElementById('deletarPedido')?.addEventListener("click", cancelarPedido);
    
    mostrar(areaCardapio);
});