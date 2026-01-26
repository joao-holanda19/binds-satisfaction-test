# Entrega – Teste de Satisfação

## 1. Repositório Git

Projeto disponível no GitHub:

👉 https://github.com/joao-holanda19/binds-satisfaction-test

---

## 2. Como rodar o projeto

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm

### Instalação
```bash
npm install
Ambiente de desenvolvimento
npm run dev
O projeto ficará disponível em:

👉 http://localhost:5173

Build de produção
npm run build
Lint
npm run lint
3. Deploy
Aplicação publicada na Vercel:

👉 https://binds-satisfaction-test.vercel.app/

4. 🗂️ Arquitetura / organização de pastas
📦 src
 ┣ 📂 components
 ┃ ┣ 📄 SurveyForm.vue
 ┃ ┣ 📄 ConfirmModal.vue
 ┃ ┣ 📄 AppShell.vue
 ┃ ┗ 📄 AppCard.vue
 ┣ 📂 router
 ┃ ┗ 📄 index.ts
 ┣ 📂 services
 ┃ ┗ 📄 storage.ts
 ┣ 📂 types
 ┃ ┣ 📄 survey.ts
 ┃ ┗ 📄 (outros tipos, se existirem)
 ┣ 📂 views
 ┃ ┣ 📄 HomeView.vue
 ┃ ┣ 📄 SurveyView.vue
 ┃ ┣ 📄 ResponsesView.vue
 ┃ ┣ 📄 ResponseDetailView.vue
 ┃ ┗ 📄 ResponseEditView.vue
 ┣ 📄 App.vue
 ┗ 📄 main.ts
O que fica onde
📂 views/
Telas (páginas) da aplicação

📂 components/
Componentes reutilizáveis (formulário, modal, cards)

📂 services/storage.ts
Persistência via localStorage (CRUD das respostas)

📂 router/index.ts
Definição das rotas da aplicação

📂 types/
Tipos TypeScript do domínio (ex.: SurveyAnswers)

Sobre AppShell.vue e AppCard.vue
Esses componentes foram mantidos como base de arquitetura para possíveis expansões futuras, mesmo que o layout atual esteja aplicado diretamente nas views/:

AppShell.vue: pensado como layout global da aplicação

AppCard.vue: pensado como componente reutilizável de card para padronização visual

Observação: atualmente o projeto aplica as classes de layout diretamente nas telas para manter a implementação objetiva e fiel aos prints do teste.

5. 👤 Regra escolhida para identificar respondente
A identificação do respondente é feita por um UUID gerado no momento do envio da pesquisa e salvo junto da resposta no localStorage.

Chave de armazenamento
binds_satisfaction_responses_v1
Estrutura de cada resposta
id (UUID)

createdAt (ISO)

updatedAt (ISO, opcional)

answers (dados do formulário)

6. 💾 Persistência (LocalStorage)
O projeto não depende de backend.

Todas as respostas são salvas e gerenciadas no navegador via localStorage, incluindo as operações:

criar resposta

listar respostas (ordenadas por updatedAt ou createdAt)

ver detalhe

editar resposta

excluir resposta

limpar todas as respostas

7. Scripts obrigatórios
dev

build

lint