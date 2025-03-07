using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SistemaRestaurante.Models
{
    public class ItemPedido
    {

        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "O campo Quantidade é obrigatório")]
        public int Quantidade { get; set; }

        [ForeignKey ("Pedido")]
        public int IdPedido { get; set; }

        [JsonIgnore]
        public Pedido Pedido { get; set; }

        [ForeignKey("Produto")]
        public int IdProduto { get; set; }

        public Produto Produto { get; set; }


        public ItemPedido()
        {
        }

        public ItemPedido(int id, int quantidade, int idPedido, int idProduto)
        {
            Id = id;
            Quantidade = quantidade;
            IdPedido = idPedido;
            IdProduto = idProduto;
        }
    }
}
