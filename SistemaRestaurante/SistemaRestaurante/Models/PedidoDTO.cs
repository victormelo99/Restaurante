namespace SistemaRestaurante.Models
{
    public class PedidoDTO
    {
        public string Cliente { get; set; }
        public int NumeroMesa { get; set; }
        public List<ItemPedidoDTO> Itens { get; set; }


    }
}
