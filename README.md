# RevSearch (`revsch-app`)

Aplicação front-end em **React + TypeScript** para gerenciamento e avaliação de produtos, categorias, segmentos e lojas.

## Pré-requisitos

- [Node.js](https://nodejs.org/) (LTS recomendado) e `npm` instalados.
- API back-end do projeto em execução.

## Como rodar o projeto

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm start
   ```
   A aplicação ficará disponível em `http://localhost:3000`.

3. **Gerar build de produção (opcional):**
   ```bash
   npm run build
   ```

## O que alterar dependendo da máquina

A URL base da API está configurada em [`src/api.ts`](src/api.ts):

```ts
export const path = "http://localhost:5191";
```

Se na sua máquina o back-end estiver rodando em outra porta ou endereço (por exemplo, `https://localhost:7xxx` ou um IP na rede local), altere o valor de `path` nesse arquivo antes de rodar o projeto.
