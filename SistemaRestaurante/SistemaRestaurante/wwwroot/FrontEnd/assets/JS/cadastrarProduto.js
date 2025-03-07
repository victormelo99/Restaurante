import { Token ,Urls} from "./config.js";
import { mostrarProdutos } from "./produtos.js";

export async function cadastrar () {
    const url = `${Urls.Produto}`;

    try 
    {
        let nome = document.getElementById('nomeCadastrar').value;
        let preco = document.getElementById('precoCadastrar').value;
        let tipo = document.getElementById('tipo').value;

        if (!nome || !preco || !tipo) return alert("Preencha todos os campos");

        const dados = {
            nome: nome,
            preco: parseFloat(preco).toFixed(2),
            tipo: Number(tipo)
        }

        const response = await fetch (url, {
            method: 'POST',
            headers: {
                'Authorization' : 'Bearer ' + Token(),
                'Content-Type' : 'application/json',
            },

            body: JSON.stringify(dados),
        });

        if(response.ok)
        {
            document.querySelectorAll('input').forEach(input => input.value = '');
            document.getElementById('tipo').value = '';
            alert('Produto cadastrado');
            mostrarProdutos();
            
        }
        else
        {
            alert('Não foi possível cadastrar o produto.');
        }
    }
    catch(erro)
    {
        console.error(`Erro ao processar a requisição. Erro: ${erro}`);
    }
} 

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('salvar').addEventListener('click', () => cadastrar());
    document.getElementById('sair1')?.addEventListener('click', () => window.close());
});