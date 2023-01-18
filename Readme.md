# **teste-técnico**

## **Dependências**
  - [NodeJS](https://nodejs.org/en/) (Utilizando a versão 18.12.1 LTS pelo NVM)
  - [NPM](https://www.npmjs.com/)
  - [Postgres](https://www.postgresql.org/download/) (Utilizando a versão 15.1)

## **Pacotes Utilizados**

### Produção
  - [DOTENV](https://www.npmjs.com/package/dotenv)
  - [ESM](https://www.npmjs.com/package/esm)
  - [EXPRESS](https://expressjs.com/pt-br/)
  - [PG](https://node-postgres.com/)
  - [SEQUELIZE](https://sequelize.org/)

### Dev
  - [NODEMON](https://nodemon.io/)
  - [ESLINT](https://eslint.org/)
## **Instalação**

* Após clonar o projeto, rodar:

```bash
    sudo npm install
``` 
* Após instalar, deve criar o banco (recomendo usar PGAdmin ou outro app, caso não possa, use o terminal): 

```bash
  sudo -u postgres psql #para conectar como user postgres, ou como desejar;
  CREATE DATABASE <Nome-do-banco> ;
```

* Após criar o banco de dados, deve criar um arquivo  ***.env***  com os seguintes campos:
  
```bash
  API_PORT=3333
  POSTGRES_HOST=localhost
  POSTGRES_DB= #Nome da database;
  POSTGRES_USERNAME=postgres
  POSTGRES_PASSWORD= #Sua senha do postgres
  POSTGRES_PORT=5432
```

* Após a instalação rodar o servidor:

```bash
    sudo npm run dev
``` 
> Nota: A api rodará em http://localhost:3333

## **Modelagem do Banco de dados**

![Imagem do banco modelado]('https://raw.githubusercontent.com/pepz1n/teste-tecnico/main/src/assets/banco-logico-modelagem.png')

> Nota: Modelagem feita no [BR Modelo Web](https://app.brmodeloweb.com)
