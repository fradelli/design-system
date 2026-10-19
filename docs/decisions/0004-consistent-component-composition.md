# ADR 0004 — Composição consistente entre superfícies

- **Status:** aceita para implementação pelo usuário; publicação pendente
- **Data:** 2026-10-19
- **Decisão:** substitui a preservação de padding/slots da ADR 0003; mantém suas decisões de material e fronteiras da ADR 0001.

## Contexto

A revisão do catálogo mostrou título direto sem recuo, alertas sobrepostos, estados pendentes comprimidos e diferenças de tipografia. Material e composição precisam variar independentemente.

## Decisão

Card tem um único responsável pelo padding: sua raiz. O padrão usa 24 px e gap 16 px; `sm` usa 16 px e gap 12 px. Slots não duplicam recuos. Glass e solid têm mesma geometria, raio e papéis de texto. Não há uma família GlassCard concorrente.

Papéis tipográficos completos definem tamanho, entrelinha e peso: display 32/40, seção 24/32, painel/card 20/28, editorial 16/24, interface/rótulo 14/20. A fonte é fornecida pelo consumidor. Os tokens geram o CSS; utilitários explícitos continuam disponíveis para contextos legítimos.

O catálogo se organiza em Foundations, Components por família e Patterns de integração. Pastas de stories refletem a navegação. Cada estado relevante precisa ser verificável com CSS compilado e conteúdo variável.

Overlays mantêm suas APIs públicas e corrigem visibilidade, ancoragem, limites e foco. Popover separa efeitos de observação de cálculo puro. Composição asChild resolve conflitos de utilitários preservando handlers e refs.

## Compatibilidade

Minor incompatível em 0.x. Revisar overrides de Card, alturas rígidas de Button e posição de AlertAction conforme o guia de migração. Não há atualização automática de aplicativos. Os defeitos corrigidos e a suíte do pacote não substituem validação das telas reais antes da publicação.
