<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>


## wifi SENA

aprendices
Apr3nd1z2025**
## In Foreing CPU
   01. habilitar permisos
   ```
   Set-ExecutionPolicy RemoteSigned -Scope LocalMachine
   ```
   02. Firewall Advanced Config
   03. Intalar yanr 
   ```
   npm install -g yarn
   ```
   04. Update TS
   ```
   npm install typescript@latest
   ```
   05. Confirm extrenal conflict with TS version (VS extensions)
   


# Ejecutar en Desarrollo

  1. Clonar Repo
  2. Ejecutar
  ``` 
  yarn install
  ```
  3. Tener Nest CLI instalado
  ``` 
  npm i -g @nestjs/cli
  ```
  3-1.
  Crear .ENV
  
  4. Levantar BD
  ``` 
  docker-compose up
  ```
  5. Bajar BD ( Eliminar )
  ``` 
  docker-compose down -p
  ```
  6. LEvantar modo dev
  ```
  yarn start:dev
  ```

  7. Llenar DB
  ```
  http:localhost:3000/api/seed
  ```
  


## Stack

* NestJS