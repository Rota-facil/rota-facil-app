# Guia de Development Build — Rota Fácil

Este documento descreve como gerar e manter o Development Build utilizado pelo Rota Fácil durante o desenvolvimento.

O Development Build é uma versão própria da aplicação preparada para executar os módulos, permissões e configurações nativas exigidas pelo projeto. Ele substitui o Expo Go como ambiente principal de execução e permite que o aplicativo se conecte ao Metro durante o desenvolvimento.

Para a maioria dos contribuidores, não é necessário gerar um Development Build manualmente. O aplicativo de desenvolvimento compatível com a versão atual do projeto será disponibilizado pelos mantenedores e deverá ser instalado no dispositivo ou emulador utilizado durante o desenvolvimento.

A geração de novos builds é necessária principalmente quando a configuração nativa da aplicação for alterada. Mantenedores e contribuidores com acesso ao projeto no EAS podem realizar essa compilação utilizando o EAS Build. Quando o acesso ao EAS não estiver disponível e uma alteração nativa precisar ser validada imediatamente, o projeto também pode ser compilado localmente.

<br/>
<br/>
<br/>

## O que é um Development Build

O Development Build é uma versão de desenvolvimento própria do Rota Fácil. Diferentemente do Expo Go, que utiliza um runtime nativo genérico mantido pelo Expo, o Development Build é compilado utilizando as dependências, permissões, config plugins e demais configurações nativas definidas pelo projeto.

O aplicativo gerado contém o `expo-dev-client` e pode se conectar ao Metro para receber o código JavaScript e TypeScript durante o desenvolvimento. Depois que o Development Build estiver instalado, alterações comuns no código da aplicação não exigem uma nova compilação nativa.

<br/>
<br/>
<br/>

## Uso do Build Disponibilizado pelo Projeto

O fluxo padrão para contribuidores consiste em utilizar o Development Build disponibilizado pelos mantenedores do Rota Fácil. O APK deve corresponder à configuração nativa atual do projeto e pode ser instalado em um dispositivo Android físico ou Android Emulator.


O Development Build instalado deve ser aberto e conectado ao servidor apresentado pelo Expo. Enquanto não houver mudanças na configuração nativa da aplicação, o mesmo aplicativo pode continuar sendo utilizado normalmente. A geração manual de um novo build não é necessária para alterações em telas, componentes, hooks, services, requests, contexts, repositories ou regras de negócio.

<br/>
<br/>
<br/>

## Quando um Novo Development Build é Necessário

Um novo Development Build deve ser gerado quando uma alteração modificar a composição ou configuração nativa da aplicação. Isso pode ocorrer após a instalação ou remoção de uma biblioteca com código nativo, alteração de um config plugin, modificação de permissões ou mudanças em propriedades utilizadas durante a geração dos projetos Android e iOS.

Exemplos de alterações que podem exigir um novo build:

```text
instalação de um novo módulo nativo
remoção de uma dependência nativa
alteração de config plugins
mudança de permissões Android ou iOS
alteração da configuração do expo-location
mudança do package da aplicação
alterações nativas relevantes no app.json ou app.config
```

Alterações exclusivamente relacionadas ao bundle JavaScript ou TypeScript não exigem uma nova compilação.

Exemplos:

```text
telas
componentes
hooks
services
requests
contexts
repositories
mappers
validações
regras de negócio
```

<br/>
<br/>
<br/>

## Responsabilidade dos Mantenedores

Os mantenedores do projeto são responsáveis por manter um Development Build compatível com a configuração nativa atualmente versionada. Quando uma alteração nativa for aprovada e integrada ao projeto, um novo build deve ser gerado e disponibilizado para os demais contribuidores.

Esse processo evita que todos os desenvolvedores precisem configurar um ambiente completo de compilação Android apenas para executar a aplicação. O build disponibilizado deve representar o estado atual das dependências e configurações nativas utilizadas pelo projeto.

Quando houver incompatibilidade entre o Development Build instalado e o projeto atual, funcionalidades nativas podem deixar de funcionar mesmo que o Metro consiga carregar o código JavaScript corretamente.

<br/>
<br/>
<br/>

## Antes de Adicionar uma Dependência Externa

Antes de instalar uma nova biblioteca, verifique se ela utiliza apenas JavaScript ou se depende de código nativo. Bibliotecas exclusivamente JavaScript normalmente podem ser instaladas e utilizadas sem a geração de um novo Development Build.

Uma dependência com módulos Android, módulos iOS ou config plugins precisa estar presente no runtime nativo da aplicação.

Nesse cenário, apenas executar:

```bash
npm install <biblioteca>
```

não torna a nova funcionalidade disponível no Development Build já instalado. O aplicativo instalado continua representando a configuração nativa existente no momento em que foi compilado. Quando uma nova dependência nativa for realmente necessária, a alteração deve seguir os padrões de contribuição e arquitetura definidos pelo projeto.

<br/>
<br/>
<br/>

## Alteração Nativa sem Acesso Imediato ao Mantenedor

Pode ocorrer de um contribuidor precisar validar uma biblioteca nativa ou uma alteração de configuração antes de conseguir contato com um mantenedor responsável pela geração do build oficial.

Nesse cenário, não é recomendado bloquear completamente o desenvolvimento aguardando um novo build remoto. Quando houver necessidade real de validar uma alteração nativa e o acesso ao projeto no EAS não estiver disponível, o Development Build pode ser gerado localmente.

O build local deve ser utilizado para desenvolvimento e validação da alteração. Ele não substitui automaticamente o build distribuído oficialmente aos demais contribuidores. Após a validação, a alteração deve ser revisada e, quando aprovada, um mantenedor deverá gerar e disponibilizar um novo Development Build compatível com a configuração integrada ao projeto.

<br/>
<br/>
<br/>

## Validações Antes da Compilação

Antes de gerar qualquer Development Build, valide a instalação de dependências.

```bash
rm -rf node_modules
npm ci --include=dev
```

Execute as validações obrigatórias do projeto.

```bash
npm run format
```

```bash
npm run lint
```

Verifique também a integridade do ambiente Expo.

```bash
npx expo-doctor
```

A configuração pública resolvida pelo Expo pode ser inspecionada com:

```bash
npx expo config --type public
```

Essas validações devem ser executadas antes do build remoto ou local.

Uma falha no `npm ci` deve ser corrigida antes da compilação. O `package.json` e o `package-lock.json` precisam permanecer sincronizados.

<br/>
<br/>
<br/>

## Geração pelo EAS Build

A geração pelo EAS Build é o fluxo recomendado para os mantenedores e contribuidores autorizados a acessar o projeto no EAS. O EAS realiza a compilação em um ambiente remoto e não exige que o desenvolvedor possua todo o toolchain Android configurado localmente.

O EAS CLI deve estar disponível no ambiente.

```bash
npm install --global eas-cli
```

Confirme a instalação.

```bash
eas --version
```

Realize o login na conta Expo.

```bash
eas login
```

Verifique o usuário autenticado.

```bash
eas whoami
```

A conta utilizada deve possuir acesso ao projeto Rota Fácil configurado no EAS.

<br/>
<br/>
<br/>

## Configuração do Projeto no EAS

O projeto deve estar vinculado a uma aplicação válida no EAS. Essa vinculação normalmente pode ser identificada pelo `projectId` presente na configuração Expo.

Exemplo:

```json
{
  "expo": {
    "extra": {
      "eas": {
        "projectId": "<project-id>"
      }
    }
  }
}
```

Os perfis de build são definidos no arquivo `eas.json`. O perfil utilizado para gerar o Development Build deve possuir `developmentClient` habilitado.

Exemplo:

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    }
  }
}
```

A configuração versionada no projeto deve ser considerada a fonte de verdade. Não altere o `eas.json`, o `projectId` ou as credenciais do projeto apenas para executar um build local sem compreender o impacto da mudança.

<br/>
<br/>
<br/>

## Gerando o Build pelo EAS

Após validar o projeto e autenticar uma conta autorizada, execute:

```bash
eas build --platform android --profile development
```

O projeto será preparado e enviado ao ambiente remoto de compilação.

O fluxo funciona da seguinte forma:

```text
Projeto local
     ↓
   EAS CLI
     ↓
Upload do projeto
     ↓
Servidor do EAS
     ↓
Instalação das dependências
     ↓
Compilação Android
     ↓
Development Build
```

Após a conclusão, o EAS disponibilizará o artefato de instalação. O build gerado com o perfil de desenvolvimento pode ser distribuído internamente para os contribuidores autorizados a trabalhar no projeto.

<br/>
<br/>
<br/>

## Instalação do Build Gerado pelo EAS

Após a conclusão do build, o APK pode ser acessado através da página disponibilizada pelo EAS. O arquivo pode ser baixado diretamente em um dispositivo Android físico e instalado normalmente. Quando disponibilizado um QR Code de instalação, ele também pode ser utilizado para acessar o artefato pelo celular.

Após a instalação, inicie o Metro na máquina de desenvolvimento.

```bash
npm run start
```

Abra o Rota Fácil no dispositivo e conecte o Development Build ao servidor Metro. A partir desse momento, o desenvolvimento retorna ao fluxo normal descrito no guia de execução do ambiente.

<br/>
<br/>
<br/>

## Geração Local do Development Build

A compilação local é indicada quando uma alteração nativa precisa ser validada e o desenvolvedor não possui acesso ao projeto no EAS ou não consegue solicitar imediatamente um novo build aos mantenedores.

Para compilar o aplicativo localmente no Android, é necessário possuir um ambiente Android configurado. O ambiente deve disponibilizar os recursos necessários para compilação e instalação da aplicação, incluindo Java, Android SDK, ferramentas de build e ADB. O dispositivo físico pode ser utilizado diretamente. Não é obrigatório utilizar um Android Emulator.

Conecte o dispositivo Android ao computador e confirme que ele está disponível.

```bash
adb devices
```

O dispositivo deve aparecer com o estado `device`.

Exemplo:

```text
List of devices attached
XXXXXXXXXXXX    device
```

Com o ambiente configurado e o dispositivo disponível, execute:

```bash
npx expo run:android
```

O Expo preparará a configuração nativa necessária, executará a compilação Android e instalará o aplicativo no dispositivo conectado. O fluxo funciona da seguinte forma:

```text
Configuração Expo
       ↓
npx expo run:android
       ↓
Geração da configuração nativa
       ↓
Gradle
       ↓
APK de desenvolvimento
       ↓
Instalação via ADB
       ↓
Aplicação no dispositivo
```

Esse processo é diferente do fluxo diário com `npm run start`. O comando `npx expo run:android` deve ser utilizado para gerar ou atualizar o runtime nativo localmente. Depois que o aplicativo estiver instalado, alterações comuns no código voltam a utilizar o Metro.

<br/>
<br/>
<br/>

## Build Local em Android Emulator

O Development Build também pode ser compilado e instalado em um Android Emulator, primeiro, inicie o emulador e confirme que ele está disponível.

```bash
adb devices
```

Exemplo:

```text
List of devices attached
emulator-5554    device
```

Em seguida, execute:

```bash
npx expo run:android
```

O Expo utilizará o dispositivo Android disponível para instalar a aplicação compilada, após a instalação, o fluxo diário utiliza:

```bash
npm run start
```

No terminal do Expo, a opção Android pode ser utilizada para abrir o Development Build no emulador.

<br/>
<br/>
<br/>

## Build Local e Diretórios Nativos

O uso de `npx expo run:android` pode gerar os arquivos nativos necessários para a compilação local. O projeto deve continuar seguindo a estratégia Expo definida pelos mantenedores e não deve passar a manter alterações manuais nos projetos Android ou iOS sem uma decisão arquitetural explícita.

Configurações nativas devem continuar sendo declaradas, sempre que possível, através do `app.json`, `app.config`, config plugins e dependências Expo compatíveis. Não altere manualmente arquivos Android gerados apenas para corrigir temporariamente uma funcionalidade. Mudanças manuais podem ser perdidas em uma nova geração do projeto nativo e criar diferenças entre o ambiente local e os builds executados pelo EAS.

<br/>
<br/>
<br/>

## Diferença entre Build Local e EAS Build

O Development Build gerado localmente e o build gerado pelo EAS possuem o mesmo objetivo: criar um runtime de desenvolvimento compatível com a configuração nativa do projeto.

A principal diferença está no local onde a compilação é executada.

```text
Build local

Projeto
   ↓
Máquina do desenvolvedor
   ↓
Android SDK e Gradle locais
   ↓
Development Build
```

```text
EAS Build

Projeto
   ↓
Servidores do EAS
   ↓
Ambiente de build remoto
   ↓
Development Build
```

O EAS Build é preferido para a distribuição do build utilizado pela equipe, pois centraliza a compilação e reduz diferenças entre ambientes locais. O build local é uma alternativa prática para desenvolvimento e validação imediata de mudanças nativas.

<br/>
<br/>
<br/>

## Qual Abordagem Utilizar

Contribuidores que não estão alterando a configuração nativa devem utilizar o Development Build fornecido pelos mantenedores. Mantenedores e contribuidores autorizados a acessar o projeto no EAS devem utilizar o EAS Build quando um novo runtime precisar ser disponibilizado para a equipe. Contribuidores que precisam validar uma alteração nativa e não possuem acesso imediato ao build oficial podem utilizar a compilação local com:

```bash
npx expo run:android
```

Depois que a alteração for revisada e integrada, o build oficial deve ser novamente gerado e disponibilizado pelos mantenedores. O build local deve ser tratado como ferramenta de desenvolvimento e validação, enquanto o build disponibilizado pelos mantenedores representa o ambiente de desenvolvimento compartilhado pela equipe.

<br/>
<br/>
<br/>

## Problemas com Dependências no EAS

O ambiente do EAS executa uma instalação limpa das dependências do projeto, o `package.json` e o `package-lock.json` devem estar sincronizados.

Antes de iniciar um build, valide:

```bash
rm -rf node_modules
npm ci --include=dev
```

Quando uma falha de instalação ocorrer apenas no EAS, verifique a versão do Node.js e do npm apresentada nos logs do build. Quando necessário, reproduza localmente o comando utilizando a mesma versão do npm.

Exemplo:

```bash
npx npm@10.8.2 ci --include=dev
```

O objetivo é reproduzir a mesma resolução de dependências utilizada pelo ambiente remoto, o `package-lock.json` não deve ser corrigido manualmente.

<br/>
<br/>
<br/>

## Fluxo Recomendado para Mantenedores

Antes do build, valide o projeto.

```bash
rm -rf node_modules
npm ci --include=dev
npm run format
npm run lint
npx expo-doctor
```

Gere o Development Build.

```bash
eas build --platform android --profile development
```

Após a conclusão, valide a instalação em dispositivo físico e disponibilize o build atualizado para os contribuidores. O novo build deve ser comunicado sempre que o Development Build anterior deixar de representar a configuração nativa atual do projeto.

<br/>
<br/>
<br/>

## Fluxo Recomendado para Contribuidores

Utilize o Development Build disponibilizado pelos mantenedores e execute o projeto normalmente.

```bash
npm run start
```

Quando uma alteração nativa for necessária, verifique primeiro se um novo build pode ser solicitado aos mantenedores. Caso o desenvolvimento dependa imediatamente dessa alteração e o acesso ao EAS não esteja disponível, configure o ambiente Android local e gere um build com:

```bash
npx expo run:android
```

Após a validação, documente a necessidade da alteração nativa e mantenha os mantenedores informados para que um novo Development Build compartilhado possa ser gerado.

<br/>
<br/>
<br/>

## Documentação Relacionada

📌 [Guia de execução do ambiente](./RUNNING.md)
📌 [Overview](../README.md)
📌 [Como contribuir](./CONTRIBUTING.md)
📌 [Estrutura do projeto](./PROJECT_STRUCTURE.md)