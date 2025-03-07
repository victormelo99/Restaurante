import { Token, Urls } from './config.js';
import { vincularEventos } from './utilidades.js';

const botaoListar = document.getElementById('listar');
const botaoCadastrar = document.getElementById('cadastrar');
const botaoAlterar = document.getElementById('alterar');
const botaoDeletar = document.getElementById('deletar');

const areaListar = document.getElementById('areaListar');
const areaCadastrar = document.getElementById('areaCadastrar');
const areaAlterar = document.getElementById('areaAlterar');

function mostrar(area) {
    areaListar.style.display = "none";
    areaCadastrar.style.display = "none";
    areaAlterar.style.display = "none";

    area.style.display = "flex";

    if (area === areaCadastrar || area === areaAlterar) {
        botaoDeletar.style.display = "none";
    } else {
        botaoDeletar.style.display = "inline-block";
    }
};

export async function mostrarProdutos () {
    try 
    {
        const tbody = document.getElementById('tbody');
        tbody.innerHTML = '';

        const url = `${Urls.Produto}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + Token(),
                'Content-Type': 'application/json',
            },
        });

        const produtos = await response.json();

        produtos.forEach((produto) => {
            const tr = document.createElement('tr');

            const tdId = document.createElement('td');
            tdId.textContent = produto.id;
            const tdNome = document.createElement('td');
            tdNome.textContent = produto.nome;
            const tdPreco = document.createElement('td');
            tdPreco.textContent = `R$ ${produto.preco.toFixed(2)}`;
            const tdTipo = document.createElement('td');
            tdTipo.textContent = produto.tipo === 0 ? 'Bebida' : 'Comida';

            tr.appendChild(tdId);
            tr.appendChild(tdNome);
            tr.appendChild(tdPreco);
            tr.appendChild(tdTipo);

            tbody.appendChild(tr);
            vincularEventos();

        });

    }
    catch(erro)
    {
        console.error('Erro ao preencher a tabela:', erro);
    }
}

async function deletar() {
    const id = localStorage.getItem('idUsuarioSelecionado');

    if(confirm('Tem certeza que deseja deletar este produto ?')) {
        try
        {
            const url = `${Urls.Produto}/${id}`;
            const response = await fetch(url, {
                method: 'DELETE', 
                headers: {
                    'Authorization': 'Bearer ' +  Token(),
                    'Content-Type': 'application/json',
                },
            });

            const linhaSelecionada = document.querySelector('#tbody tr.selecionado');
            
            if (linhaSelecionada) {
                linhaSelecionada.remove();
            }

            mostrarProdutos();

            alert('Produto excluído com sucesso');

            localStorage.removeItem('idUsuarioSelecionado');

            document.querySelectorAll('#tbody tr').forEach(tr => {
                tr.classList.remove('selecionado');
            });

        }
        catch(erro)
        {
            console.error("erro ao deletar o produto: erro " + erro);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    mostrarProdutos();

    botaoListar?.addEventListener("click", () => mostrar(areaListar));
    botaoCadastrar?.addEventListener("click", () => mostrar(areaCadastrar));
    botaoAlterar?.addEventListener("click", () => mostrar(areaAlterar));
    botaoDeletar?.addEventListener("click",  deletar );
    document.getElementById('sair')?.addEventListener('click', () => window.close());
    mostrar(areaListar);
});
