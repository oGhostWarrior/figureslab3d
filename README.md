## 🚀 Funcionalidades Principais

  * **Dashboard**: Uma visão geral intuitiva com métricas e indicadores-chave do negócio.
  * **Clientes**: Gerenciamento completo de informações de clientes, incluindo dados de contato.
  * **Matérias-Primas**: Controle de estoque de insumos (filamentos), com rastreamento de quantidade e custo.
  * **Produtos**: Cadastro detalhado de produtos, com informações de preço, custo, estoque e associação com as matérias-primas necessárias.
  * **Pedidos**: Módulo central para criar, rastrear e gerenciar o status dos pedidos.
  * **Relatórios**: Geração de relatórios financeiros e de vendas em formato PDF para análise gerencial.

## 💻 Tecnologias Utilizadas

Este projeto foi construído com uma arquitetura **full-stack**, dividida em duas partes:

### Backend

  * **Laravel**: Framework PHP robusto para a lógica de negócios e persistência de dados.
  * **Laravel Sanctum**: Utilizado para a autenticação segura da API.
  * **MySQL/PostgreSQL**: Sistema de gerenciamento de banco de dados para armazenamento das informações.

### Frontend

  * **React**: Biblioteca JavaScript para a construção da interface de usuário.
  * **TypeScript**: Adiciona tipagem estática, garantindo maior segurança e facilidade na manutenção do código.
  * **Vite**: Ferramenta de build extremamente rápida para um ambiente de desenvolvimento ágil.
  * **Tailwind CSS**: Framework CSS utilitário para estilização rápida e responsiva.
  * **Zustand**: Biblioteca para gerenciamento de estado global, tornando a aplicação mais escalável.

## ⚙️ Como Iniciar

Siga as instruções abaixo para configurar e executar o projeto em seu ambiente de desenvolvimento.

### Backend (API)

1.  Acesse a pasta `api/` no terminal.
2.  Instale as dependências com o Composer:
    ```bash
    composer install
    ```
3.  Copie o arquivo de configuração de ambiente e defina suas credenciais de banco de dados:
    ```bash
    cp .env.example .env
    ```
4.  Execute as migrações para criar as tabelas no banco de dados:
    ```bash
    php artisan migrate
    ```
5.  Inicie o servidor local:
    ```bash
    php artisan serve
    ```

### Frontend (Aplicação React)

1.  Em outro terminal, acesse a pasta `src/`.
2.  Instale as dependências do Node.js:
    ```bash
    npm install
    ```
3.  Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```

O frontend estará disponível em `http://localhost:5173` e se comunicará com o backend iniciado na porta padrão do Laravel.
