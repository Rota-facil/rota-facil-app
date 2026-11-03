# Estratégia de Testes

Os testes do Rota Fácil são organizados para acompanhar a separação arquitetural da aplicação. Como o projeto reúne regras de negócio, serviços HTTP, hooks React, componentes React Native e recursos nativos do Expo, uma única ferramenta não oferece o melhor equilíbrio entre velocidade e fidelidade. Por isso, o projeto utiliza Bun para verificar lógica independente do React e Jest para validar o comportamento executado dentro do ambiente React Native.

Essa divisão começa pela identificação do comportamento que está sendo testado. Quando o código pode receber entradas e produzir saídas sem depender de estado, ciclo de vida ou APIs nativas, ele pertence ao fluxo de testes de lógica. Quando o comportamento depende de renderização, estado React, contexto, efeitos, timers, Expo ou React Native, ele pertence ao fluxo de testes de UI. O resultado é uma suíte em que cada teste utiliza o ambiente mais simples capaz de representar corretamente o comportamento avaliado.

## Arquitetura dos testes

Os testes de lógica são executados pelo runner nativo do Bun e utilizam arquivos com o sufixo `.bun.test.ts`. Esse fluxo é destinado a funções puras, mapeadores, validadores, regras de negócio e serviços que possam ser exercitados sem montar uma árvore React. O Bun também pode executar testes de requisições baseadas em `fetch`, permitindo que o MSW simule o backend sem exigir a inicialização do ambiente React Native.

Os testes de UI e de hooks são executados pelo Jest com o preset `jest-expo`. Esse fluxo utiliza Babel, o renderer do React Native e o React Native Testing Library para reproduzir o ambiente necessário à renderização de componentes e hooks. Os arquivos desse grupo utilizam o sufixo `.jest.ts` ou `.jest.tsx`, e o `jest.config.ts` limita a coleta a esses padrões para impedir que o Bun tente interpretar módulos nativos do React Native.

Essa convenção de nomes também mantém os runners independentes quando o comando `bun test` procura arquivos automaticamente. Um teste de lógica como `tests/unit/cpf.bun.test.ts` é encontrado pelo Bun, enquanto um teste de renderização como `tests/unit/rendering-and-msw.jest.tsx` fica reservado ao Jest. A separação evita conflitos de transpiler, de globals de teste e de configuração de ambiente, além de tornar evidente para qualquer pessoa qual ferramenta deve ser usada ao criar um novo teste.

## Ferramentas utilizadas

O Bun é utilizado como package manager e como runner dos testes de lógica. Como package manager, ele utiliza o `bun.lock`, fornece os scripts do projeto por meio de `bun run` e mantém uma instalação reproduzível com `bun install --frozen-lockfile`. Como runner, ele oferece uma inicialização rápida e uma API de testes compatível com o estilo do Jest, mas sua responsabilidade neste projeto permanece limitada ao código que não exige o ambiente React Native.

O Jest é utilizado para os testes que precisam de integração com Expo e React Native. O `jest-expo` fornece a configuração base do SDK utilizado pelo projeto, enquanto o `@testing-library/react-native` oferece `render`, `renderHook`, `screen`, eventos e consultas orientadas ao comportamento visível. Essa combinação permite testar componentes e hooks com o ciclo de vida do React, incluindo atualizações assíncronas e efeitos.

O MSW é utilizado para interceptar requisições HTTP sem alterar os services ou o cliente HTTP da aplicação. Os handlers compartilhados ficam em `tests/mocks/handlers`, o servidor baseado em `msw/node` fica em `tests/mocks/server.ts` e o setup do Jest inicia o servidor uma vez antes da suíte, restaura handlers customizados depois de cada caso e encerra o servidor ao final. Dessa forma, cada teste pode substituir uma resposta para um cenário específico sem contaminar os testes seguintes.

O Biome, o TypeScript e o Lefthook completam o fluxo de qualidade. O Biome verifica formatação e lint, o TypeScript executa a validação estática com `tsc --noEmit` e o Lefthook automatiza verificações durante o commit e o push. O CI reproduz essas mesmas verificações em uma instalação limpa baseada no `bun.lock`, mantendo o ambiente local e o ambiente remoto alinhados.

## Como criar novos testes

Ao criar um teste, o primeiro passo é decidir se o comportamento pode ser isolado do React. Uma função que transforma um DTO, valida uma regra, calcula um estado ou monta um view model deve ser testada no fluxo de lógica. Nesse caso, crie um arquivo `.bun.test.ts`, importe as funções de `bun:test` e evite importar módulos de React Native, Expo ou componentes.

Quando o comportamento depender de um hook, contexto, componente ou efeito React, crie um arquivo `.jest.tsx` ou `.jest.ts`. Hooks não devem ser chamados diretamente como funções comuns; eles devem ser montados com `renderHook` e, quando necessário, receber um `wrapper` com os providers exigidos. Como o `render` e o `renderHook` podem concluir atualizações de forma assíncrona, operações que dependem do resultado renderizado devem utilizar `await`, `waitFor` ou outra espera explícita da Testing Library.

Os testes de serviços HTTP devem preferir os handlers do MSW a mocks internos do cliente HTTP. O teste deve chamar o service ou hook como a aplicação chama, enquanto o handler representa a resposta do servidor. Para cenários alternativos, use `MswServer.use(...)` dentro do próprio teste e deixe o setup global executar `resetHandlers()` ao final, preservando o isolamento entre casos.

A lógica complexa não deve ser mantida dentro de um hook apenas para facilitar um teste de renderização. Quando uma decisão puder ser extraída para uma função pura, essa função deve ser movida para uma camada de domínio, utilitário ou service e coberta pelo Bun. O hook deve permanecer responsável por coordenar estado, efeitos e dependências, comportamento que será coberto pelo Jest.

## Execução dos testes

O fluxo mais rápido para verificar funções puras é executado com `bun run test-logic`. Esse comando chama o runner do Bun e percorre os arquivos de teste compatíveis com os padrões do runner. Ele deve ser utilizado durante o desenvolvimento de mappers, validadores, regras de negócio e serviços que não dependam de renderização.

Os testes de componentes, hooks e integrações que utilizam React Native são executados com `bun run test-ui`. Esse comando chama o Jest em modo de CI e mantém a cobertura habilitada para o fluxo de UI. Para executar apenas um arquivo específico, utilize o caminho do teste diretamente com Jest, como em `bunx jest tests/unit/rendering-and-msw.jest.tsx --runInBand`.

Quando for necessário verificar todo o conjunto de testes, utilize `bun run test-full`. Esse script executa primeiro os testes de lógica e, depois que eles terminam com sucesso, executa os testes de UI. Essa ordem torna a falha mais fácil de localizar e evita iniciar o ambiente mais pesado do Jest quando já existe uma falha básica na lógica.

O comando `bun run test-ui-debug` deve ser usado durante a investigação de uma falha de renderização ou integração de UI. Ele executa o Jest sem cobertura, reduzindo o tempo de inicialização e deixando a saída mais direta. Para investigar uma suíte específica, combine esse script com o caminho do arquivo ou execute `bunx jest` com `--runInBand`, opção que torna a ordem de execução determinística e facilita a leitura de logs.

## Cobertura e snapshots

A cobertura do Jest pode ser executada com `bun run test`, que utiliza a configuração padrão de cobertura do projeto, ou com `bun run test-ui`, que executa o fluxo de UI em modo de CI com cobertura. A cobertura deve ser interpretada como instrumento para descobrir caminhos não exercitados, e não como substituto para cenários relevantes. Um teste deve validar comportamento observável, incluindo sucesso, erro e estados de carregamento quando esses estados fizerem parte do contrato do módulo.

Quando uma alteração legítima modificar um snapshot existente, use `bun run updateSnapshots` para atualizar os arquivos correspondentes. Snapshots não devem ser atualizados apenas para fazer uma suíte passar; a mudança deve ser revisada para confirmar que a nova representação é realmente a esperada.

## Validação local, hooks e CI

Antes de enviar uma alteração, execute `bun run lint`, `bun run typecheck` e `bun run test-full`. O hook de pre-push do Lefthook executa automaticamente o lint, a verificação de tipos e o conjunto completo de testes. O hook de pre-commit aplica o Biome aos arquivos staged, e o hook de commit-msg valida a mensagem com Commitlint usando Conventional Commits.

O workflow de CI em `.github/workflows/ci.yml` repete a validação em um ambiente limpo. Ele instala as dependências com `bun install --frozen-lockfile`, executa lint e TypeScript e roda separadamente os fluxos `test-logic` e `test-ui`. A existência de dois comandos explícitos no CI mantém visível qual ambiente falhou e impede que uma mudança na configuração de UI esconda uma falha na lógica, ou o contrário.

Esse fluxo termina com uma regra simples para a evolução do projeto: a lógica deve permanecer rápida e independente sempre que isso for possível, enquanto o comportamento que depende de React Native deve ser validado no ambiente Jest que realmente o suporta. À medida que novos testes forem adicionados, a separação por sufixo, o MSW compartilhado e os scripts padronizados manterão a suíte previsível, rápida no desenvolvimento e confiável no CI.
