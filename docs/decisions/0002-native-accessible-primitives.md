# ADR 0002 — Primitives acessíveis sem dependência headless

- **Status:** aceito
- **Data:** 2026-10-04
- **Decisores:** responsável pelo produto Sandicts e frontend/design-system
- **Substitui:** a direção técnica de primitives descrita no ADR 0001

## Contexto

O ADR 0001 registrou shadcn/ui sobre Radix como direção técnica inicial. A
integração mostrou que aplicativos consumidores passaram a depender de
primitives e estilos externos além do package compartilhado. Sandicts definiu
que não terá dependência de Radix nem de bibliotecas headless equivalentes; o
Design System é responsável pelas APIs visuais e seus comportamentos acessíveis.

## Decisão

`@fradelli/ui` implementa primitives em React sobre elementos HTML e recursos
nativos do navegador. O package não depende de Radix, shadcn, ou outra
biblioteca de primitives headless. Dependências utilitárias sem comportamento
headless, como `class-variance-authority`, continuam permitidas quando usadas
pelo package.

Diálogos usam o elemento nativo `<dialog>` e `showModal()`, com foco, Escape e
camada superior fornecidos pelo navegador. Popover implementa posicionamento,
teclado, fechamento por Escape e interação externa na camada visual do package.
RadioGroup usa controles nativos e expõe a navegação de grupo por teclado. Label
e Separator usam HTML sem wrapper de terceiros. A composição `asChild` existente
usa um helper interno pequeno, sem dependência externa.

Tokens, CSS publicado e testes acessíveis permanecem responsabilidade do
Design System. Cada componente é validado em Storybook e nas fixtures de
consumidor; diferenças de produto são tratadas por composição e tokens.

## Consequências

- Aplicativos importam primitives somente de `@fradelli/ui`.
- Mudanças de comportamento nativo exigem testes em navegadores compatíveis e
  fallback previsível nos ambientes de teste.
- O CSS do package fornece transições e respeita movimento reduzido.
- O ADR 0001 continua como registro histórico; decisões não técnicas de ownership,
  tokens, fronteiras e versionamento permanecem vigentes.

## Reversão

Uma futura mudança de estratégia exige novo ADR que substitua esta decisão e
justifique as dependências e o ownership do comportamento acessível.
