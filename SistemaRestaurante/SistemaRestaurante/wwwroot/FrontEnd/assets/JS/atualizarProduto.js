import { Token, Urls } from "./config.js";
import { mostrarProdutos } from "./produtos.js";

export async function preencherCampos() {
    const id = localStorage.getItem('idUsuarioSelecionado');
    const url = `${Urls.Produto}/${id}`;

    try{

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization' : 'Bearer' + Token(),
                'Content-Type' : 'application/json',
            },
        });

        const produto = await response.json();

        document.getElementById('idAlterar').value = produto.id;
        document.getElementById('nomeAlterar').value = produto.nome;
        document.getElementById('precoAlterar').value = produto.preco;
        document.getElementById('tipoAlterar').value = produto.tipo;

    }
    catch (erro)
    {
        console.error('Erro ao preencher os campos. Erro: ' + erro);
    }
}

async function atualizarDados() {
    const id = document.getElementById('idAlterar').value;
    const nome = document.getElementById('nomeAlterar').value;
    const preco = document.getElementById('precoAlterar').value;
    const tipo = document.getElementById('tipoAlterar').value;

    if (!nome || !preco) return alert("Preencha todos os campos");

    const dados = {
        id: id,
        nome: nome,
        preco: parseFloat(preco).toFixed(2),
        tipo: Number(tipo)
    }

    const url = `${Urls.Produto}`;

    try 
    {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization' : 'Bearer' + Token(),
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify(dados),
        });

        alert('Produto atualizado');
        mostrarProdutos();
        
    }
    catch(erro)
    {
        console.erro('erro ao atualizar o produto');
    }

}

document.addEventListener('DOMContentLoaded', () => {
    preencherCampos();
    document.getElementById('alterarDados').addEventListener('click', atualizarDados);
    document.getElementById('sair2')?.addEventListener('click', () => window.close());
});