# Guia de Execução do Ambiente — Rota Fácil

Este documento descreve como configurar e executar o ambiente de desenvolvimento do Rota Fácil.

O projeto utiliza Expo com Development Build. O Expo Go não é mais o ambiente principal de execução da aplicação, pois o projeto depende de recursos e configurações nativas específicas. Durante o desenvolvimento, o código JavaScript e TypeScript é processado pelo Metro e enviado para o Development Build instalado no dispositivo ou emulador. A geração de um novo Development Build não faz parte do fluxo diário de desenvolvimento. Esse processo está documentado separadamente no guia de EAS Build.

<br/>
<br/>
<br/>

## Requisitos do Ambiente

Antes de executar o projeto, é necessário possuir Node.js e npm compatíveis com as versões definidas pelo projeto. As versões esperadas devem ser respeitadas para evitar divergências entre o ambiente local, o CI e os builds executados pelo EAS. Também é necessário possuir acesso ao repositório e às variáveis de ambiente utilizadas pela aplicação.

Para execução em dispositivo físico, o computador e o celular devem estar preferencialmente conectados à mesma rede local.

Para execução em Android Emulator, é necessário possuir um ambiente Android configurado e um emulador disponível.

<br/>
<br/>
<br/>

## Clone do Repositório

Clone o repositório oficial do projeto.

```bash
git clone <url-do-repositorio>
```

Acesse a pasta do projeto.

```bash
cd rota-facil-app
```

Todos os comandos apresentados neste documento devem ser executados a partir da raiz da aplicação.

<br/>
<br/>
<br/>

## Instalação das Dependências

As dependências devem ser instaladas utilizando o lockfile versionado no repositório.

```bash
npm ci --include=dev
```

O uso de `npm ci` garante que a instalação respeite a árvore de dependências registrada no `package-lock.json`. Esse é o fluxo recomendado para preparar um ambiente já existente e deve ser preferido ao `npm install` quando não houver intenção de alterar dependências. O comando `npm install` deve ser utilizado apenas quando for necessário adicionar, remover ou atualizar pacotes e, consequentemente, atualizar o `package-lock.json`.

Após a instalação, a pasta `node_modules` será criada automaticamente.

<br/>
<br/>
<br/>

## Configuração das Variáveis de Ambiente

A aplicação utiliza variáveis de ambiente públicas do Expo por meio do prefixo `EXPO_PUBLIC_`. As configurações específicas do ambiente local devem ser definidas no arquivo `.env`.

Exemplo:

```env
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.25:8080
```

Quando o backend estiver sendo executado no computador e a aplicação for aberta em um dispositivo físico, a URL deve utilizar o IP local da máquina. O endereço abaixo não deve ser utilizado nesse cenário:

```env
EXPO_PUBLIC_API_BASE_URL=http://localhost:8080
```

No celular, `localhost` representa o próprio dispositivo e não a máquina responsável por executar o backend. Sempre que uma variável utilizada pelo código JavaScript ou TypeScript for alterada, reinicie o servidor Metro.

<br/>
<br/>
<br/>

## Inicialização do Projeto

Com as dependências instaladas e as variáveis de ambiente configuradas, inicie o servidor de desenvolvimento.

```bash
npm run start
```

Esse comando inicia o Metro e disponibiliza o bundle da aplicação para os Development Builds compatíveis com o projeto. O terminal exibirá as opções de conexão e, quando aplicável, um QR Code para abertura do projeto.

O fluxo de desenvolvimento funciona da seguinte forma:

```text
Código JavaScript e TypeScript
            ↓
          Metro
            ↓
         Bundle
            ↓
    Development Build
            ↓
      Aplicação em execução
```

Alterações comuns em telas, componentes, hooks, services, requests, contexts e regras de negócio são processadas pelo Metro. Essas alterações normalmente utilizam Fast Refresh e não exigem a geração de um novo APK ou Development Build.

<br/>
<br/>
<br/>

## Execução em Dispositivo Android Físico

O fluxo recomendado para validar funcionalidades reais do aplicativo utiliza um dispositivo Android físico. O Development Build do Rota Fácil deve estar previamente instalado no aparelho. A geração e instalação desse aplicativo estão descritas no documento específico de EAS Build.

Com o computador e o dispositivo conectados à mesma rede local, inicie o Metro.

```bash
npm run start
```

Em seguida, abra o aplicativo Rota Fácil instalado no dispositivo. O Development Build possui um ambiente próprio de desenvolvimento e pode se conectar ao servidor Metro disponível na rede. Também é possível utilizar o QR Code exibido no terminal. Ao abrir o endereço correspondente no celular, o Android deve direcionar a execução para o Development Build do Rota Fácil.

O fluxo é:

```text
Computador
    ↓
npm run start
    ↓
Metro disponível na rede
    ↓
Rota Fácil no celular
    ↓
Conexão com o servidor
    ↓
Aplicação carregada
```

Durante o desenvolvimento, basta manter o Metro em execução e o aplicativo conectado ao servidor. Após alterações no código, o Fast Refresh atualizará a aplicação automaticamente quando suportado. Caso o celular não consiga localizar o servidor, verifique se ambos os dispositivos estão na mesma rede e se o firewall da máquina permite acesso à porta utilizada pelo Metro.

<br/>
<br/>
<br/>

## Execução em Android Emulator

O projeto também pode ser executado em um Android Emulator. Para esse fluxo, o emulador deve possuir um Development Build compatível com a configuração nativa atual do projeto. Primeiro, inicie o Android Emulator utilizando o ambiente Android configurado na máquina.

Com o emulador ativo, inicie o Metro.

```bash
npm run start
```

No terminal do Expo, utilize a opção de abertura no Android.

Normalmente, isso pode ser feito pressionando:

```text
a
```

O Expo tentará localizar o dispositivo Android conectado ou o emulador ativo e abrir o Development Build correspondente.

O fluxo é:

```text
Android Emulator iniciado
          ↓
    npm run start
          ↓
         Metro
          ↓
pressionar "a" no terminal
          ↓
Development Build no emulador
          ↓
Aplicação conectada ao Metro
```

Caso o Development Build ainda não esteja instalado no emulador, será necessário instalar um APK compatível antes de utilizar esse fluxo. A utilização do emulador não substitui os testes em dispositivo físico para funcionalidades dependentes de GPS real, comportamento em segundo plano, bateria, permissões do sistema e condições reais de conectividade.

<br/>
<br/>
<br/>

## Development Build e Expo Go

O Rota Fácil utiliza Development Build como ambiente principal de desenvolvimento. O Expo Go não deve ser considerado uma forma válida de validar completamente o projeto, pois possui um runtime nativo genérico e não representa todas as configurações nativas utilizadas pela aplicação. O Development Build é um aplicativo próprio do Rota Fácil que contém os módulos nativos, permissões e configurações compatíveis com o projeto.

O Metro continua responsável por fornecer o código JavaScript e TypeScript durante o desenvolvimento. Essa separação permite alterar o código da aplicação sem recompilar o aplicativo nativo a cada modificação.

<br/>
<br/>
<br/>

## Quando um Novo Development Build é Necessário

Um novo Development Build deve ser gerado quando houver alterações na composição ou configuração nativa da aplicação. Isso inclui instalação ou remoção de bibliotecas com código nativo, alteração de config plugins, mudanças de permissões Android ou iOS e modificações em configurações nativas do Expo.

Exemplos de mudanças que podem exigir um novo build:

```text
instalação de novo módulo nativo
alteração do plugin expo-location
mudança de permissões
alteração de configuração nativa
mudança de application package
```

Alterações exclusivamente no código JavaScript ou TypeScript normalmente não exigem recompilação.

Exemplos:

```text
telas
componentes
hooks
services
requests
contexts
repositories
validações
regras de negócio
```

Nesses casos, basta utilizar o fluxo normal com:

```bash
npm run start
```

<br/>
<br/>
<br/>


## Validação do Ambiente

Antes de enviar alterações, execute as validações definidas pelo projeto.

```bash
npm run format
```

```bash
npm run lint
```

Também é recomendado verificar a integridade do ambiente Expo.

```bash
npx expo-doctor
```

Quando houver alterações em dependências ou no `package-lock.json`, valide uma instalação limpa.

```bash
rm -rf node_modules
npm ci --include=dev
```

Esse teste reduz diferenças entre o ambiente local e os ambientes automatizados de CI e build.

<br/>
<br/>
<br/>

## Fluxo Diário de Desenvolvimento

Depois que o Development Build estiver instalado no dispositivo ou emulador, o fluxo diário de desenvolvimento é simples. Inicie o backend quando necessário, confirme que o `.env` aponta para o ambiente correto e inicie o Metro.

```bash
npm run start
```

Abra o Rota Fácil no dispositivo físico ou utilize o Android Emulator, conecte o Development Build ao servidor Metro. A partir desse momento, alterações comuns no código são enviadas diretamente para a aplicação e não exigem recompilação nativa. A geração de um novo Development Build deve ser realizada apenas quando a configuração nativa do projeto for modificada.

<br/>
<br/>
<br/>

## Documentação Relacionada

📌 [Overview](../README.md)
📌 [Como contribuir](./CONTRIBUTING.md)
📌 [Estrutura do projeto](./PROJECT_STRUCTURE.md)
📌 [Principais telas do aplicativo](./SCREENS.md)
📌 [Geração de Development Build com EAS](./EAS_BUILD.md)
