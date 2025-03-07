using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SistemaRestaurante.Models
{
    public class Pedido
    {

        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "O campo cliente é obrigatório")]
        public string Cliente { get; set; }

        [Required(ErrorMessage = "O campo Numero da mesa é obrigatório")]
        public int NumeroMesa { get; set; }

        [Required(ErrorMessage ="O campo DataPedido é obrigatório")]
        public DateTime DataPedido { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal ValorTotal { get; set; }

        [Required(ErrorMessage = "o campo status é obrigatório")]
        public StatusPedido StatusPedido { get; set; }


        [Required(ErrorMessage = "o campo itens é obrigatório")]
        public List<ItemPedido> Itens { get; set; }
        public Pedido()
        {
        }

        public Pedido(int id, string cliente, int numeroMesa, DateTime dataPedido, decimal valorTotal, StatusPedido statusPedido)
        {
            Id = id;
            Cliente = cliente;
            NumeroMesa = numeroMesa;
            DataPedido = dataPedido;
            ValorTotal = valorTotal;
            StatusPedido = statusPedido;

        }
    }
}
