# Estrutura e Diretrizes Arquiteturais — Rota Fácil

O Rota Fácil foi estruturado com foco em escalabilidade, separação de responsabilidades e reutilização de código. A organização da aplicação busca reduzir acoplamento entre módulos, facilitar manutenção e permitir evolução contínua da plataforma sem comprometer a previsibilidade do projeto.

A arquitetura da aplicação segue abordagem modular baseada em domínio e responsabilidade técnica. Cada camada possui um propósito específico e deve ser utilizada respeitando os limites definidos pela arquitetura.

```txt
src/
 ├── app/
 ├── components/
 │    ├── atoms/
 │    ├── molecules/
 │    ├── organisms/
 │    └── templates/
 ├── features/
 ├── hooks/
 ├── services/
 ├── stores/
 ├── types/
 ├── utils/
 ├── styles/
 └── assets/
```

A pasta `app/` concentra a estrutura principal da aplicação, incluindo navegação, agrupamento de rotas, composição de layouts e gerenciamento dos fluxos globais. Toda definição relacionada à navegação deve permanecer isolada nesta camada.

A camada `components/` representa a biblioteca compartilhada de componentes reutilizáveis da aplicação. Sua estrutura segue os princípios do Atomic Design.

Os componentes classificados como `atoms` representam elementos básicos da interface, como botões, inputs, ícones, textos e indicadores visuais.

Os `molecules` representam composições menores de atoms que possuem responsabilidade visual específica e reutilizável.

Os `organisms` agrupam estruturas mais complexas compostas por múltiplos componentes reutilizáveis e normalmente representam blocos funcionais maiores da interface.

Os `templates` são responsáveis pela estruturação visual das telas, composição de layouts e distribuição macro dos elementos da interface.

A camada `features/` concentra as funcionalidades do sistema organizadas por domínio de negócio. Cada feature deve possuir autonomia estrutural, contendo suas próprias telas, regras de negócio, estados locais, hooks específicos e integrações necessárias.

Toda implementação nova deve ser priorizada dentro da camada de `features`, evitando centralização excessiva de lógica em estruturas globais.

A pasta `hooks/` deve conter hooks reutilizáveis e abstrações de comportamento compartilhado. Hooks específicos de uma funcionalidade devem permanecer dentro da própria feature.

A camada `services/` é responsável pela comunicação externa da aplicação, incluindo integrações HTTP, configuração de clientes de API, interceptadores, autenticação e gerenciamento de requests.

A pasta `stores/` concentra o gerenciamento de estados globais da aplicação. Apenas estados compartilhados entre múltiplos módulos devem existir nesta camada.

A camada `types/` centraliza tipagens compartilhadas da aplicação, contratos de dados e definições utilizadas entre módulos.

A pasta `utils/` deve conter apenas funções puras e reutilizáveis que não possuam dependência direta de interface, contexto global ou regras específicas de negócio.

A camada `styles/` centraliza tokens visuais, temas, definições tipográficas, espaçamentos e padronizações visuais compartilhadas.

A pasta `assets/` concentra recursos estáticos da aplicação, incluindo imagens, ícones, ilustrações, fontes e arquivos auxiliares.

O projeto adota uma abordagem de design mobile-first. Toda construção visual deve priorizar experiência em dispositivos móveis, responsividade, acessibilidade e simplicidade operacional.

A base conceitual da interface foi construída considerando aplicações modernas focadas em mobilidade e experiência operacional contínua. O sistema prioriza clareza visual, hierarquia de informação, redução de ruído visual e navegação objetiva.

As implementações visuais devem respeitar os padrões definidos pela biblioteca de componentes compartilhados. Não devem ser criados estilos isolados sem necessidade técnica clara. Componentes reutilizáveis devem sempre ser priorizados antes da criação de novas estruturas.

As funcionalidades implementadas devem seguir a divisão por domínio da plataforma. Funcionalidades relacionadas a autenticação, gerenciamento de viagens, rastreamento de rotas, gerenciamento de usuários, notificações, histórico operacional e monitoramento devem permanecer isoladas dentro de suas respectivas features.

Toda nova funcionalidade deve possuir:

* separação clara entre interface e regra de negócio;
* reutilização de componentes compartilhados;
* tipagem consistente;
* tratamento adequado de estados assíncronos;
* tratamento padronizado de erros;
* organização modular;
* baixo acoplamento;
* previsibilidade estrutural.

A arquitetura do projeto foi desenhada para permitir crescimento contínuo da plataforma sem comprometer legibilidade, reutilização e estabilidade operacional. Qualquer implementação que viole estes princípios deve ser revisada antes de integração ao projeto principal.


Navegue pela documentação : 

📌 [Overview](../README.md)   
📌 [Como contribuir](./docs/CONTRIBUTING.md)   
📌 [Como executar o projeto](./docs/RUNNING.md)   
📌 [Principais telas do aplicativo](./docs/SCREENS.md)  