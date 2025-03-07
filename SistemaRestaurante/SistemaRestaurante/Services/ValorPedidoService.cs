using SistemaRestaurante.Models;

namespace SistemaRestaurante.Services
{
    public class ValorPedidoService
    {
        public decimal ValorTotalPedido(List<ItemPedido> itens)
        {
            decimal valorTotal = 0;

            foreach (var item in itens)
            {
                if (item.Produto.Preco < 0 || item.Quantidade < 0) 
                {
                    throw new ArgumentException($"Item ou quantidade com valor errado.");
                }

                valorTotal += item.Produto.Preco * item.Quantidade;
            }

            return valorTotal; 
        }
    }
}
