using Microsoft.EntityFrameworkCore;
using SistemaRestaurante.Models;

namespace SistemaRestaurante.Data
{
    public class RestauranteDbContext: DbContext
    {
        public RestauranteDbContext(DbContextOptions<RestauranteDbContext> opcoes) : base(opcoes) {}

        public DbSet<Pedido> Pedido { get; set; }
        public DbSet<ItemPedido> ItemPedido { get; set; }
        public DbSet<Produto> Produto { get; set; }
        public DbSet<Usuario> Usuario { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Usuario>().HasData(
                new Usuario { Id = -1, Nome = "usuarioCliente", Login = "teste.cliente", Senha = "123", Tipo = TipoUsuario.Cliente, IsMaster = true },
                new Usuario { Id = -2, Nome = "usuarioCozinha", Login = "teste.cozinha", Senha = "123", Tipo = TipoUsuario.Cozinha, IsMaster = true },
                new Usuario { Id = -3, Nome = "usuarioCopa", Login = "teste.copa", Senha = "123", Tipo = TipoUsuario.Copa, IsMaster = true }
            );
        }

    }
}
