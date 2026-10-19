# Changelog

## 0.5.0

### Minor Changes

- 5478cfa: Adota a linguagem visual de vidro aprovada no portfólio como fundação compartilhada. Card passa a usar vidro por padrão, com `surface="solid"` como alternativa opaca; CardTitle e SheetTitle adotam a hierarquia de título e Input recebe fundo elevado a 60%.

  Mudança visual incompatível em 0.x: revisar contraste, composição e espaçamento antes do upgrade. Inclui tokens e classes públicas de superfície e tipografia, fallback opaco e redução de transparência. Consulte `docs/governance/glass-migration.md`. A publicação inicial foi autorizada por etapas, com o portfólio como consumidor validado; os demais aplicativos exigem validação própria antes do upgrade. Consulte a ADR 0005.

  Padroniza a composição entre superfícies: Card passa a concentrar padding na raiz (24px/default, 16px/sm), sem padding lateral nos slots; papéis de seção e corpo passam a 24/32 e 16/24. Inclui papéis display/interface/label, correções de Sheet, Alert, PendingButton, Switch, RadioGroup e Popover, e stories por família. Button textual usa altura mínima e permite quebra; AlertAction ocupa uma linha reservada. Essas mudanças visuais exigem revisão dos overrides no consumidor.

  Corrige também a validade nativa de RadioGroup obrigatório sem seleção: inputs internos deixam de usar readOnly, preservam FormData e direcionam o foco de erro ao item visível. Mensagens localizadas permanecem responsabilidade do consumidor.

## 0.4.0

### Minor Changes

- ae46423: Replace Radix-backed primitives with accessible native implementations and add generic Popover and RadioGroup components.
- 2dd2eaf: Add generic accessible AlertDialog, LoadingRegion, PendingButton, and StatusBadge primitives.

## 0.3.0

### Minor Changes

- 2f43398: Adiciona NavigationItem como primitive de link de navegação com estado ativo,
  foco visível e área mínima de toque. Expõe BarbellIcon e ForkKnifeIcon por
  subpath explícito, reutilizando Phosphor sem dependências novas.

## 0.2.0

### Minor Changes

- 09488a8: Adiciona a primitive acessível `Switch` com estados controlado, desabilitado e foco visível.

## 0.1.0

### Minor Changes

- 1d695cb: Adiciona o helper `cn` e os primeiros primitives compartilhados com subpaths explícitos, testes de acessibilidade e validação em consumidores npm e pnpm.
- 858657f: Adiciona a fundação visual dark-first com tokens DTCG, Inter por variável do consumidor e CSS compatível com Tailwind 4.

Todas as mudanças relevantes de `@fradelli/ui` são registradas neste arquivo pela automação de
Changesets.
