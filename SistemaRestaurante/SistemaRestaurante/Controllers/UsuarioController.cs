using Microsoft.AspNetCore.Mvc;
using SistemaRestaurante.Data;
using SistemaRestaurante.Services;
using Microsoft.EntityFrameworkCore;
using SistemaRestaurante.Models;
using Microsoft.AspNetCore.Authorization;

namespace SistemaRestaurante.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuarioController : Controller
    {
        private readonly RestauranteDbContext _context;
        private readonly LoginService _login;

        public UsuarioController(RestauranteDbContext context, LoginService login)
        {
            _context = context;
            _login = login;
        }

        [HttpPost]
        [Route("Login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] UsuarioLogin usuarioLogin)
        {
            try
            {
                var usuario = await _context.Usuario
                    .Where(usuarioBanco => usuarioBanco.Login == usuarioLogin.Login)
                    .FirstOrDefaultAsync();

                if (!_login.VerificarSenha(usuarioLogin.Senha, usuario.Senha, usuario.IsMaster))
                {
                    return BadRequest("Usuario ou senha inválida");
                }

                var token = _login.Token(usuario);
                usuario.Senha = "";

                var resultado = new UsuarioResponse()
                {
                    usuario = usuario,
                    Token = token
                };

                return Ok(resultado);
            }
            catch (Exception erro)
            {
                return BadRequest($"Error na hora de fazer o login. erro {erro.Message}");
            }
        }


        [HttpGet]
        [Authorize(Roles = "0,1,2")]
        public async Task<IActionResult> ListarUsuarios()
        {
            try
            {
                var resultado = await _context.Usuario.ToListAsync();
                return Ok(resultado);
            }
            catch (Exception erro)
            {
                return BadRequest($"Erro na hora de listar os usuários. Erro {erro.Message}");
            }
        }

        [HttpPost]
        public async Task<IActionResult> CadastrarUsuario([FromBody] Usuario usuario)
        {
            try
            {
                var listarUsuario = await _context.Usuario.Where(usuarioBAnco => usuarioBAnco.Login == usuario.Login).FirstOrDefaultAsync();

                if (listarUsuario != null)
                {
                    return BadRequest("Usuario ja existe");
                }
                else
                {
                    usuario.Senha = _login.Criptografar(usuario.Senha);

                    var cadastro = await _context.AddAsync(usuario);
                    var resultado = await _context.SaveChangesAsync();

                    return Ok("Usuario cadastrado");
                }

            }
            catch (Exception erro)
            {
                return BadRequest($"erro na hora de cadastrar usuario. {erro.Message}");
            }
        }

        [HttpPut]
        public async Task<IActionResult> AtualizarUsuario([FromBody] Usuario usuario)
        {
            try
            {
                usuario.Senha = _login.Criptografar(usuario.Senha);

                var cadastro = _context.Update(usuario);
                var resultado = await _context.SaveChangesAsync();

                return Ok("Usuario atualizado");
            }
            catch (Exception erro)
            {
                return BadRequest($"erro na hora de atualizar os dados do usuario. {erro.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletarUsuario([FromRoute] int id)
        {
            Usuario usuario = await _context.Usuario.FindAsync(id);

            try
            {
                if (usuario != null)
                {
                    var delete = _context.Usuario.Remove(usuario);
                    var resultado = await _context.SaveChangesAsync();

                    return Ok("Usuario deletado");
                }
                else
                {
                    return NotFound("Usuário não encontrado");
                }
            }
            catch (Exception erro)
            {
                return BadRequest($"Erro na hora de deletar o usuário: {erro.Message}");
            }

        }

        [HttpGet("{id}")]
        public async Task<IActionResult> procurarUsuario([FromRoute] int id)
        {
            Usuario usuario = await _context.Usuario.FindAsync(id);

            try
            {
                if (usuario != null)
                {
                    return Ok(usuario);
                }
                else
                {
                    return NotFound("Usuario não encontrado.");
                }
            }
            catch (Exception erro)
            {
                return BadRequest($"erro ao encontrar o usuario. Exceção: {erro.Message}");
            }
        }
    }
}
