using System.ComponentModel.DataAnnotations;

namespace SistemaRestaurante.Models
{
    public class UsuarioLogin
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "O campo Login é obrigatório")]
        public string Login { get; set; }

        [Required(ErrorMessage = "O campo Senha é obrigatório")]
        public string Senha { get; set; }
    }
}
