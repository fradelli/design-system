# ADR 0003 — Linguagem visual compartilhada de vidro

- **Status:** aceita para implementação; validação dos consumidores e publicação pendentes
- **Data:** 2026-10-19
- **Decisão:** estende a ADR 0001 quanto aos consumidores e ao tratamento visual; preserva suas fronteiras arquiteturais

## Contexto

O portfólio pessoal adotou a paleta e as primitivas de `@fradelli/ui`, acrescentando vidro e hierarquia tipográfica locais. O usuário aprovou essa aparência como referência para portfólio, Kaizen e Sandicts. Copiar o CSS para cada produto criaria fontes de verdade concorrentes.

A base remota consultada já publica `0.4.0`. Esta evolução parte dela, sem alterar versões publicadas nem editar a ADR anterior.

## Decisão

O pacote compartilha superfícies de vidro e papéis tipográficos, preservando os tokens opacos e as cores existentes. Card passa a usar vidro por padrão e oferece `surface="solid"` para densidade, contraste e composição sem blur aninhado. Tamanhos, slots, padding e semântica permanecem; CardTitle adota o papel de título de card. SheetTitle usa esse mesmo papel e Input recebe o fundo elevado a 60% já utilizado no portfólio.

As classes públicas `fd-surface-glass`, `fd-surface-glass-elevated`, `fd-text-card`, `fd-text-section` e `fd-text-body` atendem composições que não exigem um novo componente. Superfícies não definem padding, raio, largura de borda ou interação. Não há uma família pública GlassCard concorrente.

Os tokens visuais usam dimensões e aliases DTCG onde aplicável. Valores CSS derivados, como `color-mix` e sombra com cor derivada, são tokens DTCG de tipo `string`, explicitamente destinados ao CSS. Não são declarados como cores DTCG estruturadas. Style Dictionary resolve suas referências e mantém a geração determinística.

Há fallback opaco na ausência de suporte, preferência de redução de transparência, cores forçadas e opt-out explícito em `html[data-fd-transparency="reduce"]`. A declaração padrão de backdrop-filter vem após a prefixed para preservar o CSS compilado. Redução de movimento continua independente.

O pacote não carrega fontes. Os consumidores fornecem Inter. Títulos de hero, estrelas, gravidade, imagens, domínio e layout de telas continuam locais. Controles com contraste e estados já adequados preservam seu tratamento; não se aplica blur indiscriminadamente a badges, tabelas e overlays.

## Compatibilidade e admissão

A evolução de tokens e da primitiva Card não introduz um padrão composto de domínio. Continuam vigentes os critérios de admissão da ADR 0001 para composições futuras.

A alteração padrão de Card, CardTitle, SheetTitle e Input é material e será uma minor incompatível em `0.x`, documentada em Changeset e guia de migração. O número final depende da fila de versões. Não há publicação nesta implementação.

A validação do artefato nos três consumidores e a revisão visual precedem o release. Cada aplicativo atualiza sua versão exata por PR própria. O Sandicts precisa revisar sua política visual e seus geradores; o Kaizen precisa revisar overrides locais. Essas migrações não são efeitos automáticos de publicar o pacote.

## Riscos e reversão

Vidro pode reduzir contraste sobre fundos claros e aumentar custo de composição. Usar uma camada por painel, fundo opaco onde necessário, revisar estados sem depender apenas de cor e comparar desempenho nas telas reais.

Reverter alterações do consumidor como unidade de código, estilos, manifesto e lockfile. Versões publicadas são imutáveis. Falta de evidência visual ou de consumo bloqueia a publicação, não é aprovação implícita.
