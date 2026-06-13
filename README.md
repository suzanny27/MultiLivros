# MultiLivros — Sistema de Gerenciamento de Biblioteca

**MultiLivros** é um sistema de gerenciamento de biblioteca de alta performance, projetado com uma estética **Vintage / Dark Academia** ultra imersiva para o usuário, mas utilizando as tecnologias mais modernas do desenvolvimento full stack: **React (com Tailwind CSS)** no frontend, e **Node.js (com Express) e SQLite** no backend.

---

## 🏛️ Identidade Visual e Estética
O design foi concebido com inspiração nas bibliotecas clássicas vitorianas e no estilo literário gótico:
- **Paleta de Cores de Luxo**:
  - **Modo Pergaminho (Claro)**: Fundo `#F9F6F0` suave para simular papel envelhecido, com textos em marrom-café `#2C1B10`.
  - **Modo Tabaco (Escuro)**: Fundo `#1E130C` escuro e texturizado, reduzindo o cansaço visual.
  - **Destaque Principal**: Verde-esmeralda vitoriano `#0F2A1D` para menus persistentes.
  - **Metais**: Dourado-velho fosco `#C5A059` para botões principais, bordas finas e detalhes tipográficos.
- **Tipografia**: Serifas literárias clássicas (`Playfair Display`) em cabeçalhos combinadas com uma sans-serif limpa (`Inter`) para formulários e dados tabulares.
- **Acabamentos**: Sombras suaves e profundas, divisores dourados duplos e cantos ligeiramente arredondados que imitam encadernações de couro clássicas.
- **Capas de Livros Dinâmicas**: Se a obra não tiver imagem de capa cadastrada, o sistema gera dinamicamente uma capa clássica em CSS (azul-petróleo, vinho ou verde-musgo) com relevo e o título/autor em dourado.

---

## 🛠️ Tecnologias Utilizadas
- **Frontend**: React.js, Vite, Tailwind CSS, Recharts, Lucide React.
- **Backend**: Node.js, Express, Multer (para upload de capas).
- **Banco de Dados**: SQLite3 (gerenciado localmente via arquivo `.db` automático).

---

## 🚀 Guia de Inicialização (Terminal Ubuntu)

Siga os passos exatos abaixo para instalar as dependências e rodar o projeto localmente.

### Passo 1: Clonar / Acessar o Diretório do Projeto
Abra o terminal na pasta raiz do projeto:
```bash
cd /home/suzanny/Multimeios
```

### Passo 2: Inicializar e Executar o Backend
Abra um terminal dedicado para o backend:
```bash
cd backend
npm install
npm start
```
*O servidor Express iniciará na porta `5000` e o banco de dados `multilivros.db` será configurado e semeado automaticamente.*

### Passo 3: Inicializar e Executar o Frontend
Abra outro terminal dedicado para o frontend:
```bash
cd frontend
npm install
npm run dev
```
*O servidor de desenvolvimento do Vite iniciará localmente (normalmente em `http://localhost:5173`).*

---

## 🔑 Acesso ao Painel
Na tela de login:
- **Administrador**: Insira qualquer e-mail (ex: `bibliotecario@multilivros.com`).
- **Chave de Acesso**: Digite qualquer senha/chave (ex: `123456`) e clique em **Entrar no Gabinete**.
# MultiLivros
