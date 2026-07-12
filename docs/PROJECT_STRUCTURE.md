# Estrutura e Diretrizes Arquiteturais — Rota Fácil Mobile

O Rota Fácil Mobile foi estruturado com foco em separação de responsabilidades, baixo acoplamento e evolução contínua. A organização do projeto busca evitar que regras de negócio, comunicação com APIs, gerenciamento de estado e construção da interface sejam concentrados nos mesmos módulos, reduzindo a complexidade das implementações e facilitando a manutenção da aplicação.

A arquitetura foi definida para atender diferentes experiências dentro do mesmo aplicativo. Estudantes e motoristas possuem fluxos distintos, mas compartilham recursos como autenticação, comunicação HTTP, tratamento de erros, estado de sessão e regras de negócio. A estrutura do projeto procura preservar essa independência sem duplicar infraestrutura ou comportamento.

```txt
src/
 ├── app/
 ├── context/
 ├── core/
 │    ├── entity/
 │    ├── mappers/
 │    └── service/
 ├── errors/
 ├── hooks/
 ├── http/
 │    ├── dto/
 │    ├── httpClient/
 │    └── request/
 ├── presentation/
 │    ├── shared/
 │    ├── student/
 │    └── driver/
 └── utils/
```

A aplicação é organizada por responsabilidade técnica e domínio de apresentação. Cada módulo possui uma função específica e deve respeitar os limites definidos pela arquitetura.
<br>


## Camada de Rotas

A pasta `app/` concentra a navegação e a composição global da aplicação. Nela ficam as rotas do Expo Router, os agrupamentos de navegação, os layouts e as estruturas responsáveis por inicializar comportamentos globais.

Os arquivos de rota devem permanecer simples e atuar principalmente como pontos de entrada para as telas. Regras de negócio, requisições HTTP, transformação de dados e grandes estruturas visuais não devem ser implementadas diretamente nessa camada.

O layout principal pode compor providers, configurações de navegação, estilos globais, inicialização de sessão e outras estruturas necessárias ao funcionamento geral do aplicativo.

<br>

## Camada HTTP

A pasta `http/` concentra a comunicação externa da aplicação e é dividida em contratos de transporte, requests específicos e infraestrutura genérica de comunicação.

A pasta `http/dto/` contém os modelos que representam os contratos da API. Esses objetos podem refletir nomes de campos definidos pelo backend, valores opcionais, datas serializadas e estruturas específicas da camada de transporte.

DTOs não devem ser utilizados como modelos principais da aplicação. Sua responsabilidade está limitada à comunicação entre o cliente e os serviços externos.

A pasta `http/request/` concentra as chamadas aos endpoints. Cada módulo deve representar um conjunto coerente de operações relacionadas a um recurso ou domínio, como autenticação, usuários, estudantes, motoristas, viagens ou rotas.

Requests devem receber dados compatíveis com os contratos externos, utilizar o cliente HTTP e retornar DTOs ou resultados de transporte. Eles não devem executar regras de negócio, manipular estado do React, realizar navegação ou apresentar mensagens ao usuário.

A pasta `http/httpClient/` concentra a infraestrutura genérica de comunicação HTTP. Nela ficam configurações como URL base, headers, autenticação, serialização, parsing de respostas, tratamento de status HTTP e falhas de rede.

O cliente HTTP deve permanecer independente dos domínios da aplicação. Ele não deve conhecer estudantes, motoristas, viagens, telas ou fluxos específicos de negócio.

<br>

## Camada Core

A pasta `core/` concentra os conceitos centrais da aplicação e as regras que não dependem diretamente da interface.

A pasta `core/entity/` contém os modelos utilizados internamente pelo sistema. As entidades representam conceitos da aplicação e devem ser utilizadas pelas regras de negócio e pela apresentação sempre que possível.

A separação entre DTOs e entidades protege a aplicação contra mudanças no contrato do backend. Alterações na estrutura externa podem ser absorvidas na camada de mapeamento sem obrigar componentes e regras de negócio a depender diretamente da API.

A pasta `core/mappers/` é responsável pela conversão entre contratos externos e modelos internos. Os mapeadores podem renomear campos, normalizar valores opcionais, converter datas, transformar estruturas aninhadas e remover detalhes específicos da comunicação.

Os mapeadores devem permanecer previsíveis e, sempre que possível, determinísticos. Eles não devem executar requisições, alterar estado, realizar navegação ou produzir efeitos visuais.

A pasta `core/service/` concentra as regras de negócio e os fluxos da aplicação. Services podem coordenar requests, converter DTOs em entidades, acessar armazenamento local, combinar múltiplas fontes de dados, validar regras da aplicação e executar operações compostas por várias etapas.

Um fluxo de autenticação, por exemplo, pode realizar a requisição de login, converter a resposta recebida, persistir o token e retornar uma sessão pronta para uso pelas camadas superiores.

Services devem permanecer independentes da interface. Eles não devem renderizar componentes, utilizar hooks, controlar estado visual ou apresentar mensagens diretamente ao usuário.


<br>


## Hooks e Estado Compartilhado

A pasta `hooks/` contém os adaptadores entre a lógica da aplicação e o React. Hooks podem executar services, controlar estados de carregamento, armazenar dados utilizados pela interface, expor ações e coordenar comportamentos relacionados ao ciclo de vida dos componentes.

A responsabilidade de um hook é adaptar operações da aplicação ao modelo de estado do React. Regras de negócio não devem ser duplicadas nessa camada.

A pasta `context/` concentra estados compartilhados de longa duração. Contextos devem ser utilizados quando diferentes regiões da aplicação precisam acessar e reagir ao mesmo estado, como ocorre com a sessão autenticada.

Estados visuais temporários devem permanecer próximos aos componentes. Comportamentos React reutilizáveis devem ser implementados em hooks, enquanto regras de negócio permanecem nos services. Contextos devem ser reservados para estados realmente compartilhados entre diferentes partes da aplicação.


<br>


## Camada de Apresentação

A pasta `presentation/` concentra toda a construção visual e a interação com o usuário.

```txt
presentation/
 ├── shared/
 ├── student/
 └── driver/
```

A pasta `presentation/student/` concentra as experiências específicas dos estudantes, como acompanhamento de viagens, consulta de rotas, visualização de informações de transporte e check-in por QR Code.

A pasta `presentation/driver/` concentra os fluxos destinados aos motoristas, incluindo viagens do dia, listas de estudantes, acompanhamento de rotas e operações relacionadas ao transporte.

A pasta `presentation/shared/` contém componentes, telas, estilos, dados e estruturas reutilizáveis entre diferentes domínios. Um elemento não deve ser movido para `shared` apenas porque é reutilizado em mais de uma tela do mesmo domínio. O compartilhamento global deve ocorrer quando a abstração realmente pertence a diferentes experiências da aplicação.

Os componentes compartilhados seguem os princípios do Atomic Design. Os `atoms` representam elementos básicos da interface, como botões, inputs, ícones e indicadores visuais. Os `molecules` combinam elementos menores em estruturas reutilizáveis com responsabilidade específica. Os `organisms` representam blocos funcionais mais complexos compostos por múltiplos componentes.

A aplicação também diferencia componentes inteligentes de componentes de apresentação. Componentes inteligentes coordenam hooks, contextos, estado e ações. Eles conhecem o estado atual da aplicação e transformam dados em propriedades adequadas à interface.

Componentes de apresentação recebem propriedades, renderizam a interface e emitem eventos. Eles não devem conhecer requests, cliente HTTP ou fluxos completos de negócio.

Essa separação reduz o acoplamento entre comportamento e construção visual, permitindo que a interface evolua sem alterar diretamente a lógica da aplicação.

<br>


## Formulários e Validação

Os formulários utilizam React Hook Form para gerenciamento de valores, estado dos campos, validação, erros e submissão.

A utilização da biblioteca estabelece um padrão consistente entre as telas e evita a implementação manual de estados distribuídos entre vários `useState`.

Os schemas de validação pertencem à camada de apresentação. Sua responsabilidade é validar entradas do usuário e fornecer feedback imediato.

Regras de negócio permanecem nos services, enquanto o backend continua responsável pela validação definitiva dos dados.

Após uma submissão válida, o formulário deve delegar a operação a um hook ou componente inteligente, que executará o service correspondente. O formulário não deve realizar requests ou implementar fluxos de negócio diretamente.


<br>


## Arquitetura de Erros

A pasta `errors/` centraliza a classificação e o tratamento de falhas da aplicação.

A arquitetura separa a origem de um erro de sua política de tratamento. A camada onde a falha ocorre deve identificar ou traduzir o problema, enquanto o tratamento deve acontecer em uma fronteira capaz de tomar a decisão adequada.

O fluxo geral segue a seguinte estrutura:

```txt
Failure
 -> ApplicationError
 -> Propagation
 -> handleError
 -> showError / logError
```

Erros conhecidos estendem uma abstração comum chamada `ApplicationError` e definem sua própria política de tratamento.

`HttpServerError` representa respostas HTTP de erro retornadas pelo servidor. Esse tipo de erro normalmente deve ser apresentado ao usuário, sem necessidade de registro no cliente por padrão.

`HttpClientError` representa problemas relacionados à infraestrutura do aplicativo, como falhas de rede, parsing, serialização ou processamento da requisição. Esse tipo de erro deve ser registrado e também apresentado ao usuário quando necessário.

`SoftError` representa condições esperadas da aplicação que exigem feedback ao usuário, mas não devem ser tratadas como falhas técnicas.

`BackgroundError` representa falhas não críticas que devem ser registradas sem interromper o fluxo principal da interface.

A função `handleError` atua como ponto central de despacho. Ela também pode coordenar comportamentos transversais, como encerrar uma sessão quando uma resposta de autenticação indica que o acesso não é mais válido.

A função `showError` representa a fronteira de apresentação de erros e poderá ser integrada futuramente a uma solução de toast ou snackbar.

A função `logError` representa a fronteira de observabilidade e poderá ser integrada futuramente ao Sentry ou Crashlytics.

A aplicação não deve depender diretamente dessas ferramentas em múltiplos módulos. A centralização dessas integrações reduz acoplamento e facilita sua substituição ou evolução.


<br>


## Utilitários

A pasta `utils/` deve conter apenas funções pequenas, puras e reutilizáveis que não pertençam a uma responsabilidade arquitetural mais específica.

Ela não deve ser utilizada como destino genérico para código sem classificação. Regras de negócio pertencem a services, transformação de DTOs pertence a mappers, estado React pertence a hooks e comportamento visual pertence à apresentação.

<br>


## Motivação da Abordagem Arquitetural

A arquitetura foi adotada para melhorar a qualidade de cada módulo e manter responsabilidades bem definidas ao longo da aplicação.

Quando componentes executam requisições, controlam regras de negócio, transformam dados e gerenciam estados complexos simultaneamente, o acoplamento aumenta e pequenas alterações passam a produzir efeitos difíceis de prever.

A separação entre HTTP, regras de negócio, estado e apresentação reduz esse problema ao estabelecer limites claros entre cada parte do sistema.

A camada HTTP conhece apenas contratos e comunicação. A camada core concentra os conceitos e regras da aplicação. Hooks e contextos adaptam essas regras ao React. A camada de apresentação permanece responsável pela experiência visual e pela interação com o usuário.

Essa divisão também prepara o projeto para a introdução de testes automatizados em fases futuras. Services poderão ser testados independentemente da interface, mapeadores poderão ser avaliados como transformações puras, hooks poderão ser verificados a partir de seu comportamento público e componentes poderão ser testados com foco em interação e resultado visual.

Sem essa separação, os testes tendem a exigir muitas dependências simultaneamente, aumentando a complexidade da configuração e reduzindo a capacidade de isolar falhas.

A arquitetura também reduz dificuldades de manutenção. Alterações em endpoints podem ser absorvidas pelos requests e DTOs. Mudanças em contratos externos podem ser isoladas nos mapeadores. Regras de negócio podem evoluir sem obrigar alterações diretas na interface, e componentes visuais podem ser reorganizados sem modificar a forma como os dados são obtidos.

O objetivo não é aumentar o número de camadas, mas reduzir o número de motivos pelos quais um mesmo módulo precisa ser alterado.


<br>


## Visão Geral do Modelo Arquitetural

O modelo arquitetural do Rota Fácil Mobile pode ser entendido como uma cadeia de responsabilidades.

Uma ação iniciada pela interface é encaminhada por um componente inteligente ou hook. O hook adapta a operação ao estado do React e delega o comportamento ao service.

O service executa a regra de negócio e utiliza requests quando precisa se comunicar com serviços externos.

O request utiliza o cliente HTTP e retorna dados conforme o contrato da API. Esses dados são representados por DTOs e convertidos por mapeadores em entidades internas antes de serem utilizados pelo restante da aplicação.

Quando uma falha ocorre, ela é classificada, propagada até uma fronteira apropriada e tratada pelo módulo central de erros.

Essa abordagem reduz acoplamento, duplicação de lógica, dependência direta da interface em contratos externos e dificuldades de teste.

A separação das responsabilidades também aumenta a previsibilidade estrutural. Um colaborador pode identificar onde um comportamento deve ser implementado antes de escrever o código, reduzindo decisões inconsistentes entre diferentes partes do projeto.

A arquitetura permite ainda que diferentes partes da aplicação evoluam de forma independente. A interface pode mudar sem exigir reestruturação dos services. A API pode alterar seus contratos sem obrigar os componentes a consumir novos formatos diretamente. O mecanismo de observabilidade pode ser substituído sem modificar todos os módulos que produzem erros.

O modelo também favorece reutilização. Regras de negócio podem ser consumidas por diferentes fluxos, hooks podem adaptar os mesmos services para múltiplas telas e componentes podem ser compartilhados quando realmente pertencem a mais de um domínio.

O projeto adota, portanto, uma arquitetura orientada a responsabilidades claras, dependências previsíveis e evolução incremental. O objetivo é manter o código legível e modular, ao mesmo tempo em que a aplicação é preparada para novos domínios, novos fluxos e uma infraestrutura de testes mais robusta.

Implementações que misturem responsabilidades, invertam dependências ou aumentem o acoplamento entre infraestrutura, negócio, estado e apresentação devem ser revisadas antes de serem integradas ao projeto principal.

<br>


### Navegue pela documentação : 

📌 [Overview](../README.md)   
📌 [Como contribuir](./CONTRIBUTING.md)   
📌 [Como executar o projeto](./RUNNING.md)   
📌 [Principais telas do aplicativo](./SCREENS.md)  
📌 [Geração de Development Build com EAS](./EAS_BUILD.md)