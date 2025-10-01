# Woovi Challenger Bank

<div id="top"></div>
A modern banking application built with cutting-edge technologies, offering complete PIX functionality, account management and real-time transactions.

### Built With

[![Next][next.js]][next-url]
[![React][react.js]][react-url]
[![Node][node.js]][node-url]
[![GraphQL][graphql]][graphql-url]
[![MongoDB][mongodb]][mongodb-url]
[![Koa][koa]][koa-url]
[![Redis][redis]][redis-url]
[![TypeScript][typescript]][typescript-url]

## Documentation by App

### Frontend (Next.js)
- **Location**: `apps/web/`
- **README**: [`apps/web/README.md`](apps/web/README.md)
- **Description**: Modern interface with dashboard, authentication, PIX transfers, and favorites management.

### Backend (Koa, GraphQL, MongoDB)
- **Location**: `apps/server/`
- **README**: [`apps/server/README.md`](apps/server/README.md)
- **Description**: Complete GraphQL API with user, account, PIX transactions and accounting entries modules.

<p align="right">(<a href="#top">back to top</a>)</p>

## 🛠️ Getting Started

To run the project locally, follow these steps:

### Prerequisites

- **Node.js** (version 18 or higher)
  ```sh
  https://nodejs.org/en/download/
  ```

- **PNPM** (package manager)
  ```sh
  npm install pnpm -g
  ```

- **Docker** (for MongoDB and Redis)
  ```sh
  https://www.docker.com/get-started/
  ```

### Installation

1. **Clone the repository**
   ```sh
   git clone https://github.com/hallancosta/woovi-challanger-bank.git
   cd woovi-challanger-bank
   ```

2. **Install dependencies**
   ```sh
   pnpm install
   ```

3. **Start services (MongoDB and Redis)**
   ```sh
   pnpm compose:up
   ```

4. **Configure environment variables**
   ```sh
   pnpm config:local
   ```

5. **Run Schema Compiler**
   ```sh
   pnpm schema
   ```

6. **Run Relay Compiler**
   ```sh
   pnpm relay
   ```

7. **Run Relay Compiler**
   ```sh
   pnpm mongo:replica
   ```

8. **Create accounts**
   ```sh
   pnpm seeds:accounts
   ```

9. **Reset account balances**
   ```sh
   pnpm reset:accounts
   ```

10. **Start the project**
    ```sh
    pnpm dev
    ```

## 🧪 Testing

### Run Tests
```sh
# All tests
pnpm test
```

### Load Testing (K6)
```sh
pnpm k6:pix
```

### Access URLs
- **Frontend**: http://localhost:3000
- **Backend GraphQL**: http://localhost:4000/graphql

#### Test Users (Local)

User 1:
- Email: hallan1@test.com
- Password: 123
- AccountId: {{ AFTER ACCOUNT SEEDER GENERATION }}
- PIX Key: 95b7f30c-2fad-43cd-85d1-f5615cf28a39

User 2:
- Email: hallan2@test.com  
- Password: 123
- AccountId: {{ AFTER ACCOUNT SEEDER GENERATION }}
- PIX Key: 08771dd3-32c0-4fe7-8725-6175ab14c7ee

### Access URLs (Production)
- **Frontend**: https://bank.hallancosta.com
- **Backend GraphQL**: https://server-bank.hallancosta.com/graphql

#### Test Users (Production)

User 1:
- Email: hallan1@test.com
- Password: 123
- AccountId: QWNjb3VudDo2OGRiMTY4MTIwNWNkNmMyNTMxZWJjNWU=
- PIX Key: 95b7f30c-2fad-43cd-85d1-f5615cf28a39

User 2:
- Email: hallan2@test.com  
- Password: 123
- AccountId: QWNjb3VudDo2OGRiMTY4MTIwNWNkNmMyNTMxZWJjNjA=
- PIX Key: 08771dd3-32c0-4fe7-8725-6175ab14c7ee

### Postman
[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/28811256-c0c7c9c7-c2c4-4c2c-9c5c-c2c4c2c4c2c4?action=collection%2Ffork&source=rip-rip)

### Test in Postman
[Download Postman file](https://raw.githubusercontent.com/HallanCosta/woovi-challanger-bank/refs/heads/main/apps/server/docs/graphql-api-collection.json)

#### Local Environment
1. Import the collection in Postman using the button above or the JSON file
2. Configure an environment variable `url` with value `http://localhost:4000/graphql`
3. Execute the collection requests

#### Production Environment  
1. Import the collection in Postman using the button above or the JSON file
2. Configure an environment variable `url_production` with value `https://server-bank.hallancosta.com/graphql`
3. Execute the collection requests

## 🤝 Contributing

1. Fork the project
2. Create a branch for your feature (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is under the MIT license. See the `LICENSE` file for more details.

## 👥 Authors

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