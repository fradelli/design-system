---
"@fradelli/ui": minor
---

Adota a linguagem visual de vidro aprovada no portfólio como fundação compartilhada. Card passa a usar vidro por padrão, com `surface="solid"` como alternativa opaca; CardTitle e SheetTitle adotam a hierarquia de título e Input recebe fundo elevado a 60%.

Mudança visual incompatível em 0.x: revisar contraste, composição e espaçamento antes do upgrade. Inclui tokens e classes públicas de superfície e tipografia, fallback opaco e redução de transparência. Consulte `docs/governance/glass-migration.md`. A publicação depende da validação do candidato nos três consumidores.

Padroniza a composição entre superfícies: Card passa a concentrar padding na raiz (24px/default, 16px/sm), sem padding lateral nos slots; papéis de seção e corpo passam a 24/32 e 16/24. Inclui papéis display/interface/label, correções de Sheet, Alert, PendingButton, Switch, RadioGroup e Popover, e stories por família. Button textual usa altura mínima e permite quebra; AlertAction ocupa uma linha reservada. Essas mudanças visuais exigem revisão dos overrides no consumidor.

Corrige também a validade nativa de RadioGroup obrigatório sem seleção: inputs internos deixam de usar readOnly, preservam FormData e direcionam o foco de erro ao item visível. Mensagens localizadas permanecem responsabilidade do consumidor.
