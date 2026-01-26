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

http://localhost:5173
Build de produção
npm run build
Lint
npm run lint
3. 📁 Arquitetura e organização de pastas
src/
├── components/        # Componentes reutilizáveis (SurveyForm, modais, etc.)
├── views/             # Páginas da aplicação (Home, Survey, Responses, Detail, Edit)
├── router/            # Configuração das rotas (Vue Router)
├── services/          # Camada de acesso a dados (localStorage)
├── types/             # Tipagens TypeScript (SurveyAnswers, enums, etc.)
├── assets/            # Estilos e recursos estáticos
├── App.vue            # Componente raiz
└── main.ts            # Bootstrap da aplicação
Principais decisões
Componentização clara entre páginas (views) e componentes reutilizáveis (components)

Camada de serviço (services/storage.ts) isolando toda a lógica de persistência

Tipagem forte com TypeScript para respostas, enums e registros

Vue Router controlando fluxo de navegação (lista, detalhe e edição)

4. Regra para identificar o respondente
Cada resposta é identificada por um UUID v4

O identificador é gerado no momento do envio da pesquisa

As respostas são armazenadas no localStorage

Não há autenticação, pois o teste não exige backend

Essa abordagem garante:

Identificação única de cada resposta

Simplicidade

Persistência local conforme escopo do teste

5. Deploy
O projeto está publicado na Vercel:

👉 https://binds-satisfaction-test.vercel.app

Deploy automático a partir da branch main.

6. Scripts obrigatórios
dev – ambiente de desenvolvimento

build – build de produção

lint – verificação de código

Todos os scripts estão definidos no package.json.

Considerações finais
Projeto desenvolvido sem backend, conforme permitido

Persistência feita via localStorage

Interface responsiva, acessível e alinhada aos layouts fornecidos

Fluxo completo de criação, listagem, visualização, edição e exclusão de respostas