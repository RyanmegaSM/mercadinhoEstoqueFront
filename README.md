# Mercadinho JS Frontend

Sistema de gerenciamento de estoque e controle de mercadorias para pequenos estabelecimentos comerciais.

## 🚀 Tecnologias

Este projeto foi desenvolvido com as seguintes tecnologias:

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Query](https://tanstack.com/query/latest)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [Lucide React](https://lucide.dev/)

## 🔥 Features

- ✨ Interface moderna e responsiva
- 🌓 Tema claro/escuro
- 🔒 Autenticação e controle de acesso
- 📦 Gerenciamento de produtos
- 📋 Controle de estoque
- 🏷️ Gestão de fornecedores
- 📊 Dashboard com informações relevantes
- 📅 Controle de validade de produtos
- 🔄 Movimentação de estoque

## 🏗️ Arquitetura

O projeto segue uma arquitetura em camadas bem definidas:

### 📁 Estrutura de Pastas

- `/components`: Componentes reutilizáveis da aplicação
  - `/ui`: Componentes base (buttons, inputs, etc)
- `/contexts`: Contextos React para gerenciamento de estado global
- `/hooks`: Hooks personalizados
- `/pages`: Componentes de página
- `/services`: Camada de serviços para comunicação com a API
- `/validations`: Schemas de validação usando Zod
- `/helpers`: Funções utilitárias
- `/interfaces`: Definições de tipos TypeScript

O aplicativo estará disponível em `http://localhost:5173`

## 🛠️ Desenvolvimento

Para iniciar o desenvolvimento:

1. Crie uma nova branch a partir da `main`:

```bash
git checkout -b feature/nome-da-feature
```

2. Faça suas alterações e commits:

```bash
git add .
git commit -m "feat: descrição da alteração"
```

3. Envie para o repositório:

```bash
git push origin feature/nome-da-feature
```

4. Crie um Pull Request com suas alterações

### 📝 Convenções

- Commits seguem o padrão [Conventional Commits](https://www.conventionalcommits.org/)
- Código formatado com ESLint e Prettier
- Componentes funcionais e hooks React
- Tipagem forte com TypeScript

## 👥 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas alterações (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
