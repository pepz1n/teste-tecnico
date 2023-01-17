# teste-técnico

## Instalação

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

