# Guia de Contribuição — Rota Fácil

Toda contribuição para o Rota Fácil deve seguir os padrões técnicos e organizacionais definidos pela equipe, garantindo consistência arquitetural, previsibilidade do código e facilidade de manutenção.

As alterações devem ser realizadas em branches derivadas da branch principal de desenvolvimento. Cada contribuição precisa possuir escopo claro e limitado ao objetivo proposto, evitando alterações paralelas ou refatorações fora do contexto da demanda. Commits devem seguir convenções padronizadas, utilizando prefixos semânticos como `feat`, `fix`, `refactor`, `style`, `test`, `docs` e `chore`.

O projeto adota organização modular baseada em responsabilidade. Componentes reutilizáveis devem ser mantidos na camada de componentes compartilhados, enquanto regras de negócio, estados e fluxos específicos devem permanecer isolados dentro de suas respectivas features. Não devem ser criadas dependências cruzadas entre módulos que comprometam o desacoplamento da aplicação.

Toda implementação deve priorizar legibilidade, previsibilidade e baixo acoplamento. Nomes de arquivos, funções, variáveis e componentes devem possuir significado explícito e consistente com o domínio da aplicação. Abreviações desnecessárias, nomenclaturas genéricas e estruturas ambíguas devem ser evitadas.

Componentes React devem possuir responsabilidade única e comportamento previsível. Lógicas complexas devem ser extraídas para hooks, serviços ou camadas específicas de domínio. Componentes visuais não devem concentrar regras de negócio, chamadas HTTP ou manipulação excessiva de estado.

Funções devem ser pequenas, coesas e orientadas a uma única responsabilidade. Sempre que possível, priorizar funções puras e reutilizáveis. Duplicação de código deve ser evitada por meio de abstrações consistentes e compartilhamento controlado de comportamento.

A padronização de código é obrigatória em toda contribuição. O projeto utiliza ferramentas de lint, formatação automática e validação estática para garantir consistência entre os ambientes de desenvolvimento. Nenhuma alteração deve ser enviada sem execução prévia das validações locais.

Antes da abertura de um pull request, é obrigatório garantir que a aplicação esteja compilando corretamente, sem erros de lint, sem inconsistências de tipagem e sem código morto. Alterações visuais devem respeitar os padrões de interface já existentes no projeto.

Pull requests devem possuir descrição objetiva, contextualizando o problema resolvido, a abordagem utilizada e possíveis impactos técnicos. Sempre que necessário, incluir evidências visuais ou informações complementares que auxiliem a revisão.

Toda contribuição está sujeita à revisão técnica. Alterações poderão ser recusadas caso não estejam alinhadas aos padrões arquiteturais, práticas de qualidade ou diretrizes estabelecidas pela equipe.


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
