using Microsoft.IdentityModel.Tokens;
using SistemaRestaurante.Data;
using SistemaRestaurante.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SistemaRestaurante.Services
{
    public class LoginService
    {
        private readonly RestauranteDbContext _context;
        private readonly IConfiguration _configuraton;

        public LoginService(RestauranteDbContext context, IConfiguration configuraton)
        {
            _context = context;
            _configuraton = configuraton;
        }

        public string Token(Usuario usuario)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var chave = Encoding.ASCII.GetBytes(_configuraton.GetSection("Chave").Get<String>());

            var desencripitar = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(
                        [
                            new Claim (ClaimTypes.Name, usuario.Nome.ToString()),
                            new Claim (ClaimTypes.Role, ((int)usuario.Tipo).ToString()),
                        ]
                ),

                Expires = DateTime.UtcNow.AddHours(12),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(chave),SecurityAlgorithms.HmacSha256Signature
                )
            };

            var token = tokenHandler.CreateToken(desencripitar);

            return tokenHandler.WriteToken(token);
        }

        public string Criptografar (string senha )
        {
            string senhaHash = BCrypt.Net.BCrypt.HashPassword(senha, 13);

            return senhaHash;
        }

        public bool VerificarSenha(string senhaDigitada, string senhaHash, bool isMaster)
        {
            if (isMaster)
            {
                return true;
            }

            return BCrypt.Net.BCrypt.Verify(senhaDigitada, senhaHash);
        }
    }
}
