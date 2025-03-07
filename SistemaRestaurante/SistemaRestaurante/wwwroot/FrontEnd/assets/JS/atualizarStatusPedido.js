import { Token, Urls } from "./config.js";
import { normalizarDados } from "./pedidos.js";

export function atualizarStatus() {
    document.querySelectorAll("select").forEach((campoStatus) => {
        campoStatus.removeEventListener("change", enviarAtualizacaoStatus);
        campoStatus.addEventListener("change", enviarAtualizacaoStatus);
    });
}

async function enviarAtualizacaoStatus(evento) {
    const campoStatus = evento.target;
    const trElement = campoStatus.closest("tr");
    const pedidoId = parseInt(trElement.querySelector("td:first-child").textContent);
    const novoStatus = parseInt(campoStatus.value);

    const confirmar = window.confirm("Tem certeza que deseja alterar o status do pedido?");
    
    if (!confirmar) {
        campoStatus.value = campoStatus.getAttribute("data-status-anterior");
        return;
    }

    try {
        const tdCliente = trElement.querySelector('td:nth-child(2)').textContent;
        const tdNumeroMesa = trElement.querySelector('td:nth-child(3)').textContent;
        const tdItens = trElement.querySelector('td:nth-child(4)').textContent;

        const pedidoOriginal = {
            id: pedidoId,
            cliente: tdCliente,
            numeroMesa: tdNumeroMesa,
            itens: normalizarItens(tdItens),
            statusPedido: novoStatus
        };

        const pedidoAtualizado = normalizarDados(pedidoOriginal);

        const url = `${Urls.Pedido}`;

        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + Token(),
                "Content-Type": "application/json",
            },
            body: JSON.stringify(pedidoAtualizado),
        });

        if (response.ok) {
            alert("Status atualizado");
            campoStatus.setAttribute("data-status-anterior", novoStatus);
        }
    } 
    catch (erro) {
        console.error("Erro ao atualizar o status", erro);
        campoStatus.value = campoStatus.getAttribute("data-status-anterior");
    }
}

function normalizarItens(itens) {
    return itens.split(', ').map(item => {
        const [quantidade, nomeProduto] = item.split(' x ');
        return {
            idProduto: 0,
            quantidade: parseInt(quantidade),
            produto: { nome: nomeProduto }
        };
    });
}
