# Guia de Execução do Ambiente — Rota Fácil


Este documento descreve o processo de configuração e execução do ambiente de desenvolvimento do Rota Fácil, incluindo instalação de dependências, inicialização da aplicação e validações obrigatórias utilizadas durante o desenvolvimento.


### Clone do Repositório

O primeiro passo consiste em realizar o clone do repositório oficial do projeto.

```bash
git clone <url-do-repositorio>
```

Após o clone:

```bash
cd rota-facil
```

O acesso à pasta correta do projeto é necessário para que todos os comandos posteriores sejam executados sobre o contexto adequado da aplicação.

<br/>


## Instalação das Dependências

Com o projeto clonado, as dependências devem ser instaladas.

```bash
npm install
```

Este processo realiza:

* download das bibliotecas utilizadas pelo projeto;
* resolução da árvore de dependências;
* instalação das ferramentas de desenvolvimento;
* preparação do ambiente de build;
* configuração das bibliotecas React Native e Expo.

A pasta `node_modules` será criada automaticamente após a instalação.

<br/>
<br/>


### Inicialização do Projeto

Após a instalação das dependências, a aplicação pode ser iniciada em ambiente de desenvolvimento.


```bash
npm run dev
```

Durante a primeira execução, o sistema pode instalar dependências adicionais necessárias para compilação nativa.



### Navegue pela documentação : 

📌 [Overview](../README.md)   
📌 [Como contribuir](./docs/CONTRIBUTING.md)   
📌 [Estrutura do projeto](./docs/PROJECT_STRUCTURE.md)   
📌 [Principais telas do aplicativo](./docs/SCREENS.md)  
