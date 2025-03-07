using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaRestaurante.Data;
using SistemaRestaurante.Models;

namespace SistemaRestaurante.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProdutoController : Controller
    {

        private readonly RestauranteDbContext _context;

        public ProdutoController(RestauranteDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> listarProdutos()
        {
            try
            {
                var resultado = await _context.Produto.ToListAsync();
                return Ok(resultado);
            }
            catch (Exception erro)
            {
                return BadRequest($"Erro na hora de listar os produtos: {erro.Message}");
            }

        }

        [HttpPost]
        public async Task<IActionResult> cadastrarProduto([FromBody] Produto produto)
        {
            try
            {
                produto.Preco = Math.Abs(produto.Preco);

                var cadastro = await _context.AddAsync(produto);
                var resultado = await _context.SaveChangesAsync();

                return Ok("Produto incluíudo.");
            }
            catch (Exception erro)
            {
                return BadRequest($"Erro na hora de cadastrar o produto: {erro.Message}");
            }

        }

        [HttpPut]
        public async Task<IActionResult> atualizarProduto([FromBody] Produto produto)
        {
            try
            {
                var atualizar = _context.Update(produto);
                var resultado = await _context.SaveChangesAsync();

                return Ok("Produto atualizado.");
            }
            catch (Exception erro)
            {
                return BadRequest($"Erro na hora de atualizar dados do produto: {erro.Message}");
            }

        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> excluirProduto([FromRoute] int id)
        {
            Produto produto = await _context.Produto.FindAsync(id);

            try
            {
                if (produto != null)
                {
                    var excluir = _context.Remove(produto);
                    var resultado = await _context.SaveChangesAsync();
                    return Ok("Produto removido.");

                }
                else
                {
                    return NotFound("Produto não encontrado");
                }
            }
            catch (Exception erro)
            {
                return BadRequest($"Erro na hora de deletar produto: {erro.Message}");
            }

        }

        [HttpGet("{id}")]
        public async Task<IActionResult> procurarProduto([FromRoute] int id)
        {
            Produto produto = await _context.Produto.FindAsync(id);

            try
            {
                if(produto != null)
                {
                    return Ok(produto);
                }
                else
                {
                    return NotFound("Produto não encontrado.");
                }
            }
            catch (Exception erro)
            {
                return BadRequest($"erro ao encontrar o produto. Exceção: {erro.Message}");
            }
        }
    }
}
