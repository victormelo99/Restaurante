using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SistemaRestaurante.Models
{
    public class Produto
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage ="O campo nome é obrigatório")]
        public string Nome { get; set; }

        [Required(ErrorMessage = "O campo Preço é obrigatório")]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Preco { get; set; }

        [Required(ErrorMessage = "O campo Tipo é obrigatório")]
        public TipoProduto Tipo { get; set; }

        public Produto ()
        {

        }

        public Produto(int id, string nome, decimal preco, TipoProduto tipo)
        {
            Id = id;
            Nome = nome;
            Preco = preco;
            Tipo = tipo;
        }
    }
}
