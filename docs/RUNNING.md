# Guia de Execução do Ambiente — Rota Fácil


Este documento descreve o processo de configuração e execução do ambiente de desenvolvimento do Rota Fácil, incluindo instalação de dependências, inicialização da aplicação e validações obrigatórias utilizadas durante o desenvolvimento.

# Requisitos do Ambiente

```txt
┌───────────┐    ┌───────────┐    ┌───────────┐
│  Node.js  │───▶│    npm    │───▶│   Expo    │
└───────────┘    └───────────┘    └───────────┘
       │                                   │
       ▼                                   ▼
┌───────────────┐               ┌────────────────┐
│ Android Studio│               │     Xcode      │
└───────────────┘               └────────────────┘
```

O projeto utiliza como base o ecossistema Node.js com Expo para desenvolvimento mobile.

Antes da execução do projeto, o ambiente deve possuir:

* Node.js em versão LTS;
* npm instalado;
* Git configurado;
* Android Studio para execução Android;
* Xcode para execução iOS em ambientes macOS;
* Expo CLI disponível via `npx`.

A utilização de versões desatualizadas do Node.js pode gerar incompatibilidades com dependências do projeto, problemas de build e falhas em bibliotecas nativas.

<br/>

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

```txt
┌─────────────────┐
│  npm run dev    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Metro Bundler   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Ambiente Expo   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Bundle React    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Android / iOS   │
└─────────────────┘
```

Após a instalação das dependências, a aplicação pode ser iniciada em ambiente de desenvolvimento.

```bash
npm run dev
```

Em projetos Expo, este comando normalmente inicia:

* servidor Metro;
* empacotamento da aplicação;
* ambiente de desenvolvimento React Native;
* ferramentas de debug.

Caso o script `dev` não esteja configurado, a execução pode ser realizada diretamente com Expo:

```bash
npx expo start
```

Este comando inicia o servidor responsável por:

* geração do bundle da aplicação;
* atualização em tempo real;
* integração com emuladores;
* conexão com Expo Go;
* suporte a desenvolvimento multiplataforma.

<br/>
<br/>

### Execução Android

```txt
┌──────────────┐
│  Expo CLI    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Build Android│
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Dependências │
│    Nativas   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Emulador    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Aplicação    │
└──────────────┘
```

Para execução Android:

```bash
npx expo run:android
```

Este processo realiza:

* geração da build Android;
* instalação das dependências nativas;
* abertura do emulador;
* compilação do aplicativo;
* instalação automática no dispositivo virtual.

O Android Studio deve estar corretamente configurado com:

* Android SDK;
* variáveis de ambiente;
* emulador Android ativo.

Problemas nesta etapa geralmente estão relacionados à configuração incorreta do SDK ou ausência de dispositivos virtuais.

<br/>
<br/>

### Execução iOS

```txt
┌──────────────┐
│  Expo CLI    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Integração   │
│    Xcode     │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Build iOS    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Simulador    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Aplicação    │
└──────────────┘
```

Para execução iOS:

```bash
npx expo run:ios
```

A execução iOS exige:

* macOS;
* Xcode instalado;
* simuladores configurados.

Durante a primeira execução, o sistema pode instalar dependências adicionais necessárias para compilação nativa.




Navegue pela documentação : 

📌 [Overview](../README.md)   
📌 [Como contribuir](./docs/CONTRIBUTING.md)   
📌 [Estrutura do projeto](./docs/PROJECT_STRUCTURE.md)   
📌 [Principais telas do aplicativo](./docs/SCREENS.md)  