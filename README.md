# Money Super Hero

Application for managing your budget

## Version
Work in Progress :construction_worker:

## Prerequisites
- Node.js
- Docker

## Project Structure
```mermaid
flowchart TD
    A(Money Super Hero) --> Z{Nginx}
    Z --> B[Frontend] --> C{Technologies} 
    C --> D[TypeScript]
    C --> D[React]
    C --> F[React Router]
    C --> G[Zustand]
    C --> H[Material UI]
    C --> I[i18next]
    C --> L[Axios]
    Z --> M[Backend] --> N{Technologies} 
    N --> O[Node.js]
    N --> P[TypeScript]
    N --> Q[nodemon]
    N --> R[Express]
    N --> S[node-postgres]
    Z --> T[Database] --> U{Technologies} 
    U --> V[PostgreSQL]
```

## First run

```bash
  docker compose up --build
```

## Run

```bash
  docker compose up
```

## Development

### App url
`http://localhost:8000/`

## Authors

| Riccardo Giovarelli | [![LinkedIn](https://img.shields.io/badge/Linkedin-%230077B5.svg?logo=linkedin&logoColor=white)](https://linkedin.com/in/riccardo-giovarelli) [![github](https://img.shields.io/badge/github-181717.svg?logo=github&logoColor=white)](https://github.com/riccardo-giovarelli)  |
|---|---|

## License

[MIT](https://opensource.org/license/mit)


## Badges

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=fff)](https://www.docker.com/)
[![Postgres](https://img.shields.io/badge/Postgres-%23316192.svg?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Yarn](https://img.shields.io/badge/Yarn-2C8EBB?logo=yarn&logoColor=fff)](https://yarnpkg.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff)](https://www.typescriptlang.org/)
[![NodeJS](https://img.shields.io/badge/Node.js-6DA55F?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-%23404d59.svg?logo=express&logoColor=%2361DAFB)](https://expressjs.com/)
[![Nodemon Badge](https://img.shields.io/badge/Nodemon-76D04B?logo=nodemon&logoColor=fff&style=flat-square)](https://nodemon.io/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=fff)](https://vite.dev/)
[![React](https://img.shields.io/badge/React-%2320232a.svg?logo=react&logoColor=%2361DAFB)](https://react.dev/)
[![React Router](https://img.shields.io/badge/React_Router-CA4245?logo=react-router&logoColor=white)](https://reactrouter.com/)
[![Zustand](https://img.shields.io/badge/Zustand-582D3E.svg?logo=amazon-aws&logoColor=white)](https://zustand.docs.pmnd.rs/)
[![i18next](https://img.shields.io/badge/i18next-26A69A?logo=i18next&logoColor=fff&style)](https://www.i18next.com/)
[![Axios](https://img.shields.io/badge/Axios-5A29E4?logo=axios&logoColor=fff)](https://axios-http.com/)





