# Woovi Challenger Bank

<div id="top"></div>
Uma aplicação bancária moderna construída com tecnologias de ponta, oferecendo funcionalidades completas de PIX, gestão de contas e transações em tempo real.

### Built With

[![Next][next.js]][next-url]
[![React][react.js]][react-url]
[![Node][node.js]][node-url]
[![GraphQL][graphql]][graphql-url]
[![MongoDB][mongodb]][mongodb-url]
[![Koa][koa]][koa-url]
[![Redis][redis]][redis-url]
[![TypeScript][typescript]][typescript-url]

## Documentação por App

### Frontend (Next.js)
- **Local**: `apps/web/`
- **README**: [`apps/web/README.md`](apps/web/README.md)
- **Descrição**: Interface moderna com dashboard, autenticação, transferências PIX, e gestão de favoritos.

### Backend (Koa, GraphQL, MongoDB)
- **Local**: `apps/server/`
- **README**: [`apps/server/README.md`](apps/server/README.md)
- **Descrição**: API GraphQL completa com módulos de usuário, conta, transações PIX e lançamentos contábeis.

<p align="right">(<a href="#top">back to top</a>)</p>

## 🛠️ Getting Started

Para executar o projeto localmente, siga estes passos:

### Pré-requisitos

- **Node.js** (versão 18 ou superior)
  ```sh
  https://nodejs.org/en/download/
  ```

- **PNPM** (gerenciador de pacotes)
  ```sh
  npm install pnpm -g
  ```

- **Docker** (para MongoDB e Redis)
  ```sh
  https://www.docker.com/get-started/
  ```

### Instalação

1. **Clone o repositório**
   ```sh
   git clone https://github.com/hallancosta/woovi-challanger-bank.git
   cd woovi-challanger-bank
   ```

2. **Instale as dependências**
   ```sh
   pnpm install
   ```

3. **Inicie os serviços (MongoDB e Redis)**
   ```sh
   pnpm compose:up
   ```

4. **Configure as variáveis de ambiente**
   ```sh
   pnpm config:local
   ```

5. **Execute o Schema Compiler**
   ```sh
   pnpm schema
   ```

6. **Execute o Relay Compiler**
   ```sh
   pnpm relay
   ```

7. **Execute o Relay Compiler**
   ```sh
   pnpm mongo:replica
   ```

8. **Cria contas**
   ```sh
   pnpm seeds:accounts
   ```

9. **Reseta Saldo das contas**
   ```sh
   pnpm reset:accounts
   ```

10. **Inicie o projeto**
   ```sh
   pnpm dev
   ```

## 🧪 Testes

### Executar Testes
```sh
# Todos os testes
pnpm test
```

### Teste de Carga (K6)
```sh
pnpm k6:pix
```

### URLs de Acesso
- **Frontend**: http://localhost:3000
- **Backend GraphQL**: http://localhost:4000/graphql

#### Usuários de Teste (Local)

Usuário 1:
- Email: hallan1@test.com
- Senha: 123
- AccountId: {{ DEPOIS DE GERADO SEEDER }}
- Chave PIX: 95b7f30c-2fad-43cd-85d1-f5615cf28a39

Usuário 2:
- Email: hallan2@test.com  
- Senha: 123
- AccountId: {{ DEPOIS DE GERADO SEEDER }}
- Chave PIX: 08771dd3-32c0-4fe7-8725-6175ab14c7ee

### URLs de Acesso (Produção)
- **Frontend**: https://bank.hallancosta.com
- **Backend GraphQL**: https://server-bank.hallancosta.com/graphql

#### Usuários de Teste (Produção)

Usuário 1:
- Email: hallan1@test.com
- Senha: 123
- AccountId: QWNjb3VudDo2OGRiMTY4MTIwNWNkNmMyNTMxZWJjNWU=
- Chave PIX: 95b7f30c-2fad-43cd-85d1-f5615cf28a39

Usuário 2:
- Email: hallan2@test.com  
- Senha: 123
- AccountId: QWNjb3VudDo2OGRiMTY4MTIwNWNkNmMyNTMxZWJjNjA=
- Chave PIX: 08771dd3-32c0-4fe7-8725-6175ab14c7ee

### Postman
[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/28811256-c0c7c9c7-c2c4-4c2c-9c5c-c2c4c2c4c2c4?action=collection%2Ffork&source=rip-rip)

### Testar no Postman
[Baixar arquivo Postman](https://raw.githubusercontent.com/HallanCosta/woovi-challanger-bank/refs/heads/main/apps/server/docs/graphql-api-collection.json)

#### Ambiente Local
1. Importe a coleção no Postman usando o botão acima ou o arquivo JSON
2. Configure uma variável de ambiente `url` com valor `http://localhost:4000/graphql`
3. Execute as requisições da coleção

#### Ambiente de Produção  
1. Importe a coleção no Postman usando o botão acima ou o arquivo JSON
2. Configure uma variável de ambiente `url_production` com valor `https://server-bank.hallancosta.com/graphql`
3. Execute as requisições da coleção

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👥 Autores

- **Hallan Costa** - [@hallancosta](https://github.com/hallancosta)

---

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- Badges -->
[next.js]: https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[next-url]: https://nextjs.org/
[react.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[react-url]: https://reactjs.org/
[node.js]: https://img.shields.io/badge/NodeJS-339933?style=for-the-badge&logo=nodedotjs&logoColor=white
[node-url]: https://nodejs.org/
[graphql]: https://img.shields.io/badge/Graphql-E10098?style=for-the-badge&logo=graphql&logoColor=white
[graphql-url]: https://graphql.org/
[mongodb]: https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white
[mongodb-url]: https://mongodb.com
[koa]: https://img.shields.io/badge/Koa-F9F9F9?style=for-the-badge&logo=koa&logoColor=33333D
[koa-url]: https://koajs.com
[redis]: https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white
[redis-url]: https://redis.io
[typescript]: https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white
[typescript-url]: https://www.typescriptlang.org