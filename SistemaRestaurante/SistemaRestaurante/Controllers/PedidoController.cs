using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaRestaurante.Data;
using SistemaRestaurante.Models;
using SistemaRestaurante.Services;
using System.Data;
using System.Security.Claims;

namespace SistemaRestaurante.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PedidoController : Controller
    {

        private readonly RestauranteDbContext _context;

        public PedidoController(RestauranteDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Authorize(Roles = "0,1,2")]
        public async Task<IActionResult> listarPedidos()
        {
            try
            {
                var permissao = User.FindFirst(ClaimTypes.Role)?.Value;

                int tipoUsuario;

                if (!int.TryParse(permissao, out tipoUsuario))
                {
                    return BadRequest("não foi possível converter o tipo de usuario.");
                }

                var pedidos = await _context.Pedido
                    .Include(pedido => pedido.Itens)
                    .ThenInclude(produto => produto.Produto)
                    .ToListAsync();

                List<Pedido> resultado = new List<Pedido>();

                foreach (var pedido in pedidos)
                {
                    if (tipoUsuario == (int)TipoUsuario.Cliente)
                    {
                        resultado.Add(pedido);
                    }
                    else
                    {
                        var pedidoFiltrado = new Pedido
                        {
                            Id = pedido.Id,
                            Cliente = pedido.Cliente,
                            NumeroMesa = pedido.NumeroMesa,
                            StatusPedido = pedido.StatusPedido,
                            ValorTotal = pedido.ValorTotal,
                            DataPedido = pedido.DataPedido
                        };

                        var itensFiltrados = pedido.Itens
                            .Where(item =>
                                tipoUsuario == (int)TipoUsuario.Cozinha && item.Produto.Tipo == TipoProduto.Comida ||
                                tipoUsuario == (int)TipoUsuario.Copa && item.Produto.Tipo == TipoProduto.Bebida
                            )
                            .ToList();

                        if (itensFiltrados.Any())
                        {
                            pedidoFiltrado.Itens = itensFiltrados;
                            resultado.Add(pedidoFiltrado);
                        }
                    }
                }

                return Ok(resultado);
            }
            catch (Exception erro)
            {
                return BadRequest($"Erro na hora de listar os pedidos: {erro.Message}");
            }
        }

        [HttpPost]
        [Authorize(Roles = "2")]
        public async Task<IActionResult> RealizarPedido([FromBody] PedidoDTO pedidoDto)
        {
            try
            {
                var produtos = await _context.Produto.ToListAsync();
                List<ItemPedido> itensPedido = new List<ItemPedido>();

                foreach (var itemDto in pedidoDto.Itens)
                {
                    var produtoEncontrado = produtos.FirstOrDefault(p => p.Id == itemDto.IdProduto);

                    if (produtoEncontrado == null)
                    {
                        return BadRequest($"Produto não foi encontrado.");
                    }

                    itensPedido.Add(new ItemPedido
                    {
                        IdProduto = produtoEncontrado.Id,
                        Produto = produtoEncontrado,
                        Quantidade = itemDto.Quantidade
                    });
                }

                var pedido = new Pedido
                {
                    Cliente = pedidoDto.Cliente,
                    NumeroMesa = pedidoDto.NumeroMesa,
                    DataPedido = DateTime.UtcNow,
                    StatusPedido = StatusPedido.Preparando,
                    Itens = itensPedido,
                    ValorTotal = new ValorPedidoService().ValorTotalPedido(itensPedido)
                };

                _context.Pedido.Add(pedido);
                await _context.SaveChangesAsync();

                return Ok("Pedido realizado com sucesso.");
            }
            catch (Exception erro)
            {
                return BadRequest($"Não foi possível realizar o pedido. Erro: {erro.Message}");
            }
        }

        [HttpPut]
        [Authorize(Roles = "0,1,2")]
        public async Task<IActionResult> AlterarPedido([FromBody] AtualizarPedidoDTO pedidoDTO)
        {
            try
            {
                var pedido = await _context.Pedido
                    .Include(p => p.Itens)
                    .ThenInclude(i => i.Produto)
                    .FirstOrDefaultAsync(p => p.Id == pedidoDTO.Id);

                var permissao = User.FindFirst(ClaimTypes.Role)?.Value;

                if (!int.TryParse(permissao, out int tipoUsuario))
                {
                    return BadRequest("Tipo de usuário inválido.");
                }

                if (tipoUsuario == 0 || tipoUsuario == 1)
                {
                    pedido.StatusPedido = pedidoDTO.StatusPedido;
                }
                else if (tipoUsuario == 2)
                {
                    if (pedido.StatusPedido != StatusPedido.Preparando)
                    {
                        return BadRequest("O pedido ja esta pronto, não é possivel realizar mudanças.");
                    }

                    pedido.Cliente = pedidoDTO.Cliente;
                    pedido.NumeroMesa = pedidoDTO.NumeroMesa;

                }

                await _context.SaveChangesAsync();
                return Ok("Pedido atualizado com sucesso.");
            }
            catch (Exception ex)
            {
                return BadRequest($"Erro ao atualizar o pedido: {ex.Message}");
            }
        }


        [HttpDelete("{id}")]
        [Authorize(Roles = "0,1,2")]
        public async Task<IActionResult> DeletarPedido([FromRoute] int id)
        {
            Pedido pedido = await _context.Pedido.FindAsync(id);
            var tipoUsuario = User.FindFirst(ClaimTypes.Role)?.Value;
            try
            {
                if (pedido != null)
                {
                    if (tipoUsuario == "2" && pedido.StatusPedido != StatusPedido.Preparando)
                    {
                        return BadRequest("Pedido ja esta pronto, não é possível cancela-lo");
                    }

                    var deletar = _context.Pedido.Remove(pedido);
                    var resultado = await _context.SaveChangesAsync();

                    return Ok("Pedido cancelado");
                }
                else
                {
                    return NotFound("Pedido não encontrado");
                }
            }
            catch (Exception erro)
            {
                return BadRequest($"Erro na hora de deletar pedido. Erro: {erro.Message}");
            }
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "0,1,2")]
        public async Task<IActionResult> ProcurarPedidoId([FromRoute] int id)
        {
            try
            {
                var pedido = await _context.Pedido
                    .Include(item => item.Itens)
                    .ThenInclude(produtoLista => produtoLista.Produto)
                    .FirstOrDefaultAsync(pedidoEncontrado => pedidoEncontrado.Id == id);

                if (pedido == null)
                {
                    return NotFound("Pedido não encontrado");
                }

                return Ok(pedido);

            }
            catch (Exception erro)
            {
                return BadRequest($"Não foi possível encontrar o pedido. erro: {erro.Message}");
            }
        }
    }
}
