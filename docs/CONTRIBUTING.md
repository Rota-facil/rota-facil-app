# Visão Geral

O Rota Fácil é uma plataforma criada para modernizar e centralizar o gerenciamento do transporte escolar municipal. O sistema conecta prefeituras, motoristas e estudantes em torno de rotas, viagens e operações de transporte, reduzindo falhas de comunicação e aumentando a visibilidade sobre o serviço prestado.

O aplicativo mobile é uma das principais interfaces da plataforma. Desenvolvido com React Native, Expo e TypeScript, ele atende diferentes perfis de usuário e permite que as principais operações relacionadas ao transporte sejam executadas diretamente pelo dispositivo móvel.

Estudantes podem acompanhar viagens, consultar informações de rotas, acompanhar eventos relevantes do transporte e realizar check-in por QR Code. Motoristas podem visualizar as viagens previstas para o dia, consultar listas de estudantes, acompanhar rotas e executar operações relacionadas ao transporte.

A aplicação é organizada para permitir que as experiências de estudantes e motoristas evoluam de forma independente, compartilhando a mesma infraestrutura de comunicação, regras de negócio, tratamento de erros e estado global.

## Tecnologias Principais

O projeto utiliza React Native e Expo como base da aplicação mobile. A navegação é implementada com Expo Router e o código é escrito em TypeScript com tipagem estrita.

React Hook Form é utilizado para gerenciamento de formulários, estados de campos e fluxo de submissão. O Biome é responsável pela formatação, organização de imports e análise estática do código.

A arquitetura também prevê integração futura com uma solução de observabilidade, como Sentry ou Crashlytics, e com um mecanismo centralizado de feedback ao usuário, como toast ou snackbar.


## Como Contribuir

Antes de implementar uma alteração, examine arquivos próximos e módulos semelhantes. O projeto privilegia consistência arquitetural e evolução incremental, portanto novos padrões devem ser introduzidos apenas quando houver uma necessidade concreta.

Cada alteração deve ser colocada na camada responsável por seu comportamento. Comunicação com endpoints pertence a `http/request`. Contratos externos pertencem a `http/dto`. Regras de negócio pertencem a `core/service`. Conversão entre DTOs e modelos da aplicação pertence a `core/mappers`. Estado assíncrono consumido pela interface pertence a hooks. Estado compartilhado de longa duração pertence a contextos.

Formulários devem utilizar React Hook Form. Estados como valores dos campos, erros de validação, campos modificados e submissão não devem ser reproduzidos manualmente com múltiplos `useState` quando já são responsabilidade da biblioteca.

Alterações na interface devem respeitar a separação entre componentes inteligentes e componentes de apresentação. Componentes inteligentes coordenam hooks, contexto, estado e ações. Componentes de apresentação recebem propriedades, renderizam a interface e emitem eventos.

Refatorações devem preservar o comportamento observável, salvo quando a alteração de comportamento fizer parte explícita da tarefa. Mudanças arquiteturais amplas não devem ser misturadas com correções pequenas ou funcionalidades isoladas. 

Toda implementação deve priorizar legibilidade, previsibilidade e baixo acoplamento. Nomes de arquivos, funções, variáveis e componentes devem possuir significado explícito e consistente com o domínio da aplicação. Abreviações desnecessárias, nomenclaturas genéricas e estruturas ambíguas devem ser evitadas.

Componentes React devem possuir responsabilidade única e comportamento previsível. Lógicas complexas devem ser extraídas para hooks, serviços ou camadas específicas de domínio. Componentes visuais não devem concentrar regras de negócio, chamadas HTTP ou manipulação excessiva de estado.

Funções devem ser pequenas, coesas e orientadas a uma única responsabilidade. Sempre que possível, priorizar funções puras e reutilizáveis. Duplicação de código deve ser evitada por meio de abstrações consistentes e compartilhamento controlado de comportamento.

A padronização de código é obrigatória em toda contribuição. O projeto utiliza ferramentas de lint, formatação automática e validação estática para garantir consistência entre os ambientes de desenvolvimento. Nenhuma alteração deve ser enviada sem execução prévia das validações locais.

Antes da abertura de um pull request, é obrigatório garantir que a aplicação esteja compilando corretamente, sem erros de lint, sem inconsistências de tipagem e sem código morto. Alterações visuais devem respeitar os padrões de interface já existentes no projeto.


## Validação das Alterações

Toda alteração em código, configuração ou estrutura do projeto deve terminar com:

```bash
npm run format
npm run lint
```

Caso qualquer comando falhe, o problema deve ser corrigido e ambos devem ser executados novamente.

Mudanças apenas em documentação não exigem essa validação.

Além das verificações automáticas, o comportamento alterado deve ser validado manualmente quando aplicável. Mudanças em navegação devem verificar o fluxo de rotas. Mudanças em autenticação devem verificar login e restauração de sessão. Alterações em formulários devem verificar estado, validação e submissão. Funcionalidades de QR Code devem verificar o fluxo de leitura e check-in.

Uma validação não executada deve ser informada explicitamente. Não se deve afirmar que um comportamento foi testado quando a verificação não ocorreu.

## Testes

Ainda não existe infraestrutura de testes automatizados no projeto.

Quando ela for adicionada, os testes deverão preferencialmente permanecer próximos ao código utilizando arquivos `*.test.ts` ou `*.test.tsx`.

A prioridade de cobertura deve começar por regras de negócio e serviços, seguida por mapeadores, hooks e fluxos críticos de interface e formulários.

A ausência atual de testes não justifica mover lógica de negócio para componentes ou acoplar camadas que deveriam permanecer independentes.

## Commits e Pull Requests

O projeto utiliza Conventional Commits, com validação de mensagens por `commitlint`.

Exemplos:

```text
feat: create trip details screen
fix: handle expired session
refactor: move authentication workflow to service
```

Pull requests devem possuir descrição objetiva, contextualizando o problema resolvido, a abordagem utilizada e possíveis impactos técnicos. Sempre que necessário, incluir evidências visuais ou informações complementares que auxiliem a revisão.

Toda contribuição está sujeita à revisão técnica. Alterações poderão ser recusadas caso não estejam alinhadas aos padrões arquiteturais, práticas de qualidade ou diretrizes estabelecidas pela equipe.



## Segurança

Segredos, tokens, credenciais, chaves privadas e arquivos locais de ambiente não devem ser adicionados ao repositório.

Também não devem ser registrados em logs tokens de autenticação, senhas, informações privadas de usuários, conteúdos sensíveis de requisições ou payloads privados de QR Code.

Erros técnicos provenientes de infraestrutura ou backend não devem ser apresentados diretamente ao usuário quando puderem revelar detalhes internos.

A observabilidade deve permanecer centralizada em `logError`, enquanto mensagens ao usuário devem passar por `showError`.

   

## Definição de Conclusão

Uma contribuição está pronta quando o comportamento solicitado foi implementado na camada adequada, as dependências arquiteturais foram preservadas e os fluxos relevantes foram validados.

Para mudanças que não sejam exclusivamente de documentação, `npm run format` e `npm run lint` devem terminar com sucesso.

Nenhuma falha conhecida causada pela alteração deve permanecer escondida ou ignorada. O resultado da contribuição deve informar claramente o que foi alterado e o que foi efetivamente validado.


### Fluxo Recomendado de Desenvolvimento

O fluxo recomendado consiste em:

1. atualizar a branch local;
2. criar branch de feature;
3. implementar alterações;
4. executar lint;
5. executar testes;
6. validar funcionamento manualmente;
7. realizar commit padronizado;
8. abrir pull request.

A execução consistente deste fluxo reduz conflitos, melhora a previsibilidade do projeto e facilita revisões técnicas.


Navegue pela documentação : 

📌 [Overview](../README.md)   
📌 [Estrutura do projeto](./docs/PROJECT_STRUCTURE.md)   
📌 [Como executar o projeto](./docs/RUNNING.md)   
📌 [Principais telas do aplicativo](./docs/SCREENS.md)  
