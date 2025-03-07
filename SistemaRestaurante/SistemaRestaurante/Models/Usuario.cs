using System.ComponentModel.DataAnnotations;

namespace SistemaRestaurante.Models
{
    public class Usuario
    {


        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "O campo nome é obrigatório")]
        public string Nome { get; set; }

        [Required(ErrorMessage = "O campo login é obrigatório")]
        public string Login { get; set; }

        [Required(ErrorMessage = "O campo senha é obrigatório")]
        public string Senha { get; set; }
        public TipoUsuario Tipo { get; set; }
        public bool IsMaster { get; set; }

        public Usuario()
        {
        }

        public Usuario(int id, string nome, string login, string senha, TipoUsuario tipo, bool isMaster)
        {
            Id = id;
            Nome = nome;
            Login = login;
            Senha = senha;
            Tipo = tipo;
            IsMaster = isMaster;
        }
    }
}
