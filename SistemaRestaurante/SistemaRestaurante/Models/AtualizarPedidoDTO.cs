namespace SistemaRestaurante.Models
{
    public class AtualizarPedidoDTO
    {
        public int Id { get; set; }
        public StatusPedido StatusPedido { get; set; }
        public string Cliente { get; set; }
        public int NumeroMesa { get; set; }
        public List<ItemPedidoDTO> Itens { get; set; }
    }
}
