# 🚀 MultiLivros — Sistema de Gerenciamento de Biblioteca

**MultiLivros** é um sistema de gerenciamento de biblioteca de alta performance. Ele une uma estética clássica **Vintage / Dark Academia** com o poder do desenvolvimento full stack moderno.

---

## 📌 Índice
- [Funcionalidades](#-funcionalidades)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Pré-requisitos](#-pré-requisitos)
- [Como Executar o Projeto](#-como-executar-o-projeto)
- [Estrutura do Banco de Dados](#-estrutura-do-banco-de-dados)
- [Licença](#-licença)

---

## ⚙️ Funcionalidades

- **Gestão de Acervo**: Cadastro, edição e remoção de livros.
- **Controle de Empréstimos**: Registro de saídas, devoluções e prazos.
- **Histórico Completo**: Rastreamento de movimentações por usuário.
- **Interface Responsiva**: Design adaptável para desktop e mobile.
- **Estética Customizada**: Tema Dark Academia aconchegante e imersivo.

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React.js**: Biblioteca base para a interface.
- **Tailwind CSS**: Estilização rápida com classes utilitárias.
- **Lucide React**: Pacote de ícones minimalistas.

### Backend & Banco de Dados
- **Node.js**: Ambiente de execução Javascript.
- **Express**: Framework para construção da API REST.
- **SQLite**: Banco de dados relacional leve e sem configuração.

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
Você precisa ter o [Node.js](https://nodejs.org) instalado em sua máquina.

### 1. Clonar o Repositório
```bash
git clone https://github.com
cd multilivros
```

### 2. Configurar o Backend
```bash
# Entre na pasta do servidor
cd backend

# Instale as dependências
npm install

# Inicie o servidor (geralmente roda na porta 3000 ou 5000)
npm run dev
```

### 3. Configurar o Frontend
```bash
# Abra um novo terminal e vá para a pasta do cliente
cd frontend

# Instale as dependências
npm install

# Inicie a aplicação web
npm run dev
```

---

## 🗃️ Estrutura do Banco de Dados (SQLite)

O sistema utiliza tabelas relacionais simples para garantir a performance:
- `livros`: id, titulo, autor, isbn, ano, quantidade.
- `usuarios`: id, nome, email, telefone.
- `emprestimos`: id, livro_id, usuario_id, data_emprestimo, data_devolucao, status.

---

## 📄 Licença

Este projeto está sob a licença MIT. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.

---



