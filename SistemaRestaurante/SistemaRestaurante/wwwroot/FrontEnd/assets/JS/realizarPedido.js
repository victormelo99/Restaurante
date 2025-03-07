import { Urls, Token } from "./config.js";
import { carregarCardapio } from "./pedidosCliente.js";
import { mostrarPedidosClientes } from "./pedidosCliente.js";

let itensPedido = [];

export function adicionarProduto(produto) {
    const produtoExistente = itensPedido.find(item => item.IdProduto === produto.id);

    if (produtoExistente) {
        produtoExistente.Quantidade += 1;
    } else {
        itensPedido.push({
            IdProduto: produto.id,
            NomeProduto: produto.nome,
            Preco: produto.preco,
            Quantidade: 1
        });
    }

    atualizarListaProdutos();
}

function atualizarListaProdutos() {
    const listaProdutos = document.getElementById("listaProdutos");

    listaProdutos.innerHTML = "";

    itensPedido.forEach(item => {
        const itemProduto = document.createElement("div");
        itemProduto.classList.add("itemProduto");

        itemProduto.innerHTML = `
        <span class="nomeProduto">${item.NomeProduto}</span>
        <input type="number" class="quantidadeProduto" value="${item.Quantidade}" min="1" data-produto-id="${item.IdProduto}">
        <button class="removerProduto" data-produto-id="${item.IdProduto}"><img src="../IMG/icones/lixeira.svg" alt=""></button>
    `;
        listaProdutos.appendChild(itemProduto);
    });

    const inputsQuantidade = document.querySelectorAll(".quantidadeProduto");
    inputsQuantidade.forEach(input => {
        input.addEventListener("change", (evento) => {
            const produtoId = Number(evento.target.dataset.produtoId);
            const novaQuantidade = Number(evento.target.value);

            if (novaQuantidade < 1) {
                evento.target.value = 1;
                return;
            }

            const produto = itensPedido.find(item => item.IdProduto === produtoId);
            if (produto) {
                produto.Quantidade = novaQuantidade;
            }
        });
    });

    const botaoRemover = document.querySelectorAll(".removerProduto");
    botaoRemover.forEach(botao => {
        botao.addEventListener("click", (evento) => {
            const produtoId = evento.target.dataset.produtoId;
            removerProduto(produtoId);
        });
    });
}

function removerProduto(produtoId) {

    const id = Number(produtoId);
    const produtoEscolhido = itensPedido.findIndex(item => item.IdProduto === id);

    if (produtoEscolhido != -1) {

        if (itensPedido[produtoEscolhido].Quantidade > 1) {
            itensPedido[produtoEscolhido].Quantidade -= 1;
        } else {
            itensPedido.splice(produtoEscolhido, 1);
        }
    }
    atualizarListaProdutos();
}

async function realizarPedido() {
    const url = `${Urls.Pedido}`;

    try {
        const nomeCliente = document.getElementById("nomeCliente").value;
        const numeroMesa = document.getElementById("numeroMesa").value;

        if (!nomeCliente || !numeroMesa || itensPedido.length === 0) return alert("Preencha todos os campos");


        const pedidoDTO = {
            Cliente: nomeCliente,
            NumeroMesa: numeroMesa,
            Itens: itensPedido.map(item => ({
                IdProduto: item.IdProduto,
                Quantidade: item.Quantidade
            }))
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + Token(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(pedidoDTO),
        });

        if (response.ok) {
            alert("Pedido realizado com sucesso!");

            document.getElementById("nomeCliente").value = "";
            document.getElementById("numeroMesa").value = "";


            itensPedido = [];
            atualizarListaProdutos();
            mostrarPedidosClientes();

        }

    }
    catch (erro) {
        console.error("Erro ao realizar pedido:", erro);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const conteudoCardapio = document.getElementById("conteudoCardapio");
    carregarCardapio(conteudoCardapio);

    const botaoConfirmarPedido = document.getElementById("confirmarPedido");
    botaoConfirmarPedido.addEventListener("click", realizarPedido);
});
