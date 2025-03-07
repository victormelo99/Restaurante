# Restaurante

Forma de se conectar com o banco:

Banco utilizado: SQL Server
Versão: v20.2

Forma para se conectar:

No arquivo appsettings.json realize a seguinte configuração

    "DefaultConnection": "Server=[servidor que deseja utilizar];Database=Restaurante;User Id=[usuario];Password=[senha];"

Sendo que o User é o usuario e senha são criados no sql server na área de Segurança>Logons

Abaixo exemplo do arquivo appsettings.json

{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",

  "ConnectionStrings": {
    "DefaultConnection": "Server=DESKTOP-BTE4J75\\MSSQLSERVER1;Database=Restaurante;User Id=victor;Password=12345;"
  },
  "Chave" :  "SistemaRestauranteTesteTecnicoRumoSolucoesCargoEstagio"
}

Para que o código funcione, é necessário que seja realizado o comando update-database no terminal.

Os usuários que serão gerados assim que for realizado o update-database serão: 

Nome = "usuarioCliente", Login = "teste.cliente", Senha = "123"

Nome = "usuarioCozinha", Login = "teste.cozinha", Senha = "123"

Nome = "usuarioCopa", Login = "teste.copa", Senha = "123"